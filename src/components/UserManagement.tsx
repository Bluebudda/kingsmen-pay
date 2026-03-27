import { useState, useEffect } from 'react';
import { Users, Eye, Key, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UserAccount {
  id: string;
  email: string;
  created_at: string;
  role: string;
  role_details: any;
  last_sign_in_at?: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [impersonating, setImpersonating] = useState(false);
  const [testCredentials, setTestCredentials] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
    loadTestCredentials();
  }, []);

  const loadTestCredentials = () => {
    const credentials = [
      { email: 'employee@test.com', password: 'Test123!@#', role: 'Employee' },
      { email: 'agent@test.com', password: 'Test123!@#', role: 'Agent' },
      { email: 'partner@test.com', password: 'Test123!@#', role: 'Partner' },
      { email: 'merchant@test.com', password: 'Test123!@#', role: 'Merchant' }
    ];
    setTestCredentials(credentials);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Fetch employees
      const { data: employees } = await supabase
        .from('employees')
        .select('id, user_id, email, full_name, role, created_at')
        .order('created_at', { ascending: false });

      // Fetch agents
      const { data: agents } = await supabase
        .from('agents')
        .select('id, user_id, email, full_name, agent_code, commission_rate, created_at')
        .order('created_at', { ascending: false });

      // Fetch partners
      const { data: partners } = await supabase
        .from('partners')
        .select('id, user_id, email, full_name, company_name, partner_code, commission_rate, created_at')
        .order('created_at', { ascending: false });

      // Fetch merchants (via merchant_users)
      const { data: merchantUsers } = await supabase
        .from('merchant_users')
        .select(`
          user_id,
          is_primary_contact,
          role,
          created_at,
          merchant_id,
          merchants (
            id,
            merchant_name,
            email,
            contact_person
          )
        `)
        .order('created_at', { ascending: false });

      const allUsers: UserAccount[] = [];

      employees?.forEach(emp => {
        if (emp.user_id) {
          allUsers.push({
            id: emp.user_id,
            email: emp.email,
            created_at: emp.created_at,
            role: 'Employee',
            role_details: emp
          });
        }
      });

      agents?.forEach(agent => {
        if (agent.user_id) {
          allUsers.push({
            id: agent.user_id,
            email: agent.email,
            created_at: agent.created_at,
            role: 'Agent',
            role_details: agent
          });
        }
      });

      partners?.forEach(partner => {
        if (partner.user_id) {
          allUsers.push({
            id: partner.user_id,
            email: partner.email,
            created_at: partner.created_at,
            role: 'Partner',
            role_details: partner
          });
        }
      });

      merchantUsers?.forEach(mu => {
        if (mu.user_id && mu.merchants) {
          allUsers.push({
            id: mu.user_id,
            email: mu.merchants.email,
            created_at: mu.created_at,
            role: 'Merchant',
            role_details: {
              merchant_name: mu.merchants.merchant_name,
              contact_person: mu.merchants.contact_person,
              is_primary_contact: mu.is_primary_contact
            }
          });
        }
      });

      setUsers(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImpersonate = async (email: string, password: string, role: string) => {
    try {
      setImpersonating(true);

      // Sign in as the user
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        alert(`Failed to sign in: ${error.message}`);
        return;
      }

      // Redirect based on role
      const roleRoutes: Record<string, string> = {
        'Employee': '/dashboard',
        'Agent': '/agent/dashboard',
        'Partner': '/partner/dashboard',
        'Merchant': '/merchant/dashboard'
      };

      const route = roleRoutes[role] || '/';
      window.location.href = route;
    } catch (error) {
      console.error('Error impersonating user:', error);
      alert('Failed to impersonate user');
    } finally {
      setImpersonating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Test Credentials Card */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
          <Key className="w-5 h-5 text-blue-600" />
          <span>Test Account Credentials</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {testCredentials.map((cred, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="font-semibold text-slate-900 mb-2">{cred.role}</div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Email:</span>
                  <button
                    onClick={() => copyToClipboard(cred.email)}
                    className="text-blue-600 hover:text-blue-700 font-mono text-xs"
                  >
                    {cred.email}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Password:</span>
                  <button
                    onClick={() => copyToClipboard(cred.password)}
                    className="text-blue-600 hover:text-blue-700 font-mono text-xs"
                  >
                    {cred.password}
                  </button>
                </div>
              </div>
              <button
                onClick={() => handleImpersonate(cred.email, cred.password, cred.role)}
                disabled={impersonating}
                className="mt-3 w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
              >
                <Eye className="w-4 h-4" />
                <span>{impersonating ? 'Logging in...' : 'Login As'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* All Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">All User Accounts ({users.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{user.email}</div>
                    <div className="text-xs text-slate-500">{user.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'Employee' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'Agent' ? 'bg-green-100 text-green-800' :
                      user.role === 'Partner' ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">
                      {user.role === 'Employee' && user.role_details.full_name}
                      {user.role === 'Agent' && (
                        <>
                          {user.role_details.full_name}
                          <span className="text-slate-500 ml-2">({user.role_details.agent_code})</span>
                        </>
                      )}
                      {user.role === 'Partner' && (
                        <>
                          {user.role_details.company_name}
                          <span className="text-slate-500 ml-2">({user.role_details.partner_code})</span>
                        </>
                      )}
                      {user.role === 'Merchant' && user.role_details.merchant_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {testCredentials.find(c => c.email === user.email) && (
                      <button
                        onClick={() => {
                          const cred = testCredentials.find(c => c.email === user.email);
                          if (cred) handleImpersonate(cred.email, cred.password, user.role);
                        }}
                        disabled={impersonating}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Login As</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
