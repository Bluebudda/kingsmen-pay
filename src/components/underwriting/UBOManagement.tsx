import { useState, useEffect } from 'react';
import { Users, Plus, Trash2, AlertCircle, CheckCircle, FileText, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import DocumentUploader from './DocumentUploader';
import { getDocumentUrl } from '../../lib/documentUpload';

interface UBORecord {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  date_of_birth: string;
  nationality: string;
  email: string;
  phone: string;
  residential_address: string;
  country_of_residence: string;
  ownership_percentage: number;
  ownership_type: string;
  control_type: string[];
  is_direct_owner: boolean;
  id_type: string;
  id_number: string;
  id_expiry_date: string;
  id_issuing_country: string;
  is_pep: boolean;
  pep_details: string;
  is_verified: boolean;
}

interface UBODocument {
  id: string;
  ubo_record_id: string;
  document_type: string;
  document_name: string;
  file_path: string;
  uploaded_at: string;
}

interface UBOManagementProps {
  kybVerificationId: string;
}

export default function UBOManagement({ kybVerificationId }: UBOManagementProps) {
  const { employee } = useAuth();
  const [ubos, setUbos] = useState<UBORecord[]>([]);
  const [documents, setDocuments] = useState<Record<string, UBODocument[]>>({});
  const [selectedUbo, setSelectedUbo] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    date_of_birth: '',
    nationality: '',
    email: '',
    phone: '',
    residential_address: '',
    country_of_residence: '',
    ownership_percentage: '',
    ownership_type: 'shares',
    control_type: [] as string[],
    is_direct_owner: true,
    id_type: 'passport',
    id_number: '',
    id_expiry_date: '',
    id_issuing_country: '',
    is_pep: false,
    pep_details: '',
  });

  useEffect(() => {
    loadUBOs();
  }, [kybVerificationId]);

  const loadUBOs = async () => {
    try {
      const { data, error } = await supabase
        .from('ubo_records')
        .select('*')
        .eq('kyb_verification_id', kybVerificationId)
        .order('ownership_percentage', { ascending: false });

      if (error) throw error;
      setUbos(data || []);

      data?.forEach(ubo => loadDocuments(ubo.id));
    } catch (err) {
      console.error('Error loading UBOs:', err);
      setError('Failed to load UBO records');
    }
  };

  const loadDocuments = async (uboId: string) => {
    try {
      const { data, error } = await supabase
        .from('ubo_documents')
        .select('*')
        .eq('ubo_record_id', uboId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;

      setDocuments(prev => ({
        ...prev,
        [uboId]: data || [],
      }));
    } catch (err) {
      console.error('Error loading UBO documents:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (name === 'control_type') {
      const checkbox = e.target as HTMLInputElement;
      const currentTypes = formData.control_type;

      if (checkbox.checked) {
        setFormData(prev => ({
          ...prev,
          control_type: [...currentTypes, value],
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          control_type: currentTypes.filter(t => t !== value),
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      }));
    }
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const ownershipPercentage = parseFloat(formData.ownership_percentage);

      if (isNaN(ownershipPercentage) || ownershipPercentage < 0 || ownershipPercentage > 100) {
        throw new Error('Ownership percentage must be between 0 and 100');
      }

      const totalOwnership = ubos
        .filter(ubo => selectedUbo !== ubo.id)
        .reduce((sum, ubo) => sum + parseFloat(ubo.ownership_percentage.toString()), 0);

      if (totalOwnership + ownershipPercentage > 100) {
        throw new Error('Total ownership percentage cannot exceed 100%');
      }

      const uboData = {
        kyb_verification_id: kybVerificationId,
        first_name: formData.first_name,
        middle_name: formData.middle_name || null,
        last_name: formData.last_name,
        date_of_birth: formData.date_of_birth,
        nationality: formData.nationality,
        email: formData.email || null,
        phone: formData.phone || null,
        residential_address: formData.residential_address || null,
        country_of_residence: formData.country_of_residence || null,
        ownership_percentage: ownershipPercentage,
        ownership_type: formData.ownership_type || null,
        control_type: formData.control_type.length > 0 ? formData.control_type : null,
        is_direct_owner: formData.is_direct_owner,
        id_type: formData.id_type || null,
        id_number: formData.id_number || null,
        id_expiry_date: formData.id_expiry_date || null,
        id_issuing_country: formData.id_issuing_country || null,
        is_pep: formData.is_pep,
        pep_details: formData.pep_details || null,
        created_by: employee?.id,
      };

      if (selectedUbo) {
        const { error: updateError } = await supabase
          .from('ubo_records')
          .update(uboData)
          .eq('id', selectedUbo);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('ubo_records')
          .insert([uboData]);

        if (insertError) throw insertError;
      }

      setSuccess('UBO record saved successfully');
      setShowForm(false);
      resetForm();
      loadUBOs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save UBO record');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ubo: UBORecord) => {
    setSelectedUbo(ubo.id);
    setFormData({
      first_name: ubo.first_name,
      middle_name: ubo.middle_name || '',
      last_name: ubo.last_name,
      date_of_birth: ubo.date_of_birth,
      nationality: ubo.nationality,
      email: ubo.email || '',
      phone: ubo.phone || '',
      residential_address: ubo.residential_address || '',
      country_of_residence: ubo.country_of_residence || '',
      ownership_percentage: ubo.ownership_percentage.toString(),
      ownership_type: ubo.ownership_type || 'shares',
      control_type: ubo.control_type || [],
      is_direct_owner: ubo.is_direct_owner,
      id_type: ubo.id_type || 'passport',
      id_number: ubo.id_number || '',
      id_expiry_date: ubo.id_expiry_date || '',
      id_issuing_country: ubo.id_issuing_country || '',
      is_pep: ubo.is_pep,
      pep_details: ubo.pep_details || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (uboId: string) => {
    if (!confirm('Are you sure you want to delete this UBO record?')) return;

    try {
      const { error } = await supabase
        .from('ubo_records')
        .delete()
        .eq('id', uboId);

      if (error) throw error;

      setSuccess('UBO record deleted successfully');
      loadUBOs();
    } catch (err) {
      setError('Failed to delete UBO record');
    }
  };

  const resetForm = () => {
    setSelectedUbo(null);
    setFormData({
      first_name: '',
      middle_name: '',
      last_name: '',
      date_of_birth: '',
      nationality: '',
      email: '',
      phone: '',
      residential_address: '',
      country_of_residence: '',
      ownership_percentage: '',
      ownership_type: 'shares',
      control_type: [],
      is_direct_owner: true,
      id_type: 'passport',
      id_number: '',
      id_expiry_date: '',
      id_issuing_country: '',
      is_pep: false,
      pep_details: '',
    });
  };

  const handleDocumentUpload = async (
    uboId: string,
    filePath: string,
    fileName: string,
    fileSize: number,
    mimeType: string,
    documentType: string
  ) => {
    try {
      const { error: insertError } = await supabase
        .from('ubo_documents')
        .insert([{
          ubo_record_id: uboId,
          document_type: documentType,
          document_name: fileName,
          file_path: filePath,
          file_size: fileSize,
          mime_type: mimeType,
          uploaded_by: employee?.id,
        }]);

      if (insertError) throw insertError;

      loadDocuments(uboId);
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

  const totalOwnership = ubos.reduce((sum, ubo) => sum + parseFloat(ubo.ownership_percentage.toString()), 0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Ultimate Beneficial Owners (UBO)</h2>
              <p className="text-sm text-slate-600">
                Individuals owning 25% or more, or exercising control
              </p>
            </div>
          </div>

          {!showForm && (
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add UBO</span>
            </button>
          )}
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

        {!showForm && ubos.length > 0 && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900">
              Total Ownership Declared: <span className="text-lg">{totalOwnership.toFixed(2)}%</span>
            </p>
            {totalOwnership < 100 && (
              <p className="text-xs text-blue-700 mt-1">
                Remaining: {(100 - totalOwnership).toFixed(2)}%
              </p>
            )}
          </div>
        )}

        {showForm ? (
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Country of Residence
                </label>
                <input
                  type="text"
                  name="country_of_residence"
                  value={formData.country_of_residence}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Residential Address
              </label>
              <input
                type="text"
                name="residential_address"
                value={formData.residential_address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Ownership Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ownership % <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="ownership_percentage"
                    value={formData.ownership_percentage}
                    onChange={handleChange}
                    required
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ownership Type
                  </label>
                  <select
                    name="ownership_type"
                    value={formData.ownership_type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="shares">Shares</option>
                    <option value="voting_rights">Voting Rights</option>
                    <option value="other_means">Other Means</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center space-x-3 pt-7">
                    <input
                      type="checkbox"
                      name="is_direct_owner"
                      checked={formData.is_direct_owner}
                      onChange={handleChange}
                      className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Direct Owner
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Type of Control
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['Ownership', 'Voting Rights', 'Board Appointment', 'Management Control', 'Other'].map((type) => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="control_type"
                        value={type}
                        checked={formData.control_type.includes(type)}
                        onChange={handleChange}
                        className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="text-sm text-slate-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Identification</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    ID Type
                  </label>
                  <select
                    name="id_type"
                    value={formData.id_type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="passport">Passport</option>
                    <option value="drivers_license">Driver's License</option>
                    <option value="national_id">National ID</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    ID Number
                  </label>
                  <input
                    type="text"
                    name="id_number"
                    value={formData.id_number}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    name="id_expiry_date"
                    value={formData.id_expiry_date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Issuing Country
                  </label>
                  <input
                    type="text"
                    name="id_issuing_country"
                    value={formData.id_issuing_country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="is_pep"
                  checked={formData.is_pep}
                  onChange={handleChange}
                  className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-slate-700">
                  Politically Exposed Person (PEP)
                </span>
              </label>

              {formData.is_pep && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    PEP Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="pep_details"
                    value={formData.pep_details}
                    onChange={handleChange}
                    rows={3}
                    required={formData.is_pep}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Provide details about PEP status..."
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="px-6 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save UBO'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {ubos.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600">No UBO records added yet</p>
                <p className="text-sm text-slate-500 mt-1">
                  Add individuals who own 25% or more, or exercise control over the business
                </p>
              </div>
            ) : (
              ubos.map((ubo) => (
                <div key={ubo.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {ubo.first_name} {ubo.middle_name} {ubo.last_name}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                        <div>
                          <span className="text-slate-500">Ownership:</span>
                          <p className="font-medium text-slate-900">{ubo.ownership_percentage}%</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Nationality:</span>
                          <p className="font-medium text-slate-900">{ubo.nationality}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Type:</span>
                          <p className="font-medium text-slate-900">
                            {ubo.is_direct_owner ? 'Direct' : 'Indirect'}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-500">Status:</span>
                          <p className={`font-medium ${ubo.is_verified ? 'text-green-600' : 'text-amber-600'}`}>
                            {ubo.is_verified ? 'Verified' : 'Pending'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(ubo)}
                        className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ubo.id)}
                        className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <h4 className="text-sm font-medium text-slate-700 mb-3">Documents</h4>

                    <div className="space-y-3">
                      <DocumentUploader
                        label="ID Document"
                        folder={`ubo/${ubo.id}/id`}
                        onUploadComplete={(filePath, fileName, fileSize, mimeType) =>
                          handleDocumentUpload(ubo.id, filePath, fileName, fileSize, mimeType, 'passport')
                        }
                      />

                      {documents[ubo.id] && documents[ubo.id].length > 0 && (
                        <div className="space-y-2">
                          {documents[ubo.id].map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg"
                            >
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4 text-slate-600" />
                                <div>
                                  <p className="text-sm font-medium text-slate-900">{doc.document_name}</p>
                                  <p className="text-xs text-slate-500">
                                    {new Date(doc.uploaded_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => downloadDocument(doc.file_path)}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                              >
                                View
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
