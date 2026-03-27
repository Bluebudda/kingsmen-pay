import { useState } from 'react';
import { ArrowRight, Globe, Shield, Zap, CreditCard, TrendingUp, Users, CheckCircle, ChevronRight, BarChart3, Lock, Headphones, ChevronDown } from 'lucide-react';

export default function PublicApp() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <TrustedBy />
      <Solutions />
      <WhyKingsmen />
      <Features />
      <GlobalNetwork />
      <CTASection />
      <Footer />
    </div>
  );
}

function Header() {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    window.location.href = path;
  };

  return (
    <header className="fixed top-0 w-full bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">K</span>
          </div>
          <span className="text-2xl font-bold text-slate-800">Kingsmen Pay</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="#solutions" className="text-slate-700 hover:text-blue-600 transition-colors">Solutions</a>
          <div
            className="relative"
            onMouseEnter={() => setIsProductsOpen(true)}
            onMouseLeave={() => setIsProductsOpen(false)}
          >
            <button
              onClick={() => setIsProductsOpen(!isProductsOpen)}
              className="text-slate-700 hover:text-blue-600 transition-colors flex items-center space-x-1"
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
                  <div className="text-xs text-slate-500">Online casinos and gaming</div>
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
          <a href="#industries" className="text-slate-700 hover:text-blue-600 transition-colors">Industries</a>
          <a
            href="/partner"
            onClick={(e) => handleNavigation(e, '/partner')}
            className="text-slate-700 hover:text-blue-600 transition-colors"
          >
            Partner With Us
          </a>
          <a
            href="/contact"
            onClick={(e) => handleNavigation(e, '/contact')}
            className="text-slate-700 hover:text-blue-600 transition-colors"
          >
            Contact
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <div
            className="relative"
            onMouseEnter={() => setIsLoginOpen(true)}
            onMouseLeave={() => setIsLoginOpen(false)}
          >
            <button
              onClick={() => setIsLoginOpen(!isLoginOpen)}
              className="text-slate-700 hover:text-blue-600 transition-colors flex items-center space-x-1"
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
                    href="/merchant-login"
                    onClick={(e) => handleNavigation(e, '/merchant-login')}
                    className="block px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <div className="font-semibold">Merchant Portal</div>
                    <div className="text-xs text-slate-500">For merchant access</div>
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
                </div>
              </div>
            )}
          </div>
          <a
            href="/apply"
            onClick={(e) => handleNavigation(e, '/apply')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-lg shadow-blue-500/30"
          >
            Get Started
          </a>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-slate-900 leading-tight mb-6">
            The global <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">payment processing</span> platform for high-growth businesses
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            Over 10,000 businesses worldwide trust Kingsmen Pay to accelerate their growth. Accept global payments, process high-risk transactions, and expand into new markets - all on one unified platform.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <a href="/apply" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium text-lg flex items-center space-x-2 shadow-lg shadow-blue-500/30">
              <span>Start Processing Today</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            <a href="/contact" className="border-2 border-blue-500 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-all font-medium text-lg">
              Schedule a Demo
            </a>
          </div>
          <p className="text-sm text-slate-500 mt-6">No setup fees • Fast onboarding • 24/7 support</p>
        </div>
      </div>
    </section>
  );
}

