import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import UserManagement from './merchant/UserManagement';
import {
  LogOut,
  TrendingUp,
  TrendingDown,
  Activity,
  FileText,
  Key,
  Settings,
  MessageSquare,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Users,
} from 'lucide-react';

interface MerchantUser {
  id: string;
  merchant_id: string;
  role: string;
}

interface Merchant {
  id: string;
  business_name: string;
  status: string;
}

interface Analytics {
  payin_volume: number;
  payin_count: number;
  payout_volume: number;
  payout_count: number;
  successful_transactions: number;
  failed_transactions: number;
  success_rate: number;
}

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

interface Application {
  id: string;
  company_name: string;
  status: string;
  created_at: string;
  industry: string;
  unread_messages?: number;
}

interface APICredential {
  id: string;
  api_key: string;
  environment: string;
  is_active: boolean;
  created_at: string;
}

export default function MerchantDashboard() {
  const { user, signOut } = useAuth();
  const [merchantUser, setMerchantUser] = useState<MerchantUser | null>(null);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [apiCredentials, setApiCredentials] = useState<APICredential[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'applications' | 'api' | 'users' | 'settings'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      window.location.href = '/merchant-login';
      return;
    }

    loadMerchantData();
  }, [user]);

  const loadMerchantData = async () => {
    if (!user) return;

    try {
      const { data: merchantUserData } = await supabase
        .from('merchant_users')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!merchantUserData) {
        window.location.href = '/merchant-login';
        return;
      }

      setMerchantUser(merchantUserData);

      const { data: merchantData } = await supabase
        .from('merchants')
        .select('*')
        .eq('id', merchantUserData.merchant_id)
        .maybeSingle();

      setMerchant(merchantData);

      const today = new Date().toISOString().split('T')[0];
      const { data: analyticsData } = await supabase
        .from('merchant_analytics')
        .select('*')
        .eq('merchant_id', merchantUserData.merchant_id)
        .eq('date', today)
        .maybeSingle();

      setAnalytics(analyticsData);

      const { data: transactionsData } = await supabase
        .from('transactions')
        .select('*')
        .eq('merchant_id', merchantUserData.merchant_id)
        .order('created_at', { ascending: false })
        .limit(10);

      setTransactions(transactionsData || []);

      const { data: applicationsData } = await supabase
        .from('applications')
        .select('*')
        .eq('merchant_id', merchantUserData.merchant_id)
        .order('created_at', { ascending: false });

      setApplications(applicationsData || []);

      if (merchantUserData.role === 'admin') {
        const { data: credentialsData } = await supabase
          .from('merchant_api_credentials')
          .select('*')
          .eq('merchant_id', merchantUserData.merchant_id);

        setApiCredentials(credentialsData || []);
      }
    } catch (error) {
      console.error('Error loading merchant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/merchant-login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
      case 'under_review':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{merchant?.business_name || 'Merchant Portal'}</h1>
              <p className="text-sm text-gray-500">Welcome back, {user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'transactions'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'applications'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Applications
            </button>
            {merchantUser?.role === 'admin' && (
              <>
                <button
                  onClick={() => setActiveTab('api')}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === 'api'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  API Credentials
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === 'users'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Users
                </button>
              </>
            )}
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">PayIn Volume</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      ${analytics?.payin_volume?.toLocaleString() || '0'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{analytics?.payin_count || 0} transactions</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-green-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">PayOut Volume</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      ${analytics?.payout_volume?.toLocaleString() || '0'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{analytics?.payout_count || 0} transactions</p>
                  </div>
                  <TrendingDown className="w-10 h-10 text-blue-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {analytics?.success_rate?.toFixed(1) || '0'}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {analytics?.successful_transactions || 0} successful
                    </p>
                  </div>
                  <Activity className="w-10 h-10 text-green-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Failed Transactions</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {analytics?.failed_transactions || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Today</p>
                  </div>
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                          No transactions yet
                        </td>
                      </tr>
                    ) : (
                      transactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {transaction.transaction_type}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {transaction.amount} {transaction.currency}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(transaction.status)}
                              <span className="text-sm text-gray-900 capitalize">{transaction.status}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-mono text-gray-600">
                          {transaction.id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {transaction.transaction_type}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {transaction.amount} {transaction.currency}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(transaction.status)}
                            <span className="text-sm text-gray-900 capitalize">{transaction.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(transaction.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-6">
            {applications.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No applications found</p>
              </div>
            ) : (
              applications.map((application) => (
                <div
                  key={application.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => window.location.href = `/merchant-dashboard/application/${application.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.company_name || 'Application'}
                        </h3>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(application.status)}
                          <span className="text-sm text-gray-600 capitalize">{application.status}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{application.industry}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Submitted {new Date(application.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {application.unread_messages && application.unread_messages > 0 && (
                      <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm font-medium">{application.unread_messages}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'api' && merchantUser?.role === 'admin' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">API Credentials</h2>
              <p className="text-sm text-gray-600 mt-1">Manage your API keys for integration</p>
            </div>
            <div className="p-6 space-y-4">
              {apiCredentials.length === 0 ? (
                <div className="text-center py-8">
                  <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No API credentials found</p>
                  <p className="text-sm text-gray-400 mt-1">Contact support to generate API keys</p>
                </div>
              ) : (
                apiCredentials.map((credential) => (
                  <div
                    key={credential.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Key className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-900 capitalize">
                          {credential.environment}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          credential.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {credential.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded font-mono text-sm text-gray-700 break-all">
                      {credential.api_key}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Created {new Date(credential.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && merchantUser?.role === 'admin' && (
          <UserManagement
            merchantId={merchantUser.merchant_id}
            currentUserRole={merchantUser.role}
          />
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input
                  type="text"
                  value={merchantUser?.role || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 capitalize"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Merchant Status</label>
                <input
                  type="text"
                  value={merchant?.status || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 capitalize"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
