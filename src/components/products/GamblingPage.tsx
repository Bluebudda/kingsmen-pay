import { Trophy, Shield, Users, Zap, CheckCircle2 } from 'lucide-react';
import ProductNavigation from '../ProductNavigation';

export default function GamblingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <ProductNavigation />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Gambling & Betting Payment Solutions
          </h1>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Specialized payment processing for sports wagering, lottery, sweepstakes, and fantasy sports platforms. Handle bets and payouts with speed and reliability.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Trophy className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Sports Betting Ready</h3>
            <p className="text-slate-600 leading-relaxed">
              Built for high-volume sports betting events. Handle peak traffic during major games with 99.9% uptime and instant processing.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Licensed & Compliant</h3>
            <p className="text-slate-600 leading-relaxed">
              Full compliance with state gaming regulations and responsible gambling requirements. Age verification and geolocation built-in.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Users className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Player-Friendly</h3>
            <p className="text-slate-600 leading-relaxed">
              Quick deposits for in-play betting and fast payouts for winners. Multiple payment options including cards, e-wallets, and bank transfers.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Real-Time Processing</h3>
            <p className="text-slate-600 leading-relaxed">
              Instant bet placement and real-time balance updates. Handle live betting with millisecond response times.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-xl p-12 text-white mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Betting Verticals We Serve</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-1">Sports Wagering</h4>
                <p className="text-blue-50">Complete solutions for sportsbook operators</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-1">Lottery Platforms</h4>
                <p className="text-blue-50">Secure processing for online lottery sales</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-1">Sweepstakes</h4>
                <p className="text-blue-50">Payment solutions for sweepstakes promotions</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-1">Fantasy Sports</h4>
                <p className="text-blue-50">Optimized for DFS and season-long leagues</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Power Your Betting Platform</h2>
          <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
            Join leading sportsbooks and betting operators who trust Kingsmen Pay.
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