function TrustedBy() {
  const paymentMethods = [
    { name: "Credit Cards", path: "/payments/credit-cards" },
    { name: "UnionPay", path: "/payments/unionpay" },
    { name: "UPI", path: "/payments/upi" },
    { name: "PIX", path: "/payments/pix" },
    { name: "PayID", path: "/payments/payid" },
    { name: "SEPA", path: "/payments/sepa" },
    { name: "And many more...", path: null }
  ];

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string | null) => {
    if (!path) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    window.location.href = path;
  };

  return (
    <section className="py-16 px-6 bg-white border-b border-blue-100">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-sm text-slate-600 mb-8 uppercase tracking-wide">160+ Global Payment Methods Supported</p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 items-center">
          {paymentMethods.map((method, i) => (
            <a
              key={i}
              href={method.path || "#"}
              onClick={(e) => handleNavigation(e, method.path)}
              className={`h-16 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-200 transition-all ${
                method.path ? 'hover:border-blue-400 hover:shadow-md cursor-pointer' : 'cursor-default'
              }`}
            >
              <span className="text-slate-700 font-semibold text-sm text-center px-2">{method.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Solutions() {
  const solutions = [
    {
      icon: Globe,
      title: "Global Payment Processing",
      description: "Accept payments in 150+ currencies with local payment methods. Expand globally while processing like a local business.",
      link: "Learn more"
    },
    {
      icon: Shield,
      title: "High-Risk Solutions",
      description: "Specialized processing for Forex, iGaming, dating, travel, subscriptions, and nutraceuticals with industry-leading approval rates.",
      link: "Learn more"
    },
    {
      icon: CreditCard,
      title: "Local Payment Methods",
      description: "Support for UPI, PIX, cards, and 160+ alternative payment methods to maximize conversion in every market.",
      link: "Learn more"
    },
    {
      icon: Zap,
      title: "Instant Settlements",
      description: "Fast payouts and real-time transaction monitoring. Get your funds when you need them with flexible settlement options.",
      link: "Learn more"
    }
  ];

  return (
    <section id="solutions" className="py-24 px-6 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Powerful solutions engineered for global businesses</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Whether you're expanding internationally or operating in high-risk sectors, Kingsmen Pay's technology helps you scale faster and more efficiently.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {solutions.map((solution, index) => (
            <div key={index} className="border border-blue-200 rounded-2xl p-8 hover:shadow-xl transition-all hover:border-blue-400 group bg-white">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                <solution.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{solution.title}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">{solution.description}</p>
              <a href="#" className="text-blue-600 font-medium flex items-center space-x-2 hover:space-x-3 transition-all">
                <span>{solution.link}</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyKingsmen() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Why choose Kingsmen Pay?</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Radically save time and cost</h3>
            <p className="text-slate-600 leading-relaxed">
              Experience transparent pricing with no hidden fees. Save up to 70% on international transaction costs with interbank FX rates and local processing.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Accelerated onboarding</h3>
            <p className="text-slate-600 leading-relaxed">
              Start processing payments in days, not months. Our streamlined onboarding gets your business up and running quickly with dedicated integration support.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Dedicated expert support</h3>
            <p className="text-slate-600 leading-relaxed">
              Access 24/7 support from payment experts who understand your industry. Get personalized guidance every step of the way to maximize your success.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { icon: Lock, text: "Bank-level security & PCI DSS compliance" },
    { icon: BarChart3, text: "Real-time analytics and reporting" },
    { icon: Headphones, text: "24/7 dedicated account management" },
    { icon: Globe, text: "Multi-currency accounts & wallets" },
    { icon: CheckCircle, text: "Industry-leading approval rates" },
    { icon: Zap, text: "Seamless API integration" }
  ];

  return (
    <section id="products" className="py-24 px-6 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">All you need to process payments globally</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Stop managing payments across multiple disconnected providers. Kingsmen Pay gives you a single unified platform with all the features you need to scale.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-4 p-6 rounded-xl hover:bg-blue-100/50 transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-slate-700 font-medium pt-2">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GlobalNetwork() {
  return (
    <section className="py-24 px-6 bg-gradient-to-br from-blue-100 via-blue-50 to-blue-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-slate-900">Tap into the world's payment network</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Kingsmen Pay's proprietary network offers a faster, more cost-effective alternative to legacy banking. Operate like a local business from anywhere in the world.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">150+</div>
            <div className="text-slate-600">Countries covered</div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">160+</div>
            <div className="text-slate-600">Payment methods</div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">99.9%</div>
            <div className="text-slate-600">Uptime guarantee</div>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">24/7</div>
            <div className="text-slate-600">Expert support</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-5xl font-bold text-slate-900 mb-6">Ready to unlock your payment potential?</h2>
        <p className="text-xl text-slate-600 mb-10">
          Join thousands of businesses processing billions in payments. Get started in minutes with transparent pricing and no hidden fees.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <a href="/apply" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium text-lg flex items-center space-x-2 shadow-lg shadow-blue-500/30">
            <span>Start Processing Today</span>
            <ArrowRight className="w-5 h-5" />
          </a>
          <a href="/contact" className="border-2 border-blue-500 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-all font-medium text-lg">
            Contact Sales
          </a>
        </div>
        <p className="text-sm text-slate-500 mt-6">Speak with our payment experts • support@kingsmenpay.com</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-100 text-slate-600 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">K</span>
              </div>
              <span className="text-xl font-bold text-slate-900">Kingsmen Pay</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Empowering businesses worldwide with secure, transparent payment processing solutions.
            </p>
          </div>
          <div>
            <h4 className="text-slate-900 font-semibold mb-4">Solutions</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Global Processing</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">High-Risk Solutions</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Local Payments</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">API Integration</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-900 font-semibold mb-4">Industries</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Forex Trading</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">iGaming</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Travel & Tourism</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Nutraceuticals</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-900 font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-blue-600 transition-colors">Contact</a></li>
              <li><a href="/partner" className="hover:text-blue-600 transition-colors">Partner With Us</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
              <li><a href="/employee" className="hover:text-blue-600 transition-colors font-medium">Employee Portal</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-300 pt-8 text-sm text-slate-500 text-center">
          <p>Copyright 2025 - All Rights Reserved By Kingsmen Pay</p>
        </div>
      </div>
    </footer>
  );
}
