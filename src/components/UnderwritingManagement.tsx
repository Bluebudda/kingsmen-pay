import { useState, useEffect } from 'react';
import { supabase, UnderwritingService } from '../lib/supabase';
import { Plus, Search, Settings, FileText, DollarSign } from 'lucide-react';
import ServiceList from './underwriting/ServiceList';
import RateManager from './underwriting/RateManager';
import ApplicationsList from './underwriting/ApplicationsList';
import UnderwritingWorkflow from './underwriting/UnderwritingWorkflow';

type UnderwritingTab = 'applications' | 'services';

export default function UnderwritingManagement() {
  const [activeTab, setActiveTab] = useState<UnderwritingTab>('applications');
  const [services, setServices] = useState<UnderwritingService[]>([]);
  const [selectedService, setSelectedService] = useState<UnderwritingService | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddService, setShowAddService] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('underwriting_services')
        .select('*')
        .order('service_name');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service =>
    service.service_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && activeTab === 'services') {
    return (
      <div className="bg-white rounded-xl p-8 border border-slate-200">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (selectedApplicationId) {
    return (
      <UnderwritingWorkflow
        applicationId={selectedApplicationId}
        onBack={() => setSelectedApplicationId(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-1 mb-6">
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'applications'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Applications</span>
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'services'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Services & Rates</span>
        </button>
      </div>

      {activeTab === 'applications' && <ApplicationsList onSelectApplication={setSelectedApplicationId} />}

      {activeTab === 'services' && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Services & Rate Management</h2>
              <p className="text-slate-600 mt-1">Manage services and rate structures</p>
            </div>
            <button
              onClick={() => setShowAddService(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center space-x-2 shadow-lg shadow-blue-500/30"
            >
              <Plus className="w-4 h-4" />
              <span>Add Service</span>
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-slate-200">
              <div className="p-4 border-b border-slate-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <ServiceList
                services={filteredServices}
                selectedService={selectedService}
                onSelectService={setSelectedService}
              />
            </div>

            <div className="md:col-span-2">
              {selectedService ? (
                <RateManager service={selectedService} />
              ) : (
                <div className="bg-white rounded-xl p-12 border border-slate-200 text-center">
                  <Settings className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Select a Service
                  </h3>
                  <p className="text-slate-600">
                    Choose a service from the list to view and manage its rates
                  </p>
                </div>
              )}
            </div>
          </div>

          {showAddService && (
            <AddServiceModal
              onClose={() => setShowAddService(false)}
              onSuccess={() => {
                setShowAddService(false);
                loadServices();
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

function AddServiceModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from('underwriting_services')
        .insert({
          service_name: serviceName,
          description: description || null,
        });

      if (insertError) throw insertError;
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Add New Service</h3>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Service Name
            </label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., PaymentProvider X"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Service description..."
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
