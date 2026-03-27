import { useState, useEffect } from 'react';
import { supabase, Merchant, MerchantCredential } from '../lib/supabase';
import { Plus, Search, Building2, CheckCircle, XCircle, Clock, Ban, Key, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface MerchantWithCredentials extends Merchant {
  credentials?: MerchantCredential[];
}

export default function MerchantManagement() {
  const { employee } = useAuth();
  const [merchants, setMerchants] = useState<MerchantWithCredentials[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCredentialModal, setShowCredentialModal] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [credentialForm, setCredentialForm] = useState({
    api_key: '',
    api_secret: '',
    skyphoenix_merchant_id: '',
    environment: 'dev' as 'dev' | 'production',
  });

  useEffect(() => {
    loadMerchants();
  }, []);

  const loadMerchants = async () => {
    try {
      const { data: merchantsData, error } = await supabase
        .from('merchants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const merchantsWithCreds = await Promise.all(
        (merchantsData || []).map(async (merchant) => {
          const { data: credentials } = await supabase
            .from('merchant_credentials')
            .select('*')
            .eq('merchant_id', merchant.id);

          return { ...merchant, credentials: credentials || [] };
        })
      );

      setMerchants(merchantsWithCreds);
    } catch (error) {
      console.error('Error loading merchants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCredentials = async () => {
    if (!selectedMerchant) return;

    try {
      const { error } = await supabase.from('merchant_credentials').insert({
        merchant_id: selectedMerchant.id,
        api_key: credentialForm.api_key,
        api_secret: credentialForm.api_secret,
        skyphoenix_merchant_id: credentialForm.skyphoenix_merchant_id,
        environment: credentialForm.environment,
        is_active: true,
      });

      if (error) throw error;

      await sendCredentialsEmail(selectedMerchant.email, credentialForm);

      setShowCredentialModal(false);
      setCredentialForm({
        api_key: '',
        api_secret: '',
        skyphoenix_merchant_id: '',
        environment: 'dev',
      });
      loadMerchants();
    } catch (error) {
      console.error('Error adding credentials:', error);
      alert('Failed to add credentials');
    }
  };

  const sendCredentialsEmail = async (email: string, credentials: typeof credentialForm) => {
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-application-confirmation`;
      const token = (await supabase.auth.getSession()).data.session?.access_token;

      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: 'Your Kingsmen Pay API Credentials',
          html: `
            <h2>Welcome to Kingsmen Pay!</h2>
            <p>Your merchant account has been set up. Here are your API credentials:</p>
            <ul>
              <li><strong>Merchant ID:</strong> ${credentials.skyphoenix_merchant_id}</li>
              <li><strong>API Key:</strong> ${credentials.api_key}</li>
              <li><strong>API Secret:</strong> ${credentials.api_secret}</li>
              <li><strong>Environment:</strong> ${credentials.environment}</li>
            </ul>
            <p><strong>Important:</strong> Keep these credentials secure and never share them publicly.</p>
            <p>Dev Portal: <a href="https://dev-admin.skyphoenix.net">dev-admin.skyphoenix.net</a></p>
          `,
        }),
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const updateMerchantStatus = async (merchantId: string, status: Merchant['status']) => {
    try {
      const { error } = await supabase
        .from('merchants')
        .update({ status })
        .eq('id', merchantId);

      if (error) throw error;
      loadMerchants();
    } catch (error) {
      console.error('Error updating merchant status:', error);
    }
  };

  const filteredMerchants = merchants.filter(
    (merchant) =>
      merchant.merchant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.contact_person.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'suspended':
        return <Ban className="w-4 h-4 text-orange-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-orange-100 text-orange-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
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
          <h2 className="text-2xl font-bold text-slate-900">Merchant Management</h2>
          <p className="text-slate-600 mt-1">Manage merchant accounts and API credentials</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search merchants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Merchant
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Credentials
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredMerchants.map((merchant) => (
                <tr key={merchant.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">{merchant.merchant_name}</div>
                        <div className="text-xs text-slate-500">{merchant.website || 'No website'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">{merchant.contact_person}</div>
                    <div className="text-xs text-slate-500">{merchant.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        merchant.status
                      )}`}
                    >
                      {getStatusIcon(merchant.status)}
                      <span className="capitalize">{merchant.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600">
                      {merchant.credentials && merchant.credentials.length > 0 ? (
                        <span className="text-green-600 font-medium">
                          {merchant.credentials.length} configured
                        </span>
                      ) : (
                        <span className="text-slate-400">No credentials</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {merchant.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateMerchantStatus(merchant.id, 'active')}
                            className="text-green-600 hover:text-green-800 transition-colors text-sm font-medium"
                          >
                            Activate
                          </button>
                          <span className="text-slate-300">|</span>
                        </>
                      )}
                      {merchant.status === 'active' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedMerchant(merchant);
                              setShowCredentialModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-1 text-sm font-medium"
                          >
                            <Key className="w-3 h-3" />
                            <span>Add Creds</span>
                          </button>
                          <span className="text-slate-300">|</span>
                        </>
                      )}
                      <button
                        onClick={() =>
                          updateMerchantStatus(
                            merchant.id,
                            merchant.status === 'suspended' ? 'active' : 'suspended'
                          )
                        }
                        className="text-orange-600 hover:text-orange-800 transition-colors text-sm font-medium"
                      >
                        {merchant.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredMerchants.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">No merchants found</p>
            </div>
          )}
        </div>
      </div>

      {showCredentialModal && selectedMerchant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Add API Credentials for {selectedMerchant.merchant_name}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  SkyPhoenix Merchant ID
                </label>
                <input
                  type="text"
                  value={credentialForm.skyphoenix_merchant_id}
                  onChange={(e) =>
                    setCredentialForm({ ...credentialForm, skyphoenix_merchant_id: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">API Key</label>
                <input
                  type="text"
                  value={credentialForm.api_key}
                  onChange={(e) => setCredentialForm({ ...credentialForm, api_key: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">API Secret</label>
                <input
                  type="text"
                  value={credentialForm.api_secret}
                  onChange={(e) => setCredentialForm({ ...credentialForm, api_secret: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Environment</label>
                <select
                  value={credentialForm.environment}
                  onChange={(e) =>
                    setCredentialForm({
                      ...credentialForm,
                      environment: e.target.value as 'dev' | 'production',
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="dev">Development</option>
                  <option value="production">Production</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={handleAddCredentials}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center space-x-2"
              >
                <Mail className="w-4 h-4" />
                <span>Add & Send Email</span>
              </button>
              <button
                onClick={() => {
                  setShowCredentialModal(false);
                  setCredentialForm({
                    api_key: '',
                    api_secret: '',
                    skyphoenix_merchant_id: '',
                    environment: 'dev',
                  });
                }}
                className="flex-1 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
