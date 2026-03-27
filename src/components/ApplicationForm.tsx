import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Building, User, DollarSign, MessageCircle, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FormData {
  id?: string;
  email: string;
  company_name: string;
  contact_name: string;
  phone: string;
  telegram: string;
  whatsapp: string;
  website: string;
  business_type: string;
  monthly_volume: string;
  industry: string;
  countries: string;
  additional_info: string;
  step_completed: number;
}

export default function ApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    company_name: '',
    contact_name: '',
    phone: '',
    telegram: '',
    whatsapp: '',
    website: '',
    business_type: '',
    monthly_volume: '',
    industry: '',
    countries: '',
    additional_info: '',
    step_completed: 0
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const appId = urlParams.get('id');
    if (appId) {
      loadApplication(appId);
    }
  }, []);

  const loadApplication = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setFormData(data);
        setApplicationId(data.id);
        setCurrentStep(Math.min(data.step_completed + 1, 3));
      }
    } catch (err) {
      console.error('Error loading application:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const autoSave = async (step: number) => {
    if (!formData.email) return;

    setSaving(true);
    try {
      const dataToSave = {
        ...formData,
        step_completed: step
      };

      if (applicationId) {
        const { error: updateError } = await supabase
          .from('applications')
          .update(dataToSave)
          .eq('id', applicationId);

        if (updateError) throw updateError;
      } else {
        const { data, error: insertError } = await supabase
          .from('applications')
          .insert([dataToSave])
          .select()
          .single();

        if (insertError) throw insertError;
        if (data) {
          setApplicationId(data.id);
          window.history.replaceState({}, '', `/apply?id=${data.id}`);
        }
      }
    } catch (err) {
      console.error('Auto-save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleNextStep = async () => {
    setError('');

    if (currentStep === 1 && !formData.email) {
      setError('Email is required to continue');
      return;
    }

    await autoSave(currentStep);
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    try {
      const dataToSave = {
        ...formData,
        step_completed: 3,
        status: 'pending'
      };

      let finalApplicationId = applicationId;

      if (applicationId) {
        const { error: updateError } = await supabase
          .from('applications')
          .update(dataToSave)
          .eq('id', applicationId);

        if (updateError) throw updateError;
      } else {
        const { data, error: insertError } = await supabase
          .from('applications')
          .insert([dataToSave])
          .select()
          .single();

        if (insertError) throw insertError;
        if (data) {
          finalApplicationId = data.id;
          setApplicationId(data.id);
        }
      }

      const emailResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-application-confirmation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            to: formData.email,
            applicationId: finalApplicationId,
            companyName: formData.company_name,
            contactName: formData.contact_name,
          }),
        }
      );

      if (!emailResponse.ok) {
        console.error('Failed to send confirmation email');
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting application:', err);
      setError('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <header className="bg-white/80 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-10">
          <nav className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">K</span>
              </div>
              <span className="text-2xl font-bold text-slate-800">Kingsmen Pay</span>
            </a>
          </nav>
        </header>

        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="bg-gradient-to-br from-green-400 to-green-500 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <CheckCircle className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-6">Application Submitted!</h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Thank you for choosing Kingsmen Pay. Our underwriting team will review your application and reach out within 1-2 business days.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
            <p className="text-slate-700">
              Confirmation sent to <span className="font-semibold text-blue-600">{formData.email}</span>
            </p>
          </div>
          <a
            href="/"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-lg shadow-blue-500/30"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </a>
        </div>
      </div>
    );
  }

  const steps = [
    { number: 1, title: 'Contact Info', icon: User },
    { number: 2, title: 'Business Details', icon: Building },
    { number: 3, title: 'Additional Info', icon: DollarSign }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-10">
        <nav className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <span className="text-2xl font-bold text-slate-800">Kingsmen Pay</span>
          </a>
          {saving && (
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Save className="w-4 h-4 animate-pulse" />
              <span>Saving...</span>
            </div>
          )}
        </nav>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <a href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </a>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">Start Processing Payments</h1>
          <p className="text-xl text-slate-600">
            Join thousands of businesses processing global payments with Kingsmen Pay
          </p>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg transition-all shadow-lg ${
                      currentStep >= step.number
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/30'
                        : 'bg-white text-slate-400 border-2 border-slate-200'
                    }`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`mt-3 text-sm font-semibold ${
                      currentStep >= step.number ? 'text-blue-600' : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-4 rounded-full transition-all ${
                      currentStep > step.number ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 shadow-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 md:p-12">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Contact Information</h2>
                <p className="text-slate-600">How can we reach you?</p>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg"
                  placeholder="you@company.com"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact_name" className="block text-sm font-bold text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="contact_name"
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleChange}
                    className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="telegram" className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Telegram
                  </label>
                  <input
                    type="text"
                    id="telegram"
                    name="telegram"
                    value={formData.telegram}
                    onChange={handleChange}
                    className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="@username"
                  />
                </div>

                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Business Details</h2>
                <p className="text-slate-600">Tell us about your business</p>
              </div>

              <div>
                <label htmlFor="company_name" className="block text-sm font-bold text-slate-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Your Company Ltd."
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-bold text-slate-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="https://yourcompany.com"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="business_type" className="block text-sm font-bold text-slate-700 mb-2">
                    Business Type
                  </label>
                  <select
                    id="business_type"
                    name="business_type"
                    value={formData.business_type}
                    onChange={handleChange}
                    className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                  >
                    <option value="">Select type</option>
                    <option value="sole_proprietorship">Sole Proprietorship</option>
                    <option value="partnership">Partnership</option>
                    <option value="llc">LLC</option>
                    <option value="corporation">Corporation</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="industry" className="block text-sm font-bold text-slate-700 mb-2">
                    Industry
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                  >
                    <option value="">Select industry</option>
                    <option value="forex">Forex Trading</option>
                    <option value="igaming">iGaming</option>
                    <option value="travel">Travel & Tourism</option>
                    <option value="nutraceuticals">Nutraceuticals</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="subscription">Subscription Services</option>
                    <option value="dating">Dating</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="countries" className="block text-sm font-bold text-slate-700 mb-2">
                  Countries of Operation
                </label>
                <input
                  type="text"
                  id="countries"
                  name="countries"
                  value={formData.countries}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g., USA, UK, Canada"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Processing Volume</h2>
                <p className="text-slate-600">Help us understand your needs</p>
              </div>

              <div>
                <label htmlFor="monthly_volume" className="block text-sm font-bold text-slate-700 mb-2">
                  Expected Monthly Processing Volume
                </label>
                <select
                  id="monthly_volume"
                  name="monthly_volume"
                  value={formData.monthly_volume}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                >
                  <option value="">Select volume range</option>
                  <option value="0-50k">$0 - $50,000</option>
                  <option value="50k-100k">$50,000 - $100,000</option>
                  <option value="100k-500k">$100,000 - $500,000</option>
                  <option value="500k-1m">$500,000 - $1,000,000</option>
                  <option value="1m+">$1,000,000+</option>
                </select>
              </div>

              <div>
                <label htmlFor="additional_info" className="block text-sm font-bold text-slate-700 mb-2">
                  Additional Information
                </label>
                <textarea
                  id="additional_info"
                  name="additional_info"
                  value={formData.additional_info}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                  placeholder="Tell us more about your business, payment needs, or any specific requirements..."
                />
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <h3 className="font-bold text-slate-900 mb-2">What happens next?</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Our underwriting team reviews your application within 24 hours</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>We'll reach out to discuss rates and integration options</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Start processing payments within days, not months</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-10 pt-8 border-t-2 border-slate-100">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePreviousStep}
                className="flex items-center space-x-2 px-6 py-3 border-2 border-slate-300 rounded-xl hover:bg-slate-50 transition-all font-semibold text-slate-700"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Previous</span>
              </button>
            ) : (
              <a
                href="/"
                className="flex items-center space-x-2 px-6 py-3 border-2 border-slate-300 rounded-xl hover:bg-slate-50 transition-all font-semibold text-slate-700"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Cancel</span>
              </a>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-semibold shadow-lg shadow-blue-500/30"
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-semibold shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <span>Submit Application</span>
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>

          {currentStep === 1 && (
            <p className="text-sm text-slate-500 text-center mt-6">
              Your progress is automatically saved. You can return anytime to complete your application.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
