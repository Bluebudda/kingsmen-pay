import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Users, DollarSign, BarChart3, Settings, Building2, FileText, Receipt, UserCog } from 'lucide-react';
import EmployeeManagement from './EmployeeManagement';
import UnderwritingManagement from './UnderwritingManagement';
import MerchantManagement from './MerchantManagement';
import BoardingRequestsPage from './BoardingRequestsPage';
import TransactionManagement from './TransactionManagement';
import UserManagement from './UserManagement';

type TabType = 'underwriting' | 'merchants' | 'boarding' | 'transactions' | 'employees' | 'users' | 'analytics' | 'settings';

export default function Dashboard() {
  const { employee, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('underwriting');

  const tabs = [
    { id: 'underwriting' as TabType, label: 'Underwriting', icon: DollarSign },
    { id: 'merchants' as TabType, label: 'Merchants', icon: Building2 },
    { id: 'boarding' as TabType, label: 'Boarding', icon: FileText },
    { id: 'transactions' as TabType, label: 'Transactions', icon: Receipt },
    { id: 'employees' as TabType, label: 'Employees', icon: Users },
    { id: 'users' as TabType, label: 'User Accounts', icon: UserCog },
    { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3 },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">K</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Kingsmen Pay</h1>
                <p className="text-sm text-slate-600">Employee Portal</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{employee?.full_name}</p>
                <p className="text-xs text-slate-600 capitalize">{employee?.role}</p>
              </div>
              <button
                onClick={signOut}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>

          <nav className="flex space-x-1 mt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'underwriting' && <UnderwritingManagement />}
        {activeTab === 'merchants' && <MerchantManagement />}
        {activeTab === 'boarding' && <BoardingRequestsPage />}
        {activeTab === 'transactions' && <TransactionManagement />}
        {activeTab === 'employees' && <EmployeeManagement />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl p-8 border border-slate-200 text-center">
            <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Analytics Coming Soon</h2>
            <p className="text-slate-600">Advanced analytics and reporting features will be available here.</p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl p-8 border border-slate-200 text-center">
            <Settings className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Settings</h2>
            <p className="text-slate-600">System settings and configuration options.</p>
          </div>
        )}
      </main>
    </div>
  );
}
