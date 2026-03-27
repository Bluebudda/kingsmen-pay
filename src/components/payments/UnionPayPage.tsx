import { CreditCard, Shield, Globe, Users, CheckCircle } from 'lucide-react';
import Navigation from '../Navigation';

export default function UnionPayPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              UnionPay Processing
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Accept UnionPay cards and tap into the Chinese market with over 9 billion cards issued worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-8 bg-red-50 rounded-2xl border border-red-200">
              <Users className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <div className="text-4xl font-bold text-slate-900 mb-2">9B+</div>
              <div className="text-slate-600">Cards Issued</div>
            </div>
            <div className="text-center p-8 bg-red-50 rounded-2xl border border-red-200">
              <Globe className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <div className="text-4xl font-bold text-slate-900 mb-2">180+</div>
              <div className="text-slate-600">Countries & Regions</div>
            </div>
            <div className="text-center p-8 bg-red-50 rounded-2xl border border-red-200">
              <CheckCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <div className="text-4xl font-bold text-slate-900 mb-2">98%+</div>
              <div className="text-slate-600">Success Rate</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="bg-red-50 rounded-2xl p-8 border border-red-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Why UnionPay?</h2>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-red-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Largest Card Network in China</div>
                    <div className="text-sm text-slate-600">Reach billions of Chinese consumers</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-red-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Global Acceptance</div>
                    <div className="text-sm text-slate-600">Used by travelers worldwide</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-red-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Competitive Rates</div>
                    <div className="text-sm text-slate-600">Lower fees than traditional cards</div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-red-50 rounded-2xl p-8 border border-red-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Features</h2>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-red-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Enhanced Security</div>
                    <div className="text-sm text-slate-600">EMV chip and contactless payments</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-red-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Multi-Currency Support</div>
                    <div className="text-sm text-slate-600">CNY and local currency settlement</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-red-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Quick Integration</div>
                    <div className="text-sm text-slate-600">Easy API setup and testing</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Expand into the Chinese market</h2>
            <p className="text-xl mb-8 text-red-50">Start accepting UnionPay today and reach billions of customers</p>
            <a
              href="/apply"
              className="bg-white text-red-600 px-8 py-4 rounded-lg hover:bg-red-50 transition-all font-medium text-lg inline-block"
            >
              Get Started Today
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
