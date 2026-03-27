import { useState, useEffect } from 'react';
import { User, FileText, AlertCircle, CheckCircle, Save, Send } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import DocumentUploader from './DocumentUploader';
import { getDocumentUrl } from '../../lib/documentUpload';

interface KYCDocument {
  id: string;
  document_type: string;
  document_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  is_verified: boolean;
  uploaded_at: string;
}

interface KYCVerificationProps {
  applicationId: string;
  onComplete?: () => void;
}

export default function KYCVerification({ applicationId, onComplete }: KYCVerificationProps) {
  const { employee } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [kycId, setKycId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<KYCDocument[]>([]);

  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    date_of_birth: '',
    nationality: '',
    country_of_residence: '',
    email: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state_province: '',
    postal_code: '',
    country: '',
    id_type: 'passport',
    id_number: '',
    id_expiry_date: '',
    id_issuing_country: '',
    is_pep: false,
    pep_details: '',
  });

  useEffect(() => {
    loadExistingKYC();
  }, [applicationId]);

  const loadExistingKYC = async () => {
    try {
      const { data, error } = await supabase
        .from('kyc_verifications')
        .select('*')
        .eq('application_id', applicationId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setKycId(data.id);
        setFormData({
          first_name: data.first_name || '',
          middle_name: data.middle_name || '',
          last_name: data.last_name || '',
          date_of_birth: data.date_of_birth || '',
          nationality: data.nationality || '',
          country_of_residence: data.country_of_residence || '',
          email: data.email || '',
          phone: data.phone || '',
          address_line1: data.address_line1 || '',
          address_line2: data.address_line2 || '',
          city: data.city || '',
          state_province: data.state_province || '',
          postal_code: data.postal_code || '',
          country: data.country || '',
          id_type: data.id_type || 'passport',
          id_number: data.id_number || '',
          id_expiry_date: data.id_expiry_date || '',
          id_issuing_country: data.id_issuing_country || '',
          is_pep: data.is_pep || false,
          pep_details: data.pep_details || '',
        });

        loadDocuments(data.id);
      }
    } catch (err) {
      console.error('Error loading KYC:', err);
    }
  };

  const loadDocuments = async (kycVerificationId: string) => {
    try {
      const { data, error } = await supabase
        .from('kyc_documents')
        .select('*')
        .eq('kyc_verification_id', kycVerificationId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      console.error('Error loading documents:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSave = async (submit: boolean = false) => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const kycData = {
        application_id: applicationId,
        assigned_to: employee?.id,
        status: submit ? 'submitted' : 'in_progress',
        ...formData,
        created_by: employee?.id,
        updated_by: employee?.id,
        ...(submit && { submitted_at: new Date().toISOString() }),
      };

      if (kycId) {
        const { error: updateError } = await supabase
          .from('kyc_verifications')
          .update(kycData)
          .eq('id', kycId);

        if (updateError) throw updateError;
      } else {
        const { data, error: insertError } = await supabase
          .from('kyc_verifications')
          .insert([kycData])
          .select()
          .single();

        if (insertError) throw insertError;
        setKycId(data.id);
      }

      setSuccess(submit ? 'KYC verification submitted successfully!' : 'KYC verification saved as draft');

      if (submit && onComplete) {
        setTimeout(() => onComplete(), 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save KYC verification');
    } finally {
      setSaving(false);
    }
  };

  const handleDocumentUpload = async (
    filePath: string,
    fileName: string,
    fileSize: number,
    mimeType: string,
    documentType: string
  ) => {
    if (!kycId) {
      setError('Please save the KYC information first before uploading documents');
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from('kyc_documents')
        .insert([{
          kyc_verification_id: kycId,
          document_type: documentType,
          document_name: fileName,
          file_path: filePath,
          file_size: fileSize,
          mime_type: mimeType,
          uploaded_by: employee?.id,
        }]);

      if (insertError) throw insertError;

      loadDocuments(kycId);
      setSuccess('Document uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save document information');
    }
  };

  const downloadDocument = async (filePath: string) => {
    const url = await getDocumentUrl(filePath);
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">KYC Verification</h2>
            <p className="text-sm text-slate-600">Complete customer identity verification</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-green-700">{success}</span>
          </div>
        )}

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Middle Name
              </label>
              <input
                type="text"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nationality <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Country of Residence <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="country_of_residence"
                value={formData.country_of_residence}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Residential Address</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Address Line 1 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address_line1"
                  value={formData.address_line1}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="address_line2"
                  value={formData.address_line2}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    State/Province
                  </label>
                  <input
                    type="text"
                    name="state_province"
                    value={formData.state_province}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Identification Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  ID Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="id_type"
                  value={formData.id_type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="passport">Passport</option>
                  <option value="drivers_license">Driver's License</option>
                  <option value="national_id">National ID</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  ID Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="id_number"
                  value={formData.id_number}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="id_expiry_date"
                  value={formData.id_expiry_date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Issuing Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="id_issuing_country"
                  value={formData.id_issuing_country}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">PEP Screening</h3>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="is_pep"
                  checked={formData.is_pep}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">
                  Is this person a Politically Exposed Person (PEP)?
                </span>
              </label>

              {formData.is_pep && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    PEP Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="pep_details"
                    value={formData.pep_details}
                    onChange={handleChange}
                    rows={3}
                    required={formData.is_pep}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Provide details about PEP status..."
                  />
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Required Documents</h3>

            <div className="space-y-6">
              <div>
                <DocumentUploader
                  label="Government-Issued ID (Passport/Driver's License/National ID)"
                  folder={`kyc/${applicationId}/id`}
                  required
                  onUploadComplete={(filePath, fileName, fileSize, mimeType) =>
                    handleDocumentUpload(filePath, fileName, fileSize, mimeType, formData.id_type)
                  }
                />
              </div>

              <div>
                <DocumentUploader
                  label="Proof of Address (Utility Bill/Bank Statement - max 3 months old)"
                  folder={`kyc/${applicationId}/address`}
                  required
                  onUploadComplete={(filePath, fileName, fileSize, mimeType) =>
                    handleDocumentUpload(filePath, fileName, fileSize, mimeType, 'proof_of_address')
                  }
                />
              </div>

              {documents.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Uploaded Documents</h4>
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-slate-600" />
                          <div>
                            <p className="text-sm font-medium text-slate-900">{doc.document_name}</p>
                            <p className="text-xs text-slate-500">
                              {doc.document_type.replace(/_/g, ' ')} • {new Date(doc.uploaded_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => downloadDocument(doc.file_path)}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-6 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Draft</span>
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={saving || !kycId || documents.length < 2}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{saving ? 'Submitting...' : 'Submit for Review'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
