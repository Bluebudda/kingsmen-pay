import { Smartphone, Zap, Shield, Users, CheckCircle, TrendingUp } from 'lucide-react';
import Navigation from '../Navigation';

export default function UPIPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Smartphone className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              UPI (Unified Payments Interface)
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Accept instant mobile payments from over 400 million users across India with real-time settlement
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-8 bg-orange-50 rounded-2xl border border-orange-200">
              <Users className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <div className="text-4xl font-bold text-slate-900 mb-2">400M+</div>
              <div className="text-slate-600">Active Users</div>
            </div>
            <div className="text-center p-8 bg-orange-50 rounded-2xl border border-orange-200">
              <TrendingUp className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <div className="text-4xl font-bold text-slate-900 mb-2">10B+</div>
              <div className="text-slate-600">Monthly Transactions</div>
            </div>
            <div className="text-center p-8 bg-orange-50 rounded-2xl border border-orange-200">
              <Zap className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <div className="text-4xl font-bold text-slate-900 mb-2">Fast</div>
              <div className="text-slate-600">Accelerated Settlement Times</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="bg-orange-50 rounded-2xl p-8 border border-orange-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Why UPI?</h2>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-orange-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Fast Payments</div>
                    <div className="text-sm text-slate-600">Real-time money transfer 24/7</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-orange-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Competitive Rates</div>
                    <div className="text-sm text-slate-600">Industry-leading pricing with no hidden fees</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-orange-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">70%+ on Intent Services</div>
                    <div className="text-sm text-slate-600">High success rate for intent-based transactions</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-orange-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Direct Bank Transfer</div>
                    <div className="text-sm text-slate-600">No wallet or card needed</div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-orange-50 rounded-2xl p-8 border border-orange-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Features</h2>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-orange-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Secure Authentication</div>
                    <div className="text-sm text-slate-600">2-factor authentication with UPI PIN</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Smartphone className="w-5 h-5 text-orange-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Mobile First</div>
                    <div className="text-sm text-slate-600">Optimized for mobile commerce</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 text-orange-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Quick Setup</div>
                    <div className="text-sm text-slate-600">Easy API integration</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Tap into India's digital payment revolution</h2>
            <p className="text-xl mb-8 text-orange-50">Start accepting UPI payments and reach millions of customers</p>
            <a
              href="/apply"
              className="bg-white text-orange-600 px-8 py-4 rounded-lg hover:bg-orange-50 transition-all font-medium text-lg inline-block"
            >
              Get Started Today
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
