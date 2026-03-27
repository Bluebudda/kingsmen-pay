import { Handshake, TrendingUp, Globe, Users, CheckCircle, ArrowRight, BarChart3, Shield, Zap, Award, Building2, Target } from 'lucide-react';

export default function PartnerPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 w-full bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 z-50">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <span className="text-2xl font-bold text-slate-800">Kingsmen Pay</span>
          </a>
          <div className="hidden md:flex items-center space-x-8">
            <a href="/#solutions" className="text-slate-700 hover:text-blue-600 transition-colors">Solutions</a>
            <a href="/#products" className="text-slate-700 hover:text-blue-600 transition-colors">Products</a>
            <a href="/#industries" className="text-slate-700 hover:text-blue-600 transition-colors">Industries</a>
            <a href="/partner" className="text-blue-600 font-semibold">Partner With Us</a>
            <a href="/contact" className="text-slate-700 hover:text-blue-600 transition-colors">Contact</a>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/employee" className="text-slate-700 hover:text-blue-600 transition-colors">Employee Portal</a>
            <a href="/contact" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-lg shadow-blue-500/30">
              Get Started
            </a>
          </div>
        </nav>
      </header>

      <HeroSection />
      <PartnershipBenefits />
      <PartnerTypes />
      <HowItWorks />
      <SuccessStories />
      <CTASection />
      <Footer />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
            <Handshake className="w-4 h-4" />
            <span className="text-sm font-medium">Join Our Partner Network</span>
          </div>
          <h1 className="text-6xl font-bold text-slate-900 leading-tight mb-6">
            Build, grow, and <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">succeed together</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            Partner with Kingsmen Pay to unlock new revenue streams, expand your service offerings, and deliver exceptional payment solutions to your clients. Join our global network of successful partners.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <a href="/apply" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium text-lg flex items-center space-x-2 shadow-lg shadow-blue-500/30">
              <span>Become a Partner</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            <a href="/contact" className="border-2 border-blue-500 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-all font-medium text-lg">
              Learn More
            </a>
          </div>
          <p className="text-sm text-slate-500 mt-6">Join 500+ partners worldwide • No joining fees • Dedicated support</p>
        </div>
      </div>
    </section>
  );
}

