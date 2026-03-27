import { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp, FileText, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Agent {
  id: string;
  agent_code: string;
  full_name: string;
  email: string;
  commission_rate: number;
  territory: string;
  total_referrals: number;
  total_earnings: number;
}

interface Referral {
  id: string;
  application_id: string;
  commission_amount: number;
  commission_paid: boolean;
  created_at: string;
  application?: {
    business_name: string;
    status: string;
  };
}

export default function AgentDashboard() {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgentData();
  }, []);

  const loadAgentData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = '/agent/login';
        return;
      }

      const { data: agentData, error: agentError } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (agentError) throw agentError;
      setAgent(agentData);

      const { data: referralsData, error: referralsError } = await supabase
        .from('referrals')
        .select(`
          *,
          application:applications(business_name, status)
        `)
        .eq('referrer_type', 'agent')
        .eq('referrer_id', agentData.id)
        .order('created_at', { ascending: false });

      if (referralsError) throw referralsError;
      setReferrals(referralsData || []);
    } catch (err) {
      console.error('Error loading agent data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/agent/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="text-center">
          <p className="text-red-600">Agent data not found</p>
        </div>
      </div>
    );
  }

  const pendingEarnings = referrals
    .filter(r => !r.commission_paid)
    .reduce((sum, r) => sum + (r.commission_amount || 0), 0);

  const paidEarnings = referrals
    .filter(r => r.commission_paid)
    .reduce((sum, r) => sum + (r.commission_amount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Agent Portal</h1>
                <p className="text-xs text-slate-600">{agent.agent_code}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Welcome back, {agent.full_name}
          </h2>
          <p className="text-slate-600">Territory: {agent.territory || 'Not assigned'}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Total Referrals</span>
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{agent.total_referrals}</p>
            <p className="text-xs text-slate-500 mt-1">All time referrals</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Commission Rate</span>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{agent.commission_rate}%</p>
            <p className="text-xs text-slate-500 mt-1">Per approved referral</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Total Earnings</span>
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">${paidEarnings.toFixed(2)}</p>
            <p className="text-xs text-slate-500 mt-1">Paid commissions</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Pending Earnings</span>
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">${pendingEarnings.toFixed(2)}</p>
            <p className="text-xs text-slate-500 mt-1">Awaiting payment</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Referrals</h3>

          {referrals.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No referrals yet</p>
              <p className="text-sm mt-1">Start referring clients to earn commissions</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Business Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Commission</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Payment Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((referral) => (
                    <tr key={referral.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm text-slate-900">
                        {referral.application?.business_name || 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded ${
                          referral.application?.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : referral.application?.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {referral.application?.status || 'pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-slate-900">
                        ${referral.commission_amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        {referral.commission_paid ? (
                          <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">Paid</span>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-700">Pending</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {new Date(referral.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
