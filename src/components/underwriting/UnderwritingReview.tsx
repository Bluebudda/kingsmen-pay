import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Flag, ArrowUpCircle, ArrowLeft, Eye, FileText, Upload, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import TaskChecklist from './TaskChecklist';
import FollowUpScheduler from './FollowUpScheduler';

interface UnderwritingReviewProps {
  applicationId: string;
  kycVerificationId: string | null;
  kybVerificationId: string | null;
  onComplete: () => void;
}

interface Note {
  id: string;
  note_text: string;
  note_type: string;
  is_internal: boolean;
  created_at: string;
  created_by: string;
  employee?: {
    full_name: string;
  };
}

interface Employee {
  id: string;
  full_name: string;
}

export default function UnderwritingReview({
  applicationId,
  kycVerificationId,
  kybVerificationId,
  onComplete,
}: UnderwritingReviewProps) {
  const { employee } = useAuth();
  const [showTimeline, setShowTimeline] = useState(false);
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('medium');
  const [noteType, setNoteType] = useState('general');
  const [noteText, setNoteText] = useState('');
  const [isInternal, setIsInternal] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocType, setSelectedDocType] = useState('');
  const [uploading, setUploading] = useState(false);
  const [reviewData, setReviewData] = useState({
    decision: '',
    comments: ''
  });

  useEffect(() => {
    loadNotes();
    loadEmployees();
    loadDocuments();
  }, [applicationId]);

  const loadNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('underwriting_notes')
        .select(`
          *,
          employee:employees(full_name)
        `)
        .eq('application_id', applicationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (err) {
      console.error('Error loading notes:', err);
    }
  };

  const loadEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('id, full_name')
        .eq('is_active', true)
        .order('full_name');

      if (error) throw error;
      setEmployees(data || []);
    } catch (err) {
      console.error('Error loading employees:', err);
    }
  };

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('kyc_documents')
        .select('*')
        .eq('application_id', applicationId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      console.error('Error loading documents:', err);
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;

    try {
      const { error } = await supabase
        .from('underwriting_notes')
        .insert({
          application_id: applicationId,
          note_text: noteText,
          note_type: noteType,
          is_internal: isInternal,
          created_by: employee?.id
        });

      if (error) throw error;

      setNoteText('');
      loadNotes();
    } catch (err) {
      console.error('Error adding note:', err);
    }
  };

  const handleAssignApplication = async () => {
    if (!assignedTo) return;

    try {
      const { error } = await supabase
        .from('applications')
        .update({
          assigned_to: assignedTo,
          priority: priority
        })
        .eq('id', applicationId);

      if (error) throw error;
    } catch (err) {
      console.error('Error assigning application:', err);
    }
  };

  const handleQuickAction = async (action: 'approve' | 'decline' | 'request_info' | 'flag' | 'escalate') => {
    const statusMap = {
      approve: 'approved',
      decline: 'rejected',
      request_info: 'pending_information',
      flag: 'flagged',
      escalate: 'escalated'
    };

    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: statusMap[action] })
        .eq('id', applicationId);

      if (error) throw error;

      if (action === 'approve') {
        if (kycVerificationId) {
          await supabase
            .from('kyc_verifications')
            .update({ status: 'approved', approved_at: new Date().toISOString() })
            .eq('id', kycVerificationId);
        }

        if (kybVerificationId) {
          await supabase
            .from('kyb_verifications')
            .update({ status: 'approved', approved_at: new Date().toISOString() })
            .eq('id', kybVerificationId);
        }
      }

      onComplete();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !selectedDocType) return;

    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${applicationId}/${selectedDocType}_${Date.now()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('kyc_documents')
        .insert({
          application_id: applicationId,
          document_type: selectedDocType,
          file_path: fileName,
          file_name: file.name
        });

      if (dbError) throw dbError;

      setSelectedDocType('');
      loadDocuments();
    } catch (err) {
      console.error('Error uploading document:', err);
    } finally {
      setUploading(false);
    }
  };

  const documentTypes = [
    'Passport',
    "Driver's License",
    'National ID',
    'Proof of Address',
    'Bank Statement',
    'Utility Bill',
    'Business Registration',
    'Articles of Incorporation',
    'Tax ID',
    'Ownership Structure',
    'Financial Statements',
    'Proof of Business Address'
  ];

  return (
    <div className="space-y-6">
      <button
        onClick={onComplete}
        className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Applications</span>
      </button>

      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Underwriting Review</h1>
              <p className="text-slate-600 text-sm mt-1">N/A - personal</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors mb-6"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">{showTimeline ? 'Hide' : 'Show'} Onboarding Timeline</span>
          </button>

          {!showTimeline && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm font-medium">No onboarding activity logged for this application yet.</p>
              <p className="text-yellow-700 text-xs mt-1">This may be an older application created before tracking was enabled.</p>
            </div>
          )}

          <div className="space-y-6 mb-6">
            <TaskChecklist applicationId={applicationId} />
            <FollowUpScheduler applicationId={applicationId} />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleQuickAction('approve')}
                    className="w-full flex items-center space-x-3 bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg transition-all"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold">Approve</div>
                      <div className="text-sm text-green-100">Approve this application</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuickAction('decline')}
                    className="w-full flex items-center space-x-3 bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg transition-all"
                  >
                    <XCircle className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold">Decline</div>
                      <div className="text-sm text-red-100">Decline this application</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuickAction('request_info')}
                    className="w-full flex items-center space-x-3 bg-amber-500 hover:bg-amber-600 text-white p-4 rounded-lg transition-all"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold">Request Info</div>
                      <div className="text-sm text-amber-100">Request additional information</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuickAction('flag')}
                    className="w-full flex items-center space-x-3 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg transition-all"
                  >
                    <Flag className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold">Flag</div>
                      <div className="text-sm text-orange-100">Flag for review</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuickAction('escalate')}
                    className="w-full flex items-center space-x-3 bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg transition-all"
                  >
                    <ArrowUpCircle className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold">Escalate</div>
                      <div className="text-sm text-purple-100">Escalate to management</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Document Upload</h3>

                <div className="space-y-3">
                  <select
                    value={selectedDocType}
                    onChange={(e) => setSelectedDocType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select document type...</option>
                    {documentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>

                  <div className="flex items-center space-x-2">
                    <label className="flex-1">
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        disabled={!selectedDocType || uploading}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <div className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg transition-all cursor-pointer">
                        <Upload className="w-4 h-4" />
                        <span className="text-sm font-medium">{uploading ? 'Uploading...' : 'Upload'}</span>
                      </div>
                    </label>
                  </div>
                </div>

                {documents.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center mt-4">No documents uploaded yet</p>
                ) : (
                  <div className="mt-4 space-y-2">
                    {documents.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-700">{doc.document_type}</span>
                        </div>
                        <span className="text-xs text-slate-500">
                          {new Date(doc.uploaded_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-semibold text-slate-900">Assignment</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Assign To Employee
                    </label>
                    <select
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">Select an employee</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <button
                    onClick={handleAssignApplication}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-medium">Assign Application</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h3 className="text-sm font-semibold text-slate-900">Notes</h3>
                  </div>
                  <span className="text-xs text-slate-500">{notes.length}</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Note Type
                    </label>
                    <select
                      value={noteType}
                      onChange={(e) => setNoteType(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="general">General</option>
                      <option value="compliance">Compliance</option>
                      <option value="risk">Risk Assessment</option>
                      <option value="follow_up">Follow Up</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Note
                    </label>
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      rows={4}
                      placeholder="Add your note here..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">Internal only (not visible to customer)</span>
                  </label>

                  <button
                    onClick={handleAddNote}
                    disabled={!noteText.trim()}
                    className="w-full flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Add Note</span>
                  </button>
                </div>

                {notes.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center mt-4">No notes yet</p>
                ) : (
                  <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                    {notes.map(note => (
                      <div key={note.id} className="bg-white p-3 rounded border border-slate-200">
                        <div className="flex items-start justify-between mb-1">
                          <span className="text-xs font-medium text-slate-900">{note.note_type}</span>
                          {note.is_internal && (
                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Internal</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-700 mb-2">{note.note_text}</p>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{note.employee?.full_name || 'Unknown'}</span>
                          <span>{new Date(note.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Review Decision</h3>
                <p className="text-xs text-slate-600 mb-3">-</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
