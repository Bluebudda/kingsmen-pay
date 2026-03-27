import { useAuth, AuthProvider } from './contexts/AuthContext';
import PublicApp from './PublicApp';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ContactPage from './components/ContactPage';
import Dashboard from './components/Dashboard';
import ApplicationForm from './components/ApplicationForm';
import PartnerPage from './components/PartnerPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import AgentLoginPage from './components/AgentLoginPage';
import AgentDashboard from './components/AgentDashboard';
import PartnerLoginPage from './components/PartnerLoginPage';
import PartnerDashboard from './components/PartnerDashboard';
import MerchantLoginPage from './components/MerchantLoginPage';
import MerchantDashboard from './components/MerchantDashboard';
import ApplicationDetail from './components/merchant/ApplicationDetail';
import IGamingPage from './components/products/iGamingPage';
import ForexPage from './components/products/ForexPage';
import GamblingPage from './components/products/GamblingPage';
import CryptoPage from './components/products/CryptoPage';
import TravelPage from './components/products/TravelPage';
import NutraceuticalsPage from './components/products/NutraceuticalsPage';
import AdultPage from './components/products/AdultPage';
import FintechPage from './components/products/FintechPage';
import CreditCardsPage from './components/payments/CreditCardsPage';
import UnionPayPage from './components/payments/UnionPayPage';
import UPIPage from './components/payments/UPIPage';
import PIXPage from './components/payments/PIXPage';
import PayIDPage from './components/payments/PayIDPage';
import SEPAPage from './components/payments/SEPAPage';

function AppContent() {
  const { user, employee, agent, partner, merchantUser, userType, loading } = useAuth();
  const currentPath = window.location.pathname;
  const isEmployeePortal = currentPath === '/employee';
  const isRegisterPage = currentPath === '/register';
  const isContactPage = currentPath === '/contact';
  const isApplicationPage = currentPath === '/apply';
  const isPartnerPage = currentPath === '/partner';
  const isResetPasswordPage = currentPath === '/reset-password';
  const isProductPage = currentPath.startsWith('/products/');
  const isPaymentPage = currentPath.startsWith('/payments/');
  const isAgentLogin = currentPath === '/agent/login';
  const isAgentDashboard = currentPath === '/agent/dashboard';
  const isPartnerLogin = currentPath === '/partner/login';
  const isPartnerDashboard = currentPath === '/partner/dashboard';
  const isMerchantLogin = currentPath === '/merchant-login';
  const isMerchantDashboard = currentPath === '/merchant-dashboard' || currentPath.startsWith('/merchant-dashboard/');

  if (loading && (isEmployeePortal || isRegisterPage)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">K</span>
          </div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isContactPage) {
    return <ContactPage />;
  }

  if (isApplicationPage) {
    return <ApplicationForm />;
  }

  if (isPartnerPage) {
    return <PartnerPage />;
  }

  if (isResetPasswordPage) {
    return <ResetPasswordPage />;
  }

  if (isAgentLogin) {
    if (user && agent && agent.status === 'active') {
      window.location.href = '/agent/dashboard';
      return null;
    }
    return <AgentLoginPage />;
  }

  if (isAgentDashboard) {
    if (!user || !agent) {
      window.location.href = '/agent/login';
      return null;
    }
    if (agent.status !== 'active') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-blue-100 text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Account Inactive</h1>
            <p className="text-slate-600 mb-6">
              Your agent account is not active. Please contact support.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }
    return <AgentDashboard />;
  }

  if (isPartnerLogin) {
    if (user && partner && partner.status === 'active') {
      window.location.href = '/partner/dashboard';
      return null;
    }
    return <PartnerLoginPage />;
  }

  if (isPartnerDashboard) {
    if (!user || !partner) {
      window.location.href = '/partner/login';
      return null;
    }
    if (partner.status !== 'active') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex items-center justify-center px-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-emerald-100 text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Account Inactive</h1>
            <p className="text-slate-600 mb-6">
              Your partner account is not active. Please contact support.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all font-medium"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }
    return <PartnerDashboard />;
  }

  if (isMerchantLogin) {
    if (user && merchantUser && merchantUser.is_active) {
      window.location.href = '/merchant-dashboard';
      return null;
    }
    return <MerchantLoginPage />;
  }

  if (isMerchantDashboard) {
    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-white font-bold text-2xl">K</span>
            </div>
            <p className="text-slate-600">Loading...</p>
          </div>
        </div>
      );
    }
    if (!user || !merchantUser) {
      window.location.href = '/merchant-login';
      return null;
    }
    if (!merchantUser.is_active) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-blue-100 text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Account Inactive</h1>
            <p className="text-slate-600 mb-6">
              Your merchant account is not active. Please contact support.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    if (currentPath.startsWith('/merchant-dashboard/application/')) {
      return <ApplicationDetail />;
    }

    return <MerchantDashboard />;
  }

  if (isProductPage) {
    switch (currentPath) {
      case '/products/igaming':
        return <IGamingPage />;
      case '/products/forex':
        return <ForexPage />;
      case '/products/gambling':
        return <GamblingPage />;
      case '/products/crypto':
        return <CryptoPage />;
      case '/products/travel':
        return <TravelPage />;
      case '/products/nutraceuticals':
        return <NutraceuticalsPage />;
      case '/products/adult':
        return <AdultPage />;
      case '/products/fintech':
        return <FintechPage />;
      default:
        window.location.href = '/';
        return null;
    }
  }

  if (isPaymentPage) {
    switch (currentPath) {
      case '/payments/credit-cards':
        return <CreditCardsPage />;
      case '/payments/unionpay':
        return <UnionPayPage />;
      case '/payments/upi':
        return <UPIPage />;
      case '/payments/pix':
        return <PIXPage />;
      case '/payments/payid':
        return <PayIDPage />;
      case '/payments/sepa':
        return <SEPAPage />;
      default:
        window.location.href = '/';
        return null;
    }
  }

  if (isRegisterPage) {
    if (user && employee?.is_active) {
      window.location.href = '/employee';
      return null;
    }
    return <RegisterPage />;
  }

  if (isEmployeePortal) {
    if (!user) {
      return <LoginPage />;
    }

    if (!employee || !employee.is_active) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-blue-100 text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Access Denied</h1>
            <p className="text-slate-600 mb-6">
              You don't have permission to access the employee portal.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return <Dashboard />;
  }

  return <PublicApp />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
