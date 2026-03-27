import { Heart, Package, RefreshCw, Shield, CheckCircle2 } from 'lucide-react';
import ProductNavigation from '../ProductNavigation';

export default function NutraceuticalsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <ProductNavigation />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Nutraceuticals Payment Solutions
          </h1>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Specialized payment processing for direct-to-consumer health supplements and subscription box merchants. Handle recurring billing and compliance with ease.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Heart className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Health Industry Expertise</h3>
            <p className="text-slate-600 leading-relaxed">
              Deep understanding of nutraceutical regulations and compliance requirements. Navigate FDA guidelines and health claims with confidence.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Package className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Subscription Billing</h3>
            <p className="text-slate-600 leading-relaxed">
              Advanced recurring billing engine built for subscription businesses. Handle trials, dunning, and customer retention seamlessly.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <RefreshCw className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Chargeback Protection</h3>
            <p className="text-slate-600 leading-relaxed">
              Specialized chargeback management for supplement merchants. Advanced fraud prevention and dispute resolution tools included.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Merchant Account Stability</h3>
            <p className="text-slate-600 leading-relaxed">
              Reliable merchant accounts with banks experienced in nutraceuticals. No surprise closures or rolling reserves.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-xl p-12 text-white mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Perfect For Your Business Model</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-1">Direct-to-Consumer Brands</h4>
                <p className="text-blue-50">Payment solutions for DTC supplement companies</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-1">Subscription Box Services</h4>
                <p className="text-blue-50">Recurring billing for monthly supplement boxes</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-1">Health Supplement Retailers</h4>
                <p className="text-blue-50">E-commerce processing for health products</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-1">Wellness Platforms</h4>
                <p className="text-blue-50">Payment infrastructure for wellness subscriptions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Grow Your Supplement Business</h2>
          <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
            Join successful nutraceutical brands powered by Kingsmen Pay.
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
