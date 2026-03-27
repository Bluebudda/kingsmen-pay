import { useState, useEffect } from 'react';
import { supabase, UnderwritingService, UnderwritingRate } from '../../lib/supabase';
import { Plus, Filter, DollarSign } from 'lucide-react';
import RateTable from './RateTable';
import AddRateModal from './AddRateModal';

type RateManagerProps = {
  service: UnderwritingService;
};

export default function RateManager({ service }: RateManagerProps) {
  const [rates, setRates] = useState<UnderwritingRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddRate, setShowAddRate] = useState(false);
  const [filters, setFilters] = useState({
    paymentMethod: '',
    country: '',
    businessCategory: '',
  });

  useEffect(() => {
    loadRates();
  }, [service.id]);

  const loadRates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('underwriting_rates')
        .select('*')
        .eq('service_id', service.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRates(data || []);
    } catch (error) {
      console.error('Error loading rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRates = rates.filter((rate) => {
    if (filters.paymentMethod && rate.payment_method !== filters.paymentMethod) return false;
    if (filters.country && rate.country !== filters.country) return false;
    if (filters.businessCategory && rate.business_category !== filters.businessCategory) return false;
    return true;
  });

  const uniquePaymentMethods = [...new Set(rates.map(r => r.payment_method))];
  const uniqueCountries = [...new Set(rates.map(r => r.country))];
  const uniqueBusinessCategories = [...new Set(rates.map(r => r.business_category).filter(Boolean))];

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 border border-slate-200">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{service.service_name}</h3>
            <p className="text-sm text-slate-600 mt-1">{service.description}</p>
          </div>
          <button
            onClick={() => setShowAddRate(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center space-x-2 shadow-lg shadow-blue-500/30"
          >
            <Plus className="w-4 h-4" />
            <span>Add Rate</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={filters.paymentMethod}
            onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Payment Methods</option>
            {uniquePaymentMethods.map((method) => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>

          <select
            value={filters.country}
            onChange={(e) => setFilters({ ...filters, country: e.target.value })}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Countries</option>
            {uniqueCountries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>

          <select
            value={filters.businessCategory}
            onChange={(e) => setFilters({ ...filters, businessCategory: e.target.value })}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {uniqueBusinessCategories.map((category) => (
              <option key={category} value={category || ''}>{category}</option>
            ))}
          </select>

          {(filters.paymentMethod || filters.country || filters.businessCategory) && (
            <button
              onClick={() => setFilters({ paymentMethod: '', country: '', businessCategory: '' })}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {filteredRates.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-slate-200 text-center">
          <DollarSign className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No Rates Configured
          </h3>
          <p className="text-slate-600 mb-4">
            Start by adding rate configurations for this service
          </p>
          <button
            onClick={() => setShowAddRate(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Rate</span>
          </button>
        </div>
      ) : (
        <RateTable rates={filteredRates} onUpdate={loadRates} />
      )}

      {showAddRate && (
        <AddRateModal
          serviceId={service.id}
          onClose={() => setShowAddRate(false)}
          onSuccess={() => {
            setShowAddRate(false);
            loadRates();
          }}
        />
      )}
    </div>
  );
}
