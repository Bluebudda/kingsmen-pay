import { useState, FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { X } from 'lucide-react';

type AddRateModalProps = {
  serviceId: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddRateModal({ serviceId, onClose, onSuccess }: AddRateModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    payment_method: 'Credit Card',
    country: '',
    payin_channel: '',
    business_category: 'IG',
    traffic_type: 'FTD',

    cost_payin_rate: '',
    cost_payin_min: '',
    cost_payin_max: '',
    cost_payout_rate: '',
    cost_payout_min: '',
    cost_payout_max: '',
    cost_settlement_fee: '',

    buy_payin_rate: '',
    buy_payin_min: '',
    buy_payin_max: '',
    buy_payout_rate: '',
    buy_payout_min: '',
    buy_payout_max: '',
    buy_settlement_fee: '',

    merchant_payin_rate: '',
    merchant_payin_min: '',
    merchant_payin_max: '',
    merchant_payout_rate: '',
    merchant_payout_min: '',
    merchant_payout_max: '',
    merchant_settlement_fee: '',

    success_rate: '',
    settlement_time: 'T+1',
    rolling_reserve: '',
    country_restrictions: '',
    notes: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const dataToInsert = {
        service_id: serviceId,
        payment_method: formData.payment_method,
        country: formData.country,
        payin_channel: formData.payin_channel || null,
        business_category: formData.business_category || null,
        traffic_type: formData.traffic_type || null,

        cost_payin_rate: formData.cost_payin_rate ? parseFloat(formData.cost_payin_rate) : null,
        cost_payin_min: formData.cost_payin_min ? parseFloat(formData.cost_payin_min) : null,
        cost_payin_max: formData.cost_payin_max ? parseFloat(formData.cost_payin_max) : null,
        cost_payout_rate: formData.cost_payout_rate ? parseFloat(formData.cost_payout_rate) : null,
        cost_payout_min: formData.cost_payout_min ? parseFloat(formData.cost_payout_min) : null,
        cost_payout_max: formData.cost_payout_max ? parseFloat(formData.cost_payout_max) : null,
        cost_settlement_fee: formData.cost_settlement_fee ? parseFloat(formData.cost_settlement_fee) : null,

        buy_payin_rate: formData.buy_payin_rate ? parseFloat(formData.buy_payin_rate) : null,
        buy_payin_min: formData.buy_payin_min ? parseFloat(formData.buy_payin_min) : null,
        buy_payin_max: formData.buy_payin_max ? parseFloat(formData.buy_payin_max) : null,
        buy_payout_rate: formData.buy_payout_rate ? parseFloat(formData.buy_payout_rate) : null,
        buy_payout_min: formData.buy_payout_min ? parseFloat(formData.buy_payout_min) : null,
        buy_payout_max: formData.buy_payout_max ? parseFloat(formData.buy_payout_max) : null,
        buy_settlement_fee: formData.buy_settlement_fee ? parseFloat(formData.buy_settlement_fee) : null,

        merchant_payin_rate: formData.merchant_payin_rate ? parseFloat(formData.merchant_payin_rate) : null,
        merchant_payin_min: formData.merchant_payin_min ? parseFloat(formData.merchant_payin_min) : null,
        merchant_payin_max: formData.merchant_payin_max ? parseFloat(formData.merchant_payin_max) : null,
        merchant_payout_rate: formData.merchant_payout_rate ? parseFloat(formData.merchant_payout_rate) : null,
        merchant_payout_min: formData.merchant_payout_min ? parseFloat(formData.merchant_payout_min) : null,
        merchant_payout_max: formData.merchant_payout_max ? parseFloat(formData.merchant_payout_max) : null,
        merchant_settlement_fee: formData.merchant_settlement_fee ? parseFloat(formData.merchant_settlement_fee) : null,

        success_rate: formData.success_rate ? parseFloat(formData.success_rate) : null,
        settlement_time: formData.settlement_time || null,
        rolling_reserve: formData.rolling_reserve || null,
        country_restrictions: formData.country_restrictions || null,
        notes: formData.notes || null,
      };

      const { error: insertError } = await supabase
        .from('underwriting_rates')
        .insert(dataToInsert);

      if (insertError) throw insertError;
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add rate');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-5xl w-full my-8">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h3 className="text-xl font-bold text-slate-900">Add New Rate Configuration</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Payment Method *
                  </label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) => handleChange('payment_method', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Credit Card">Credit Card</option>
                    <option value="ACH">ACH</option>
                    <option value="SEPA">SEPA</option>
                    <option value="Wallet">Wallet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Brazil, India"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Payin Channel
                  </label>
                  <input
                    type="text"
                    value={formData.payin_channel}
                    onChange={(e) => handleChange('payin_channel', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., PIX, UPI"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Business Category
                  </label>
                  <select
                    value={formData.business_category}
                    onChange={(e) => handleChange('business_category', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="IG">IG (iGaming)</option>
                    <option value="FX">FX (Forex)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Traffic Type
                  </label>
                  <select
                    value={formData.traffic_type}
                    onChange={(e) => handleChange('traffic_type', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="FTD">FTD</option>
                    <option value="Trusted">Trusted</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h4 className="text-lg font-semibold text-red-900 mb-4 bg-red-50 px-4 py-2 rounded-lg">
                Tier 1: Cost Rates (Our Cost)
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                <InputField label="Payin Rate (%)" value={formData.cost_payin_rate} onChange={(v) => handleChange('cost_payin_rate', v)} />
                <InputField label="Payin Min" value={formData.cost_payin_min} onChange={(v) => handleChange('cost_payin_min', v)} />
                <InputField label="Payin Max" value={formData.cost_payin_max} onChange={(v) => handleChange('cost_payin_max', v)} />
                <InputField label="Payout Rate (%)" value={formData.cost_payout_rate} onChange={(v) => handleChange('cost_payout_rate', v)} />
                <InputField label="Payout Min" value={formData.cost_payout_min} onChange={(v) => handleChange('cost_payout_min', v)} />
                <InputField label="Payout Max" value={formData.cost_payout_max} onChange={(v) => handleChange('cost_payout_max', v)} />
                <InputField label="Settlement Fee" value={formData.cost_settlement_fee} onChange={(v) => handleChange('cost_settlement_fee', v)} />
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h4 className="text-lg font-semibold text-blue-900 mb-4 bg-blue-50 px-4 py-2 rounded-lg">
                Tier 2: Buy Rates (Partner Rates)
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                <InputField label="Payin Rate (%)" value={formData.buy_payin_rate} onChange={(v) => handleChange('buy_payin_rate', v)} />
                <InputField label="Payin Min" value={formData.buy_payin_min} onChange={(v) => handleChange('buy_payin_min', v)} />
                <InputField label="Payin Max" value={formData.buy_payin_max} onChange={(v) => handleChange('buy_payin_max', v)} />
                <InputField label="Payout Rate (%)" value={formData.buy_payout_rate} onChange={(v) => handleChange('buy_payout_rate', v)} />
                <InputField label="Payout Min" value={formData.buy_payout_min} onChange={(v) => handleChange('buy_payout_min', v)} />
                <InputField label="Payout Max" value={formData.buy_payout_max} onChange={(v) => handleChange('buy_payout_max', v)} />
                <InputField label="Settlement Fee" value={formData.buy_settlement_fee} onChange={(v) => handleChange('buy_settlement_fee', v)} />
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h4 className="text-lg font-semibold text-green-900 mb-4 bg-green-50 px-4 py-2 rounded-lg">
                Tier 3: Merchant Rates (Client Suggested)
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                <InputField label="Payin Rate (%)" value={formData.merchant_payin_rate} onChange={(v) => handleChange('merchant_payin_rate', v)} />
                <InputField label="Payin Min" value={formData.merchant_payin_min} onChange={(v) => handleChange('merchant_payin_min', v)} />
                <InputField label="Payin Max" value={formData.merchant_payin_max} onChange={(v) => handleChange('merchant_payin_max', v)} />
                <InputField label="Payout Rate (%)" value={formData.merchant_payout_rate} onChange={(v) => handleChange('merchant_payout_rate', v)} />
                <InputField label="Payout Min" value={formData.merchant_payout_min} onChange={(v) => handleChange('merchant_payout_min', v)} />
                <InputField label="Payout Max" value={formData.merchant_payout_max} onChange={(v) => handleChange('merchant_payout_max', v)} />
                <InputField label="Settlement Fee" value={formData.merchant_settlement_fee} onChange={(v) => handleChange('merchant_settlement_fee', v)} />
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Additional Information</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <InputField label="Success Rate (%)" value={formData.success_rate} onChange={(v) => handleChange('success_rate', v)} />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Settlement Time
                  </label>
                  <select
                    value={formData.settlement_time}
                    onChange={(e) => handleChange('settlement_time', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="T0">T0 (Same Day)</option>
                    <option value="T+1">T+1 (Next Day)</option>
                    <option value="T+2">T+2 (2 Days)</option>
                    <option value="T+3">T+3 (3 Days)</option>
                    <option value="T+7">T+7 (7 Days)</option>
                  </select>
                </div>
                <InputField label="Rolling Reserve" value={formData.rolling_reserve} onChange={(v) => handleChange('rolling_reserve', v)} />
                <InputField label="Country Restrictions" value={formData.country_restrictions} onChange={(v) => handleChange('country_restrictions', v)} />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional notes or comments..."
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mt-8 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium disabled:opacity-50 shadow-lg shadow-blue-500/30"
            >
              {loading ? 'Adding Rate...' : 'Add Rate Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="0.00"
      />
    </div>
  );
}
