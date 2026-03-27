import { Plane, CreditCard, Globe, TrendingUp, CheckCircle2 } from 'lucide-react';
import ProductNavigation from '../ProductNavigation';

export default function TravelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <ProductNavigation />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Travel & OTA Payment Solutions
          </h1>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            High-volume payment processing for online travel agencies, tour operators, and booking platforms. Handle global transactions with ease and efficiency.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Plane className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Travel Specialized</h3>
            <p className="text-slate-600 leading-relaxed">
              Purpose-built for travel businesses with support for split payments, installments, and travel-specific MCC codes.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <CreditCard className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">High Authorization Rates</h3>
            <p className="text-slate-600 leading-relaxed">
              Optimized for large-ticket travel purchases. Intelligent routing minimizes declines on flights, hotels, and vacation packages.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Globe className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Multi-Currency Processing</h3>
            <p className="text-slate-600 leading-relaxed">
              Accept payments in 150+ currencies with competitive exchange rates. Dynamic currency conversion at checkout.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <TrendingUp className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Flexible Refunds</h3>
            <p className="text-slate-600 leading-relaxed">
              Streamlined refund and cancellation handling. Partial refunds and automated chargeback management for travel scenarios.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-xl p-12 text-white mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Travel Businesses We Serve</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-1">Online Travel Agencies</h4>
                <p className="text-blue-50">Complete payment infrastructure for OTAs</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-1">Tour Operators</h4>
                <p className="text-blue-50">Specialized processing for tour packages</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-1">Booking Platforms</h4>
                <p className="text-blue-50">Payment solutions for aggregation sites</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-1">Activity Providers</h4>
                <p className="text-blue-50">Processing for experiences and excursions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Accelerate Your Travel Business</h2>
          <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
            Join leading travel companies powered by Kingsmen Pay payment solutions.
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
