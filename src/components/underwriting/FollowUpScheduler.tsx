import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, CheckCircle, AlertCircle, Repeat, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface FollowUp {
  id: string;
  followup_type: string;
  description: string;
  status: string;
  priority: string;
  scheduled_date: string;
  completed_at: string | null;
  assigned_to: string | null;
  days_to_reschedule: number;
  reschedule_count: number;
  created_at: string;
}

interface Employee {
  id: string;
  full_name: string;
}

interface FollowUpSchedulerProps {
  applicationId: string;
}

export default function FollowUpScheduler({ applicationId }: FollowUpSchedulerProps) {
  const { employee } = useAuth();
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    followup_type: 'missing_documents',
    description: '',
    priority: 'medium',
    scheduled_date: '',
    assigned_to: '',
    days_to_reschedule: 3
  });

  useEffect(() => {
    loadFollowUps();
    loadEmployees();
  }, [applicationId]);

  const loadFollowUps = async () => {
    try {
      const { data, error } = await supabase
        .from('client_followups')
        .select('*')
        .eq('application_id', applicationId)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      setFollowUps(data || []);
    } catch (err) {
      console.error('Error loading follow-ups:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('id, full_name')
        .eq('is_active', true)
        .order('full_name');

      if (error) throw error;
      setEmployees(data || []);
    } catch (err) {
      console.error('Error loading employees:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from('client_followups')
        .insert({
          application_id: applicationId,
          ...formData
        });

      if (error) throw error;

      setFormData({
        followup_type: 'missing_documents',
        description: '',
        priority: 'medium',
        scheduled_date: '',
        assigned_to: '',
        days_to_reschedule: 3
      });
      setShowAddForm(false);
      loadFollowUps();
    } catch (err) {
      console.error('Error creating follow-up:', err);
    }
  };

  const handleComplete = async (followUpId: string) => {
    try {
      const { error } = await supabase
        .from('client_followups')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', followUpId);

      if (error) throw error;
      loadFollowUps();
    } catch (err) {
      console.error('Error completing follow-up:', err);
    }
  };

  const handleReschedule = async (followUpId: string, daysToAdd: number) => {
    try {
      const followUp = followUps.find(f => f.id === followUpId);
      if (!followUp) return;

      const newDate = new Date();
      newDate.setDate(newDate.getDate() + daysToAdd);

      const { error } = await supabase
        .from('client_followups')
        .update({
          scheduled_date: newDate.toISOString(),
          reschedule_count: followUp.reschedule_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', followUpId);

      if (error) throw error;
      loadFollowUps();
    } catch (err) {
      console.error('Error rescheduling follow-up:', err);
    }
  };

  const handleDelete = async (followUpId: string) => {
    if (!confirm('Are you sure you want to delete this follow-up?')) return;

    try {
      const { error } = await supabase
        .from('client_followups')
        .delete()
        .eq('id', followUpId);

      if (error) throw error;
      loadFollowUps();
    } catch (err) {
      console.error('Error deleting follow-up:', err);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-slate-100 text-slate-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  const pendingFollowUps = followUps.filter(f => f.status === 'pending' || f.status === 'in_progress');
  const completedFollowUps = followUps.filter(f => f.status === 'completed');

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="text-center text-slate-600">Loading follow-ups...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Client Follow-Ups</h3>
          <p className="text-xs text-slate-600 mt-1">
            {pendingFollowUps.length} pending • {completedFollowUps.length} completed
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Follow-Up</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-3">Schedule New Follow-Up</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Follow-Up Type
              </label>
              <select
                value={formData.followup_type}
                onChange={(e) => setFormData({ ...formData, followup_type: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                required
              >
                <option value="missing_documents">Missing Documents</option>
                <option value="clarification_needed">Clarification Needed</option>
                <option value="additional_info">Additional Information</option>
                <option value="verification_pending">Verification Pending</option>
                <option value="general_followup">General Follow-Up</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Scheduled Date
              </label>
              <input
                type="datetime-local"
                value={formData.scheduled_date}
                onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Auto-Reschedule (days)
              </label>
              <input
                type="number"
                value={formData.days_to_reschedule}
                onChange={(e) => setFormData({ ...formData, days_to_reschedule: parseInt(e.target.value) })}
                min="1"
                max="30"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Assign To Employee
              </label>
              <select
                value={formData.assigned_to}
                onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Unassigned</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Describe what needs to be followed up..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 mt-3">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all text-sm"
            >
              Schedule Follow-Up
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {pendingFollowUps.length === 0 && !showAddForm && (
          <div className="text-center py-8 text-slate-500">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No pending follow-ups scheduled</p>
          </div>
        )}

        {pendingFollowUps.map((followUp) => {
          const scheduledDate = new Date(followUp.scheduled_date);
          const isOverdue = scheduledDate < new Date();

          return (
            <div
              key={followUp.id}
              className={`p-4 rounded-lg border-2 ${getPriorityColor(followUp.priority)} transition-all`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(followUp.status)}`}>
                      {followUp.status}
                    </span>
                    <span className="text-xs font-medium text-slate-900">
                      {followUp.followup_type.replace(/_/g, ' ').toUpperCase()}
                    </span>
                    {followUp.reschedule_count > 0 && (
                      <span className="text-xs text-slate-500">
                        (Rescheduled {followUp.reschedule_count}x)
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-700 mb-2">{followUp.description}</p>

                  <div className="flex items-center space-x-3 text-xs text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                        {scheduledDate.toLocaleDateString()} {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isOverdue && <span className="text-red-600 font-medium">(Overdue)</span>}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Repeat className="w-3 h-3" />
                      <span>Reschedule in {followUp.days_to_reschedule} days</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 mt-3">
                <button
                  onClick={() => handleReschedule(followUp.id, followUp.days_to_reschedule)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-all text-xs"
                >
                  <Clock className="w-3 h-3" />
                  <span>Reschedule</span>
                </button>
                <button
                  onClick={() => handleComplete(followUp.id)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded transition-all text-xs"
                >
                  <CheckCircle className="w-3 h-3" />
                  <span>Complete</span>
                </button>
                <button
                  onClick={() => handleDelete(followUp.id)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded transition-all text-xs"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {completedFollowUps.length > 0 && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900">
            Show {completedFollowUps.length} completed follow-ups
          </summary>
          <div className="mt-2 space-y-2">
            {completedFollowUps.map((followUp) => (
              <div key={followUp.id} className="p-3 bg-slate-50 rounded border border-slate-200 opacity-75">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <span className="text-xs font-medium text-slate-900">
                      {followUp.followup_type.replace(/_/g, ' ').toUpperCase()}
                    </span>
                    <p className="text-xs text-slate-600 mt-1">{followUp.description}</p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
