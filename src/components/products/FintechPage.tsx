import { Layers, Network, Zap, Shield, CheckCircle2 } from 'lucide-react';
import ProductNavigation from '../ProductNavigation';

export default function FintechPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <ProductNavigation />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Fintech & PSP Solutions
          </h1>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Enterprise payment infrastructure for payment service providers, fintech companies, and payment intermediaries. Build your payment platform on our robust foundation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Layers className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">White Label Solutions</h3>
            <p className="text-slate-600 leading-relaxed">
              Fully customizable payment infrastructure for PSPs. Launch your own payment platform with our white-label technology.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Network className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Multi-Merchant Platform</h3>
            <p className="text-slate-600 leading-relaxed">
              Manage unlimited sub-merchants with individual settings. Perfect for payment facilitators and aggregators.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">API-First Architecture</h3>
            <p className="text-slate-600 leading-relaxed">
              Modern RESTful APIs with comprehensive documentation. Webhooks, SDKs, and developer tools included.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Enterprise Security</h3>
            <p className="text-slate-600 leading-relaxed">
              PCI Level 1 certified infrastructure with advanced fraud tools. Meet the highest security standards for your clients.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-xl p-12 text-white mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Built for Payment Professionals</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-1">Payment Service Providers</h4>
                <p className="text-blue-50">Complete infrastructure for PSP operations</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-1">Fintech Companies</h4>
                <p className="text-blue-50">Payment capabilities for fintech platforms</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-1">Payment Facilitators</h4>
                <p className="text-blue-50">Sub-merchant boarding and management tools</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-1">Payment Aggregators</h4>
                <p className="text-blue-50">Multi-merchant payment processing platform</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Build Your Payment Business</h2>
          <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
            Partner with Kingsmen Pay to launch and scale your payment platform.
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
