import { useState, useEffect } from 'react';
import { Building2, Save, Send, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import DocumentUploader from './DocumentUploader';
import { getDocumentUrl } from '../../lib/documentUpload';

interface KYBDocument {
  id: string;
  document_type: string;
  document_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  is_verified: boolean;
  uploaded_at: string;
}

interface KYBVerificationProps {
  applicationId: string;
  onComplete?: () => void;
}

export default function KYBVerification({ applicationId, onComplete }: KYBVerificationProps) {
  const { employee } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [kybId, setKybId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<KYBDocument[]>([]);

  const [formData, setFormData] = useState({
    legal_business_name: '',
    trade_name: '',
    business_type: 'llc',
    registration_number: '',
    tax_id: '',
    incorporation_date: '',
    incorporation_country: '',
    business_address_line1: '',
    business_address_line2: '',
    business_city: '',
    business_state_province: '',
    business_postal_code: '',
    business_country: '',
    business_email: '',
    business_phone: '',
    website: '',
    industry_sector: '',
    business_description: '',
    annual_revenue_range: '',
    number_of_employees: '',
    regulated_entity: false,
    regulatory_body: '',
    license_numbers: '',
  });

  useEffect(() => {
    loadExistingKYB();
  }, [applicationId]);

  const loadExistingKYB = async () => {
    try {
      const { data, error } = await supabase
        .from('kyb_verifications')
        .select('*')
        .eq('application_id', applicationId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setKybId(data.id);
        setFormData({
          legal_business_name: data.legal_business_name || '',
          trade_name: data.trade_name || '',
          business_type: data.business_type || 'llc',
          registration_number: data.registration_number || '',
          tax_id: data.tax_id || '',
          incorporation_date: data.incorporation_date || '',
          incorporation_country: data.incorporation_country || '',
          business_address_line1: data.business_address_line1 || '',
          business_address_line2: data.business_address_line2 || '',
          business_city: data.business_city || '',
          business_state_province: data.business_state_province || '',
          business_postal_code: data.business_postal_code || '',
          business_country: data.business_country || '',
          business_email: data.business_email || '',
          business_phone: data.business_phone || '',
          website: data.website || '',
          industry_sector: data.industry_sector || '',
          business_description: data.business_description || '',
          annual_revenue_range: data.annual_revenue_range || '',
          number_of_employees: data.number_of_employees?.toString() || '',
          regulated_entity: data.regulated_entity || false,
          regulatory_body: data.regulatory_body || '',
          license_numbers: data.license_numbers?.join(', ') || '',
        });

        loadDocuments(data.id);
      }
    } catch (err) {
      console.error('Error loading KYB:', err);
    }
  };

  const loadDocuments = async (kybVerificationId: string) => {
    try {
      const { data, error } = await supabase
        .from('kyb_documents')
        .select('*')
        .eq('kyb_verification_id', kybVerificationId)
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
      const licenseArray = formData.license_numbers
        .split(',')
        .map(l => l.trim())
        .filter(l => l.length > 0);

      const kybData = {
        application_id: applicationId,
        assigned_to: employee?.id,
        status: submit ? 'submitted' : 'in_progress',
        legal_business_name: formData.legal_business_name,
        trade_name: formData.trade_name || null,
        business_type: formData.business_type,
        registration_number: formData.registration_number || null,
        tax_id: formData.tax_id || null,
        incorporation_date: formData.incorporation_date || null,
        incorporation_country: formData.incorporation_country,
        business_address_line1: formData.business_address_line1,
        business_address_line2: formData.business_address_line2 || null,
        business_city: formData.business_city,
        business_state_province: formData.business_state_province || null,
        business_postal_code: formData.business_postal_code,
        business_country: formData.business_country,
        business_email: formData.business_email,
        business_phone: formData.business_phone,
        website: formData.website || null,
        industry_sector: formData.industry_sector || null,
        business_description: formData.business_description || null,
        annual_revenue_range: formData.annual_revenue_range || null,
        number_of_employees: formData.number_of_employees ? parseInt(formData.number_of_employees) : null,
        regulated_entity: formData.regulated_entity,
        regulatory_body: formData.regulatory_body || null,
        license_numbers: licenseArray.length > 0 ? licenseArray : null,
        created_by: employee?.id,
        updated_by: employee?.id,
        ...(submit && { submitted_at: new Date().toISOString() }),
      };

      if (kybId) {
        const { error: updateError } = await supabase
          .from('kyb_verifications')
          .update(kybData)
          .eq('id', kybId);

        if (updateError) throw updateError;
      } else {
        const { data, error: insertError } = await supabase
          .from('kyb_verifications')
          .insert([kybData])
          .select()
          .single();

        if (insertError) throw insertError;
        setKybId(data.id);
      }

      setSuccess(submit ? 'KYB verification submitted successfully!' : 'KYB verification saved as draft');

      if (submit && onComplete) {
        setTimeout(() => onComplete(), 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save KYB verification');
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
    if (!kybId) {
      setError('Please save the KYB information first before uploading documents');
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from('kyb_documents')
        .insert([{
          kyb_verification_id: kybId,
          document_type: documentType,
          document_name: fileName,
          file_path: filePath,
          file_size: fileSize,
          mime_type: mimeType,
          uploaded_by: employee?.id,
        }]);

      if (insertError) throw insertError;

      loadDocuments(kybId);
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
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">KYB Verification</h2>
            <p className="text-sm text-slate-600">Complete business entity verification</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Legal Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="legal_business_name"
                value={formData.legal_business_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Trade Name / DBA
              </label>
              <input
                type="text"
                name="trade_name"
                value={formData.trade_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Business Type <span className="text-red-500">*</span>
              </label>
              <select
                name="business_type"
                value={formData.business_type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="sole_proprietorship">Sole Proprietorship</option>
                <option value="partnership">Partnership</option>
                <option value="llc">LLC</option>
                <option value="corporation">Corporation</option>
                <option value="non_profit">Non-Profit</option>
                <option value="trust">Trust</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Registration Number
              </label>
              <input
                type="text"
                name="registration_number"
                value={formData.registration_number}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tax ID / EIN
              </label>
              <input
                type="text"
                name="tax_id"
                value={formData.tax_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Incorporation Date
              </label>
              <input
                type="date"
                name="incorporation_date"
                value={formData.incorporation_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Country of Incorporation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="incorporation_country"
                value={formData.incorporation_country}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Business Address</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Address Line 1 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="business_address_line1"
                  value={formData.business_address_line1}
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
                  name="business_address_line2"
                  value={formData.business_address_line2}
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
                    name="business_city"
                    value={formData.business_city}
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
                    name="business_state_province"
                    value={formData.business_state_province}
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
                    name="business_postal_code"
                    value={formData.business_postal_code}
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
                    name="business_country"
                    value={formData.business_country}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Business Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="business_email"
                  value={formData.business_email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Business Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="business_phone"
                  value={formData.business_phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Business Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Industry Sector
                  </label>
                  <input
                    type="text"
                    name="industry_sector"
                    value={formData.industry_sector}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Technology, Healthcare, Retail"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Number of Employees
                  </label>
                  <input
                    type="number"
                    name="number_of_employees"
                    value={formData.number_of_employees}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Annual Revenue Range
                </label>
                <select
                  name="annual_revenue_range"
                  value={formData.annual_revenue_range}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select revenue range</option>
                  <option value="0-100k">$0 - $100,000</option>
                  <option value="100k-500k">$100,000 - $500,000</option>
                  <option value="500k-1m">$500,000 - $1,000,000</option>
                  <option value="1m-5m">$1,000,000 - $5,000,000</option>
                  <option value="5m-10m">$5,000,000 - $10,000,000</option>
                  <option value="10m+">$10,000,000+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Business Description
                </label>
                <textarea
                  name="business_description"
                  value={formData.business_description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the nature of your business, products, and services..."
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Regulatory Information</h3>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="regulated_entity"
                  checked={formData.regulated_entity}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">
                  Is this business a regulated entity?
                </span>
              </label>

              {formData.regulated_entity && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Regulatory Body <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="regulatory_body"
                      value={formData.regulatory_body}
                      onChange={handleChange}
                      required={formData.regulated_entity}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., SEC, FDA, FCA"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      License Numbers (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="license_numbers"
                      value={formData.license_numbers}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., LIC123456, REG789012"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Required Documents</h3>

            <div className="space-y-6">
              <div>
                <DocumentUploader
                  label="Articles of Incorporation / Certificate of Formation"
                  folder={`kyb/${applicationId}/incorporation`}
                  required
                  onUploadComplete={(filePath, fileName, fileSize, mimeType) =>
                    handleDocumentUpload(filePath, fileName, fileSize, mimeType, 'articles_of_incorporation')
                  }
                />
              </div>

              <div>
                <DocumentUploader
                  label="Business License"
                  folder={`kyb/${applicationId}/license`}
                  onUploadComplete={(filePath, fileName, fileSize, mimeType) =>
                    handleDocumentUpload(filePath, fileName, fileSize, mimeType, 'business_license')
                  }
                />
              </div>

              <div>
                <DocumentUploader
                  label="Tax Certificate / EIN Letter"
                  folder={`kyb/${applicationId}/tax`}
                  onUploadComplete={(filePath, fileName, fileSize, mimeType) =>
                    handleDocumentUpload(filePath, fileName, fileSize, mimeType, 'tax_certificate')
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
              disabled={saving || !kybId || documents.length < 1}
              className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
