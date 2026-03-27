import { UnderwritingService } from '../../lib/supabase';
import { Building2, CheckCircle2 } from 'lucide-react';

type ServiceListProps = {
  services: UnderwritingService[];
  selectedService: UnderwritingService | null;
  onSelectService: (service: UnderwritingService) => void;
};

export default function ServiceList({ services, selectedService, onSelectService }: ServiceListProps) {
  return (
    <div className="divide-y divide-slate-200 max-h-[600px] overflow-y-auto">
      {services.map((service) => (
        <button
          key={service.id}
          onClick={() => onSelectService(service)}
          className={`w-full p-4 text-left hover:bg-slate-50 transition-colors ${
            selectedService?.id === service.id ? 'bg-blue-50' : ''
          }`}
        >
          <div className="flex items-start space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              selectedService?.id === service.id ? 'bg-blue-100' : 'bg-slate-100'
            }`}>
              <Building2 className={`w-5 h-5 ${
                selectedService?.id === service.id ? 'text-blue-600' : 'text-slate-600'
              }`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className={`font-semibold truncate ${
                  selectedService?.id === service.id ? 'text-blue-900' : 'text-slate-900'
                }`}>
                  {service.service_name}
                </h3>
                {service.is_active && (
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                )}
              </div>
              {service.description && (
                <p className="text-sm text-slate-600 line-clamp-2">
                  {service.description}
                </p>
              )}
            </div>
          </div>
        </button>
      ))}

      {services.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-slate-500 text-sm">No services found</p>
        </div>
      )}
    </div>
  );
}
