import { Smartphone, Zap, Shield, Users, CheckCircle, Globe } from 'lucide-react';
import Navigation from '../Navigation';

export default function PayIDPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-teal-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Smartphone className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              PayID
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Australia's simple payment addressing service enabling instant bank transfers using email or mobile number
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-8 bg-teal-50 rounded-2xl border border-teal-200">
              <Users className="w-12 h-12 text-teal-600 mx-auto mb-4" />
              <div className="text-4xl font-bold text-slate-900 mb-2">7M+</div>
              <div className="text-slate-600">Registered PayIDs</div>
            </div>
            <div className="text-center p-8 bg-teal-50 rounded-2xl border border-teal-200">
              <Globe className="w-12 h-12 text-teal-600 mx-auto mb-4" />
              <div className="text-4xl font-bold text-slate-900 mb-2">100+</div>
              <div className="text-slate-600">Participating Banks</div>
            </div>
            <div className="text-center p-8 bg-teal-50 rounded-2xl border border-teal-200">
              <Zap className="w-12 h-12 text-teal-600 mx-auto mb-4" />
              <div className="text-4xl font-bold text-slate-900 mb-2">Instant</div>
              <div className="text-slate-600">Real-Time Payments</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="bg-teal-50 rounded-2xl p-8 border border-teal-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Why PayID?</h2>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-teal-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Simple to Use</div>
                    <div className="text-sm text-slate-600">Use email or mobile instead of BSB/account</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-teal-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Instant Transfers</div>
                    <div className="text-sm text-slate-600">Payments arrive in under 60 seconds</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-teal-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">24/7 Availability</div>
                    <div className="text-sm text-slate-600">Works anytime, any day</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-teal-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Widely Accepted</div>
                    <div className="text-sm text-slate-600">Supported by major Australian banks</div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-teal-50 rounded-2xl p-8 border border-teal-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Features</h2>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-teal-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Built on NPP</div>
                    <div className="text-sm text-slate-600">Powered by New Payments Platform</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Smartphone className="w-5 h-5 text-teal-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Mobile Optimized</div>
                    <div className="text-sm text-slate-600">Perfect for mobile commerce</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 text-teal-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Easy Integration</div>
                    <div className="text-sm text-slate-600">Quick API implementation</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Accept PayID payments today</h2>
            <p className="text-xl mb-8 text-teal-50">Simplify payments for your Australian customers</p>
            <a
              href="/apply"
              className="bg-white text-teal-600 px-8 py-4 rounded-lg hover:bg-teal-50 transition-all font-medium text-lg inline-block"
            >
              Get Started Today
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
