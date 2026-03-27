import { useState, useEffect } from 'react';
import { CheckCircle, Circle, Calendar, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Task {
  id: string;
  task_type: string;
  task_description: string;
  is_required: boolean;
  is_completed: boolean;
  completed_at: string | null;
  due_date: string | null;
  order_index: number;
}

interface TaskChecklistProps {
  applicationId: string;
}

const DEFAULT_TASKS = [
  { task_type: 'kyc_review', task_description: 'Review and verify KYC documents', is_required: true, order_index: 1 },
  { task_type: 'identity_verification', task_description: 'Complete identity verification checks', is_required: true, order_index: 2 },
  { task_type: 'address_verification', task_description: 'Verify address proof (within 3 months)', is_required: true, order_index: 3 },
  { task_type: 'pep_screening', task_description: 'PEP and sanctions screening', is_required: true, order_index: 4 },
  { task_type: 'kyb_review', task_description: 'Review and verify KYB documents', is_required: true, order_index: 5 },
  { task_type: 'business_registration', task_description: 'Confirm business registration', is_required: true, order_index: 6 },
  { task_type: 'business_address', task_description: 'Verify business address', is_required: true, order_index: 7 },
  { task_type: 'ubo_records', task_description: 'Review UBO records (complete and accurate)', is_required: true, order_index: 8 },
  { task_type: 'ubo_ownership', task_description: 'Verify total UBO ownership equals or exceeds 75%', is_required: true, order_index: 9 },
  { task_type: 'ubo_documents', task_description: 'Confirm all UBO documents uploaded and verified', is_required: true, order_index: 10 },
  { task_type: 'background_check', task_description: 'Review background checks for adverse findings', is_required: false, order_index: 11 },
  { task_type: 'regulatory_compliance', task_description: 'Confirm regulatory compliance', is_required: false, order_index: 12 },
];

export default function TaskChecklist({ applicationId }: TaskChecklistProps) {
  const { employee } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrCreateTasks();
  }, [applicationId]);

  const loadOrCreateTasks = async () => {
    try {
      const { data: existingTasks, error } = await supabase
        .from('underwriting_tasks')
        .select('*')
        .eq('application_id', applicationId)
        .order('order_index');

      if (error) throw error;

      if (existingTasks && existingTasks.length > 0) {
        setTasks(existingTasks);
      } else {
        const newTasks = DEFAULT_TASKS.map(task => ({
          application_id: applicationId,
          ...task
        }));

        const { data: createdTasks, error: insertError } = await supabase
          .from('underwriting_tasks')
          .insert(newTasks)
          .select();

        if (insertError) throw insertError;
        setTasks(createdTasks || []);
      }
    } catch (err) {
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('underwriting_tasks')
        .update({
          is_completed: !currentStatus,
          completed_at: !currentStatus ? new Date().toISOString() : null,
          completed_by: !currentStatus ? employee?.id : null
        })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev =>
        prev.map(task =>
          task.id === taskId
            ? {
                ...task,
                is_completed: !currentStatus,
                completed_at: !currentStatus ? new Date().toISOString() : null
              }
            : task
        )
      );
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const completedCount = tasks.filter(t => t.is_completed).length;
  const requiredCount = tasks.filter(t => t.is_required).length;
  const completedRequired = tasks.filter(t => t.is_required && t.is_completed).length;
  const completionPercentage = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;
  const allRequiredCompleted = completedRequired === requiredCount;

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="text-center text-slate-600">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900">Approval Checklist</h3>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">{completionPercentage.toFixed(0)}%</p>
          <p className="text-xs text-slate-600">
            {completedCount} of {tasks.length} completed
          </p>
        </div>
      </div>

      <div className="w-full bg-slate-200 rounded-full h-2.5 mb-4">
        <div
          className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>

      {!allRequiredCompleted && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-medium">Required tasks pending</p>
            <p className="text-xs text-amber-700">
              {completedRequired} of {requiredCount} required tasks completed
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className={`p-3 rounded-lg border transition-all ${
              task.is_completed
                ? 'bg-green-50 border-green-200'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <label className="flex items-start space-x-3 cursor-pointer">
              <div className="flex-shrink-0 mt-0.5">
                {task.is_completed ? (
                  <CheckCircle
                    className="w-5 h-5 text-green-600 cursor-pointer"
                    onClick={() => toggleTask(task.id, task.is_completed)}
                  />
                ) : (
                  <Circle
                    className="w-5 h-5 text-slate-400 cursor-pointer hover:text-blue-500"
                    onClick={() => toggleTask(task.id, task.is_completed)}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <span
                    className={`text-sm font-medium ${
                      task.is_completed ? 'text-slate-500 line-through' : 'text-slate-900'
                    }`}
                  >
                    {task.task_description}
                  </span>
                  {task.is_required && !task.is_completed && (
                    <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded flex-shrink-0">
                      Required
                    </span>
                  )}
                </div>
                {task.due_date && (
                  <div className="flex items-center space-x-1 mt-1 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </label>
          </div>
        ))}
      </div>

      {allRequiredCompleted && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span className="text-sm font-medium text-green-800">
            All required tasks completed! Application ready for approval.
          </span>
        </div>
      )}
    </div>
  );
}