function PartnershipBenefits() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Recurring Revenue",
      description: "Earn competitive commissions on every transaction your clients process. Build a sustainable, recurring revenue stream that grows with your clients' success."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Access to 160+ payment methods across 150+ countries. Help your clients expand internationally with our comprehensive global payment infrastructure."
    },
    {
      icon: Users,
      title: "Dedicated Support",
      description: "Get a dedicated partner manager and 24/7 technical support. We're here to help you succeed with training, resources, and ongoing guidance."
    },
    {
      icon: Shield,
      title: "White-Label Solutions",
      description: "Offer payment processing under your own brand. Maintain your client relationships while providing world-class payment technology."
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Track your performance with comprehensive dashboards. Monitor transactions, commissions, and client activity in real-time."
    },
    {
      icon: Zap,
      title: "Fast Integration",
      description: "Quick onboarding with easy-to-use APIs and comprehensive documentation. Get your clients processing payments in days, not months."
    }
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Why partner with Kingsmen Pay?</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            We provide everything you need to grow your business and deliver exceptional value to your clients.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="border border-blue-200 rounded-2xl p-8 hover:shadow-xl transition-all hover:border-blue-400 group bg-white">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                <benefit.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
              <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnerTypes() {
  const partnerTypes = [
    {
      icon: Building2,
      title: "Referral Partners",
      description: "Introduce clients to Kingsmen Pay and earn competitive referral commissions for every successful partnership.",
      benefits: ["Easy to get started", "No technical knowledge required", "Earn commissions on every referral", "Full support from our team"]
    },
    {
      icon: Target,
      title: "Solution Partners",
      description: "Integrate Kingsmen Pay into your platform or service offering to add payment processing capabilities.",
      benefits: ["White-label options available", "API integration support", "Co-marketing opportunities", "Revenue sharing model"]
    },
    {
      icon: Award,
      title: "Technology Partners",
      description: "Build integrations and complementary solutions that enhance the Kingsmen Pay ecosystem.",
      benefits: ["Access to our API platform", "Technical documentation", "Joint go-to-market strategy", "Featured in our marketplace"]
    }
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Partner programs designed for you</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Choose the partnership model that best fits your business goals and expertise.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {partnerTypes.map((type, index) => (
            <div key={index} className="bg-white border-2 border-blue-200 rounded-2xl p-8 hover:shadow-2xl transition-all hover:border-blue-400">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <type.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{type.title}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">{type.description}</p>
              <ul className="space-y-3">
                {type.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Apply to Join",
      description: "Fill out our simple application form. Tell us about your business and how you plan to partner with us."
    },
    {
      number: "2",
      title: "Get Approved",
      description: "Our team reviews your application within 48 hours. Once approved, you'll receive access to our partner portal."
    },
    {
      number: "3",
      title: "Get Training",
      description: "Access comprehensive training materials, documentation, and dedicated support to get you up to speed."
    },
    {
      number: "4",
      title: "Start Earning",
      description: "Begin referring clients or integrating our solutions. Track your performance and earnings in real-time."
    }
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Getting started is simple</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            From application to first client, we make the process smooth and straightforward.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-white">{step.number}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-300 to-blue-200 -z-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SuccessStories() {
  return (
    <section className="py-24 px-6 bg-gradient-to-br from-blue-100 via-blue-50 to-blue-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Partner success by the numbers</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Our partners are thriving with Kingsmen Pay. Here's what they've achieved together with us.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div className="bg-white rounded-2xl p-8 border border-blue-200">
            <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">500+</div>
            <div className="text-slate-600 font-medium">Active Partners</div>
          </div>
          <div className="bg-white rounded-2xl p-8 border border-blue-200">
            <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">$2B+</div>
            <div className="text-slate-600 font-medium">Processed Annually</div>
          </div>
          <div className="bg-white rounded-2xl p-8 border border-blue-200">
            <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">95%</div>
            <div className="text-slate-600 font-medium">Partner Satisfaction</div>
          </div>
          <div className="bg-white rounded-2xl p-8 border border-blue-200">
            <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">150+</div>
            <div className="text-slate-600 font-medium">Countries Served</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-5xl font-bold text-slate-900 mb-6">Ready to grow together?</h2>
        <p className="text-xl text-slate-600 mb-10 leading-relaxed">
          Join our global partner network and start building a more profitable future. Our team is ready to help you succeed.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <a href="/apply" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium text-lg flex items-center space-x-2 shadow-lg shadow-blue-500/30">
            <span>Apply Now</span>
            <ArrowRight className="w-5 h-5" />
          </a>
          <a href="/contact" className="border-2 border-blue-500 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-all font-medium text-lg">
            Contact Partner Team
          </a>
        </div>
        <p className="text-sm text-slate-500 mt-6">Questions? Email partnerships@kingsmenpay.com</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-100 text-slate-600 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">K</span>
              </div>
              <span className="text-xl font-bold text-slate-900">Kingsmen Pay</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Empowering businesses worldwide with secure, transparent payment processing solutions.
            </p>
          </div>
          <div>
            <h4 className="text-slate-900 font-semibold mb-4">Solutions</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/#solutions" className="hover:text-blue-600 transition-colors">Global Processing</a></li>
              <li><a href="/#solutions" className="hover:text-blue-600 transition-colors">High-Risk Solutions</a></li>
              <li><a href="/#solutions" className="hover:text-blue-600 transition-colors">Local Payments</a></li>
              <li><a href="/#products" className="hover:text-blue-600 transition-colors">API Integration</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-900 font-semibold mb-4">Partners</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/partner" className="hover:text-blue-600 transition-colors">Become a Partner</a></li>
              <li><a href="/partner" className="hover:text-blue-600 transition-colors">Partner Programs</a></li>
              <li><a href="/partner" className="hover:text-blue-600 transition-colors">Partner Portal</a></li>
              <li><a href="/contact" className="hover:text-blue-600 transition-colors">Partner Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-900 font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-blue-600 transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-blue-600 transition-colors">Contact</a></li>
              <li><a href="/employee" className="hover:text-blue-600 transition-colors font-medium">Employee Portal</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-300 pt-8 text-sm text-slate-500 text-center">
          <p>Copyright 2025 - All Rights Reserved By Kingsmen Pay</p>
        </div>
      </div>
    </footer>
  );
}
