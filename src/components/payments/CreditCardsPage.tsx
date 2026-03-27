import { CreditCard, Shield, Globe, Zap, CheckCircle } from 'lucide-react';
import Navigation from '../Navigation';

export default function CreditCardsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              Credit Card Processing
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Accept Visa, Mastercard, American Express, and more with industry-leading security and competitive rates
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Supported Cards</h2>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-700">Visa</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-700">Mastercard</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-700">American Express</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-700">Discover</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-700">Diners Club</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-700">JCB</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Key Features</h2>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">PCI DSS Level 1 Compliance</div>
                    <div className="text-sm text-slate-600">Bank-grade security for all transactions</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Instant Authorization</div>
                    <div className="text-sm text-slate-600">Real-time transaction processing</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Global Coverage</div>
                    <div className="text-sm text-slate-600">Accept cards from 150+ countries</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to start accepting credit cards?</h2>
            <p className="text-xl mb-8 text-blue-50">Competitive rates, fast setup, and 24/7 support</p>
            <a
              href="/apply"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-all font-medium text-lg inline-block"
            >
              Get Started Today
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
