import { Building2, Euro, Globe, Shield, CheckCircle, Clock } from 'lucide-react';
import Navigation from '../Navigation';

export default function SEPAPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              SEPA Bank Transfers
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Single Euro Payments Area for seamless bank transfers across 36 European countries
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-8 bg-indigo-50 rounded-2xl border border-indigo-200">
              <Globe className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <div className="text-4xl font-bold text-slate-900 mb-2">36</div>
              <div className="text-slate-600">Countries</div>
            </div>
            <div className="text-center p-8 bg-indigo-50 rounded-2xl border border-indigo-200">
              <Building2 className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <div className="text-4xl font-bold text-slate-900 mb-2">500M+</div>
              <div className="text-slate-600">Bank Accounts</div>
            </div>
            <div className="text-center p-8 bg-indigo-50 rounded-2xl border border-indigo-200">
              <Clock className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <div className="text-4xl font-bold text-slate-900 mb-2">1-2</div>
              <div className="text-slate-600">Business Days</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="bg-indigo-50 rounded-2xl p-8 border border-indigo-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">SEPA Types</h2>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-indigo-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">SEPA Credit Transfer</div>
                    <div className="text-sm text-slate-600">Standard euro transfers 1-2 days</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-indigo-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">SEPA Instant</div>
                    <div className="text-sm text-slate-600">Real-time transfers under 10 seconds</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-indigo-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">SEPA Direct Debit</div>
                    <div className="text-sm text-slate-600">Recurring payments and subscriptions</div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-indigo-50 rounded-2xl p-8 border border-indigo-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Benefits</h2>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <Euro className="w-5 h-5 text-indigo-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Cost Effective</div>
                    <div className="text-sm text-slate-600">Lower fees than card payments</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-indigo-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Secure & Regulated</div>
                    <div className="text-sm text-slate-600">EU banking standards compliance</div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-indigo-600 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">Pan-European</div>
                    <div className="text-sm text-slate-600">One system across 36 countries</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Expand across Europe with SEPA</h2>
            <p className="text-xl mb-8 text-indigo-50">Accept bank transfers from 36 European countries</p>
            <a
              href="/apply"
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg hover:bg-indigo-50 transition-all font-medium text-lg inline-block"
            >
              Get Started Today
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
