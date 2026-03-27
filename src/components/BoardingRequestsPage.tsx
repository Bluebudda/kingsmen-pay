import { useState, useEffect } from 'react';
import { supabase, Application } from '../lib/supabase';
import { Search, CheckCircle, XCircle, Clock, FileText, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function BoardingRequestsPage() {
  const { employee } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (status: 'approved' | 'rejected') => {
    if (!selectedApplication || !employee) return;

    try {
      const { error: updateError } = await supabase
        .from('applications')
        .update({
          status,
          reviewed_by: employee.id,
          reviewed_at: new Date().toISOString(),
          notes: reviewNotes,
        })
        .eq('id', selectedApplication.id);

      if (updateError) throw updateError;

      if (status === 'approved') {
        const { error: merchantError } = await supabase.from('merchants').insert({
          merchant_name: selectedApplication.company_name,
          email: selectedApplication.email,
          contact_person: selectedApplication.contact_name,
          phone: selectedApplication.phone,
          company_type: selectedApplication.business_type,
          website: selectedApplication.website,
          status: 'pending',
          application_id: selectedApplication.id,
          onboarded_by: employee.id,
        });

        if (merchantError) throw merchantError;
      }

      setShowReviewModal(false);
      setSelectedApplication(null);
      setReviewNotes('');
      loadApplications();
    } catch (error) {
      console.error('Error reviewing application:', error);
      alert('Failed to review application');
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || app.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 border border-slate-200">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Boarding Requests</h2>
          <p className="text-slate-600 mt-1">Review and approve merchant applications</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Company
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Business Type
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Monthly Volume
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredApplications.map((application) => (
                <tr key={application.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{application.company_name}</div>
                      {application.website && (
                        <a
                          href={application.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center space-x-1 mt-1"
                        >
                          <span>{application.website}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">{application.contact_name}</div>
                    <div className="text-xs text-slate-500">{application.email}</div>
                    {application.phone && (
                      <div className="text-xs text-slate-500">{application.phone}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600">{application.business_type}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600">{application.monthly_volume}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        application.status
                      )}`}
                    >
                      {getStatusIcon(application.status)}
                      <span className="capitalize">{application.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedApplication(application);
                          setShowReviewModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">No applications found</p>
            </div>
          )}
        </div>
      </div>

      {showReviewModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Application Details</h3>
              <span
                className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  selectedApplication.status
                )}`}
              >
                {getStatusIcon(selectedApplication.status)}
                <span className="capitalize">{selectedApplication.status}</span>
              </span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                  <p className="text-slate-900">{selectedApplication.company_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Business Type</label>
                  <p className="text-slate-900">{selectedApplication.business_type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Name</label>
                  <p className="text-slate-900">{selectedApplication.contact_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <p className="text-slate-900">{selectedApplication.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <p className="text-slate-900">{selectedApplication.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Volume</label>
                  <p className="text-slate-900">{selectedApplication.monthly_volume}</p>
                </div>
                {selectedApplication.telegram && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Telegram</label>
                    <p className="text-slate-900">{selectedApplication.telegram}</p>
                  </div>
                )}
                {selectedApplication.whatsapp && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp</label>
                    <p className="text-slate-900">{selectedApplication.whatsapp}</p>
                  </div>
                )}
              </div>

              {selectedApplication.website && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
                  <a
                    href={selectedApplication.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {selectedApplication.website}
                  </a>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <p className="text-slate-900 whitespace-pre-wrap">{selectedApplication.description}</p>
              </div>

              {selectedApplication.notes && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Review Notes</label>
                  <p className="text-slate-900 whitespace-pre-wrap bg-slate-50 p-3 rounded-lg">
                    {selectedApplication.notes}
                  </p>
                </div>
              )}

              {selectedApplication.status === 'pending' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Add Notes</label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add review notes..."
                  />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3 mt-6">
              {selectedApplication.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleReview('approved')}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleReview('rejected')}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all flex items-center justify-center space-x-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setSelectedApplication(null);
                  setReviewNotes('');
                }}
                className="flex-1 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
