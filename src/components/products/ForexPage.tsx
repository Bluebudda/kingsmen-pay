import { TrendingUp, Lock, Clock, Globe, CheckCircle2 } from 'lucide-react';
import ProductNavigation from '../ProductNavigation';

export default function ForexPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <ProductNavigation />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Forex & CFD Trading Payment Solutions
          </h1>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Trusted payment processing for forex brokers, trading platforms, financial institutions, and prop firms. Handle deposits and withdrawals with speed and precision.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <TrendingUp className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Trading Optimized</h3>
            <p className="text-slate-600 leading-relaxed">
              Purpose-built for high-frequency trading environments. Handle rapid deposits and withdrawals with minimal latency for active traders.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Lock className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Regulatory Compliance</h3>
            <p className="text-slate-600 leading-relaxed">
              Full compliance with ESMA, FCA, ASIC, and other financial regulators. Built-in AML and KYC tools for seamless onboarding.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Clock className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Instant Settlements</h3>
            <p className="text-slate-600 leading-relaxed">
              Real-time fund transfers and same-day settlements. Keep traders engaged with instant account funding and rapid withdrawals.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Globe className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Multi-Currency Support</h3>
            <p className="text-slate-600 leading-relaxed">
              Accept and settle in major trading currencies worldwide. Competitive FX rates and transparent pricing for international traders.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-xl p-12 text-white mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Perfect for Trading Businesses</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-1">Forex Brokers</h4>
                <p className="text-blue-50">Complete payment infrastructure for forex brokerages</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-1">CFD Platforms</h4>
                <p className="text-blue-50">Specialized processing for CFD trading platforms</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-1">Prop Trading Firms</h4>
                <p className="text-blue-50">Secure payment solutions for proprietary trading</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-1">Financial Institutions</h4>
                <p className="text-blue-50">Enterprise-grade processing for institutions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Scale Your Trading Business</h2>
          <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
            Join top forex brokers and trading platforms powered by Kingsmen Pay.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="/apply"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-semibold shadow-lg"
            >
              Apply Now
            </a>
            <a
              href="/contact"
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-all font-semibold"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </div>

      <footer className="bg-slate-100 text-slate-600 py-16 px-6 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="border-t border-slate-300 pt-8 text-sm text-slate-500 text-center">
            <p>Copyright 2025 - All Rights Reserved By Kingsmen Pay</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
