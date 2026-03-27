import { useState } from 'react';
import { Users, Lock, Mail, ArrowRight, Home } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AgentLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { data: agent, error: agentError } = await supabase
          .from('agents')
          .select('*')
          .eq('user_id', authData.user.id)
          .maybeSingle();

        if (agentError) throw agentError;

        if (!agent) {
          await supabase.auth.signOut();
          throw new Error('Agent account not found. Please contact support.');
        }

        if (agent.status !== 'active') {
          await supabase.auth.signOut();
          throw new Error('Your agent account is not active. Please contact support.');
        }

        window.location.href = '/agent/dashboard';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="mb-4">
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
        </div>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Agent Portal</h1>
          <p className="text-slate-600">Sign in to access your agent dashboard</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="agent@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-600">
              Not an agent?{' '}
              <button
                onClick={() => window.location.href = '/employee'}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Employee Login
              </button>
            </p>
            <p className="text-sm text-slate-600 mt-2">
              <button
                onClick={() => window.location.href = '/partner/login'}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Partner Login
              </button>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-slate-600">
          Need help?{' '}
          <button
            onClick={() => window.location.href = '/contact'}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
