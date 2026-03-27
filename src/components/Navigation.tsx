import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Navigation() {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    window.location.href = path;
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a
            href="/"
            onClick={(e) => handleNavigation(e, '/')}
            className="flex items-center space-x-2 flex-shrink-0"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <span className="text-xl font-bold text-slate-900 whitespace-nowrap">Kingsmen Pay</span>
          </a>
          <div className="flex items-center space-x-6 overflow-x-auto scrollbar-hide ml-4 flex-shrink-0">
            <a
              href="/"
              onClick={(e) => handleNavigation(e, '/')}
              className="text-slate-600 hover:text-blue-600 transition-colors font-medium whitespace-nowrap"
            >
              Home
            </a>
            <div
              className="relative flex-shrink-0"
              onMouseEnter={() => setIsProductsOpen(true)}
              onMouseLeave={() => setIsProductsOpen(false)}
            >
              <button
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                className="text-slate-600 hover:text-blue-600 transition-colors font-medium flex items-center space-x-1 whitespace-nowrap"
              >
                <span>Products</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} />
              </button>
              {isProductsOpen && (
                <div
                  className="absolute top-full left-0 pt-2 w-72 z-50"
                >
                  <div className="bg-white rounded-xl shadow-xl border border-slate-200 py-2">
                  <a
                    href="/products/igaming"
                    onClick={(e) => handleNavigation(e, '/products/igaming')}
                    className="block px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <div className="font-semibold">iGaming & Casinos</div>
                    <div className="text-xs text-slate-500">Online casinos and gaming platforms</div>
                  </a>
                  <a
                    href="/products/forex"
                    onClick={(e) => handleNavigation(e, '/products/forex')}
                    className="block px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <div className="font-semibold">Forex & CFD Trading</div>
                    <div className="text-xs text-slate-500">Brokers and trading platforms</div>
                  </a>
                  <a
                    href="/products/gambling"
                    onClick={(e) => handleNavigation(e, '/products/gambling')}
                    className="block px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <div className="font-semibold">Gambling & Betting</div>
                    <div className="text-xs text-slate-500">Sports wagering and lottery</div>
                  </a>
                  <a
                    href="/products/crypto"
                    onClick={(e) => handleNavigation(e, '/products/crypto')}
                    className="block px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <div className="font-semibold">Crypto & Web3</div>
                    <div className="text-xs text-slate-500">Exchanges and DeFi platforms</div>
                  </a>
                  <a
                    href="/products/travel"
                    onClick={(e) => handleNavigation(e, '/products/travel')}
                    className="block px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <div className="font-semibold">Travel & OTAs</div>
                    <div className="text-xs text-slate-500">Online travel agencies</div>
                  </a>
                  <a
                    href="/products/nutraceuticals"
                    onClick={(e) => handleNavigation(e, '/products/nutraceuticals')}
                    className="block px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <div className="font-semibold">Nutraceuticals</div>
                    <div className="text-xs text-slate-500">Health supplements and wellness</div>
                  </a>
                  <a
                    href="/products/adult"
                    onClick={(e) => handleNavigation(e, '/products/adult')}
                    className="block px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <div className="font-semibold">Adult Entertainment</div>
                    <div className="text-xs text-slate-500">Content platforms and subscriptions</div>
                  </a>
                  <a
                    href="/products/fintech"
                    onClick={(e) => handleNavigation(e, '/products/fintech')}
                    className="block px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <div className="font-semibold">Fintech & PSPs</div>
                    <div className="text-xs text-slate-500">Payment service providers</div>
                  </a>
                  </div>
                </div>
              )}
            </div>
            <a
              href="/contact"
              onClick={(e) => handleNavigation(e, '/contact')}
              className="text-slate-600 hover:text-blue-600 transition-colors font-medium whitespace-nowrap"
            >
              Contact
            </a>
            <div
              className="relative flex-shrink-0"
              onMouseEnter={() => setIsLoginOpen(true)}
              onMouseLeave={() => setIsLoginOpen(false)}
            >
              <button
                onClick={() => setIsLoginOpen(!isLoginOpen)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all text-sm font-medium shadow-lg shadow-blue-500/30 flex items-center space-x-1 whitespace-nowrap"
              >
                <span>Login</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isLoginOpen ? 'rotate-180' : ''}`} />
              </button>
              {isLoginOpen && (
                <div className="absolute top-full right-0 pt-2 w-56 z-50">
                  <div className="bg-white rounded-xl shadow-xl border border-slate-200 py-2">
                    <a
                      href="/employee"
                      onClick={(e) => handleNavigation(e, '/employee')}
                      className="block px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <div className="font-semibold">Employee Portal</div>
                      <div className="text-xs text-slate-500">Internal staff access</div>
                    </a>
                    <a
                      href="/agent/login"
                      onClick={(e) => handleNavigation(e, '/agent/login')}
                      className="block px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <div className="font-semibold">Agent Portal</div>
                      <div className="text-xs text-slate-500">For sales agents</div>
                    </a>
                    <a
                      href="/partner/login"
                      onClick={(e) => handleNavigation(e, '/partner/login')}
                      className="block px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <div className="font-semibold">Partner Portal</div>
                      <div className="text-xs text-slate-500">For business partners</div>
                    </a>
                    <a
                      href="/merchant-login"
                      onClick={(e) => handleNavigation(e, '/merchant-login')}
                      className="block px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <div className="font-semibold">Merchant Portal</div>
                      <div className="text-xs text-slate-500">For merchant access</div>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
