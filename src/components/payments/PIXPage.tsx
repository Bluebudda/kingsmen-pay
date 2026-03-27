import { Zap, Smartphone, Shield, Users, CheckCircle, Clock } from 'lucide-react';
import Navigation from '../Navigation';

export default function PIXPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              PIX Payments
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Brazil's payment system enabling 24/7 real-time transfers with over 150 million users
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-8 bg-green-50 rounded-2xl border border-green-200">
              <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <div className="text-4xl font-bold text-slate-900 mb-2">150M+</div>
              <div className="text-slate-600">Registered Users</div>
            </div>
            <div className="text-center p-8 bg-green-50 rounded-2xl border border-green-200">
              <Clock className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <div className="text-4xl font-bold text-slate-900 mb-2">&lt;10s</div>
              <div className="text-slate-600">Processing Time</div>
            </div>
            <div className="text-center p-8 bg-green-50 rounded-2xl border border-green-200">
              <Zap className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <div className="text-4xl font-bold text-slate-900 mb-2">24/7</div>
              <div className="text-slate-600">Always Available</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Why PIX?</h2>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Fast Processing</div>
                    <div className="text-sm text-slate-600">Money received in under 10 seconds</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">24/7 Availability</div>
                    <div className="text-sm text-slate-600">Works weekends and holidays</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Low Cost</div>
                    <div className="text-sm text-slate-600">Much cheaper than cards</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Universal Coverage</div>
                    <div className="text-sm text-slate-600">Works with all Brazilian banks</div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Features</h2>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Centralized Brazil Payment System</div>
                    <div className="text-sm text-slate-600">One wallet for the country</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Smartphone className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">QR Code Payments</div>
                    <div className="text-sm text-slate-600">Easy mobile checkout</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Simple Integration</div>
                    <div className="text-sm text-slate-600">Developer-friendly APIs</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Capture Brazil's growing digital economy</h2>
            <p className="text-xl mb-8 text-green-50">Start accepting PIX and get settlements 24/7</p>
            <a
              href="/apply"
              className="bg-white text-green-600 px-8 py-4 rounded-lg hover:bg-green-50 transition-all font-medium text-lg inline-block"
            >
              Get Started Today
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
