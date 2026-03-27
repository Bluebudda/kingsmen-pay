import { useState } from 'react';
import { UnderwritingRate } from '../../lib/supabase';
import { ChevronDown, ChevronRight, CreditCard as Edit2, Trash2 } from 'lucide-react';

type RateTableProps = {
  rates: UnderwritingRate[];
  onUpdate: () => void;
};

export default function RateTable({ rates }: RateTableProps) {
  const [expandedRate, setExpandedRate] = useState<string | null>(null);

  const toggleExpand = (rateId: string) => {
    setExpandedRate(expandedRate === rateId ? null : rateId);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">

              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                Payment Method
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                Country
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                Channel
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                Category
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                Traffic
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rates.map((rate) => (
              <>
                <tr key={rate.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleExpand(rate.id)}
                      className="p-1 hover:bg-slate-200 rounded transition-colors"
                    >
                      {expandedRate === rate.id ? (
                        <ChevronDown className="w-4 h-4 text-slate-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {rate.payment_method}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900">{rate.country}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{rate.payin_channel || '-'}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{rate.business_category || '-'}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{rate.traffic_type || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedRate === rate.id && (
                  <tr>
                    <td colSpan={7} className="px-4 py-4 bg-slate-50">
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-6">
                          <RateTierCard
                            title="Cost Rates (Tier 1)"
                            subtitle="Our Cost"
                            color="red"
                            rate={rate}
                            prefix="cost"
                          />
                          <RateTierCard
                            title="Buy Rates (Tier 2)"
                            subtitle="Partner Rates"
                            color="blue"
                            rate={rate}
                            prefix="buy"
                          />
                          <RateTierCard
                            title="Merchant Rates (Tier 3)"
                            subtitle="Client Suggested"
                            color="green"
                            rate={rate}
                            prefix="merchant"
                          />
                        </div>

                        <div className="border-t border-slate-200 pt-4">
                          <h4 className="text-sm font-semibold text-slate-900 mb-3">Additional Information</h4>
                          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <InfoField label="Success Rate" value={rate.success_rate ? `${rate.success_rate}%` : '-'} />
                            <InfoField label="Settlement Time" value={rate.settlement_time || '-'} />
                            <InfoField label="Rolling Reserve" value={rate.rolling_reserve || '-'} />
                            <InfoField label="Country Restrictions" value={rate.country_restrictions || 'None'} />
                          </div>
                          {rate.notes && (
                            <div className="mt-4">
                              <InfoField label="Notes" value={rate.notes} fullWidth />
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type RateTierCardProps = {
  title: string;
  subtitle: string;
  color: 'red' | 'blue' | 'green';
  rate: UnderwritingRate;
  prefix: 'cost' | 'buy' | 'merchant';
};

function RateTierCard({ title, subtitle, color, rate, prefix }: RateTierCardProps) {
  const colorClasses = {
    red: 'bg-red-50 border-red-200',
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
  };

  const headerColors = {
    red: 'bg-red-100 text-red-900',
    blue: 'bg-blue-100 text-blue-900',
    green: 'bg-green-100 text-green-900',
  };

  return (
    <div className={`border rounded-lg ${colorClasses[color]}`}>
      <div className={`px-4 py-3 ${headerColors[color]} rounded-t-lg`}>
        <h4 className="font-semibold text-sm">{title}</h4>
        <p className="text-xs opacity-75">{subtitle}</p>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <p className="text-xs font-medium text-slate-600 mb-1">Payin</p>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Rate:</span>
              <span className="font-medium">{rate[`${prefix}_payin_rate` as keyof UnderwritingRate] || '-'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Min:</span>
              <span className="font-medium">{rate[`${prefix}_payin_min` as keyof UnderwritingRate] || '-'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Max:</span>
              <span className="font-medium">{rate[`${prefix}_payin_max` as keyof UnderwritingRate] || '-'}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-3">
          <p className="text-xs font-medium text-slate-600 mb-1">Payout</p>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Rate:</span>
              <span className="font-medium">{rate[`${prefix}_payout_rate` as keyof UnderwritingRate] || '-'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Min:</span>
              <span className="font-medium">{rate[`${prefix}_payout_min` as keyof UnderwritingRate] || '-'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Max:</span>
              <span className="font-medium">{rate[`${prefix}_payout_max` as keyof UnderwritingRate] || '-'}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Settlement Fee:</span>
            <span className="font-medium">{rate[`${prefix}_settlement_fee` as keyof UnderwritingRate] || '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value, fullWidth = false }: { label: string; value: string; fullWidth?: boolean }) {
  return (
    <div className={fullWidth ? 'col-span-full' : ''}>
      <p className="text-xs font-medium text-slate-600 mb-1">{label}</p>
      <p className="text-sm text-slate-900">{value}</p>
    </div>
  );
}
