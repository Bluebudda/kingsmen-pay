import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { FileText, Mail, Building, Calendar, User, DollarSign, MapPin, X } from 'lucide-react';

interface Application {
  id: string;
  email: string;
  company_name: string | null;
  contact_name: string | null;
  phone: string | null;
  website: string | null;
  business_type: string | null;
  monthly_volume: string | null;
  industry: string | null;
  countries: string | null;
  additional_info: string | null;
  status: string;
  created_at: string;
  assigned_to: string | null;
}

interface ApplicationsListProps {
  onSelectApplication?: (applicationId: string) => void;
}

export default function ApplicationsList({ onSelectApplication }: ApplicationsListProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      let query = supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [filter]);

  const updateApplicationStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      loadApplications();
      if (selectedApplication?.id === id) {
        setSelectedApplication({ ...selectedApplication, status });
      }
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'under_review':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Merchant Applications</h2>
          <p className="text-slate-600 mt-1">Review and manage merchant applications</p>
        </div>
      </div>

      <div className="flex space-x-2">
        {['all', 'pending', 'under_review', 'approved', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
              filter === status
                ? 'bg-blue-100 text-blue-700'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {status === 'all' ? 'All' : status.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {applications.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-slate-200 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No applications found</p>
            </div>
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                onClick={() => setSelectedApplication(app)}
                className={`bg-white rounded-xl p-6 border border-slate-200 cursor-pointer transition-all hover:shadow-lg ${
                  selectedApplication?.id === app.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 text-lg">
                      {app.company_name || app.contact_name || 'Application'}
                    </h3>
                    <p className="text-sm text-slate-600 flex items-center mt-1">
                      <Mail className="w-3 h-3 mr-1" />
                      {app.email}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(app.status)}`}>
                    {app.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  {app.industry && (
                    <p className="text-slate-600">
                      <span className="font-medium">Industry:</span> {app.industry}
                    </p>
                  )}
                  {app.monthly_volume && (
                    <p className="text-slate-600">
                      <span className="font-medium">Volume:</span> {app.monthly_volume}
                    </p>
                  )}
                  <p className="text-slate-500 text-xs">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {new Date(app.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div>
          {selectedApplication ? (
            <div className="bg-white rounded-xl p-6 border border-slate-200 sticky top-6">
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Application Details</h3>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="p-1 hover:bg-slate-100 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Status</label>
                  <div className="mt-1 flex space-x-2">
                    {['pending', 'under_review', 'approved', 'rejected'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateApplicationStatus(selectedApplication.id, status)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium border capitalize transition-all ${
                          selectedApplication.status === status
                            ? getStatusColor(status)
                            : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        {status.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <div className="space-y-3 text-sm">
                    {selectedApplication.email && (
                      <div className="flex items-start">
                        <Mail className="w-4 h-4 text-slate-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase">Email</p>
                          <p className="text-slate-900">{selectedApplication.email}</p>
                        </div>
                      </div>
                    )}

                    {selectedApplication.company_name && (
                      <div className="flex items-start">
                        <Building className="w-4 h-4 text-slate-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase">Company</p>
                          <p className="text-slate-900">{selectedApplication.company_name}</p>
                        </div>
                      </div>
                    )}

                    {selectedApplication.contact_name && (
                      <div className="flex items-start">
                        <User className="w-4 h-4 text-slate-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase">Contact Name</p>
                          <p className="text-slate-900">{selectedApplication.contact_name}</p>
                        </div>
                      </div>
                    )}

                    {selectedApplication.phone && (
                      <div className="flex items-start">
                        <User className="w-4 h-4 text-slate-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase">Phone</p>
                          <p className="text-slate-900">{selectedApplication.phone}</p>
                        </div>
                      </div>
                    )}

                    {selectedApplication.website && (
                      <div className="flex items-start">
                        <Building className="w-4 h-4 text-slate-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase">Website</p>
                          <a href={selectedApplication.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {selectedApplication.website}
                          </a>
                        </div>
                      </div>
                    )}

                    {selectedApplication.business_type && (
                      <div className="flex items-start">
                        <Building className="w-4 h-4 text-slate-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase">Business Type</p>
                          <p className="text-slate-900 capitalize">{selectedApplication.business_type.replace('_', ' ')}</p>
                        </div>
                      </div>
                    )}

                    {selectedApplication.industry && (
                      <div className="flex items-start">
                        <FileText className="w-4 h-4 text-slate-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase">Industry</p>
                          <p className="text-slate-900 capitalize">{selectedApplication.industry}</p>
                        </div>
                      </div>
                    )}

                    {selectedApplication.monthly_volume && (
                      <div className="flex items-start">
                        <DollarSign className="w-4 h-4 text-slate-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase">Monthly Volume</p>
                          <p className="text-slate-900">{selectedApplication.monthly_volume}</p>
                        </div>
                      </div>
                    )}

                    {selectedApplication.countries && (
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 text-slate-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase">Countries</p>
                          <p className="text-slate-900">{selectedApplication.countries}</p>
                        </div>
                      </div>
                    )}

                    {selectedApplication.additional_info && (
                      <div className="flex items-start">
                        <FileText className="w-4 h-4 text-slate-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase">Additional Info</p>
                          <p className="text-slate-900">{selectedApplication.additional_info}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start pt-2 border-t border-slate-200">
                      <Calendar className="w-4 h-4 text-slate-400 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">Submitted</p>
                        <p className="text-slate-900">
                          {new Date(selectedApplication.created_at).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {onSelectApplication && (
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <button
                      onClick={() => onSelectApplication(selectedApplication.id)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/30"
                    >
                      Start Underwriting
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 border border-slate-200 text-center sticky top-6">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Select an Application
              </h3>
              <p className="text-slate-600">
                Choose an application from the list to view details and update status
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
