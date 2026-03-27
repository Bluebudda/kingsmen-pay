import { useState, useEffect } from 'react';
import { FileCheck, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import KYCVerification from './KYCVerification';
import KYBVerification from './KYBVerification';
import UBOManagement from './UBOManagement';
import UnderwritingReview from './UnderwritingReview';

interface Application {
  id: string;
  business_name: string;
  contact_name: string;
  email: string;
  status: string;
}

interface UnderwritingWorkflowProps {
  applicationId: string;
  onBack: () => void;
}

export default function UnderwritingWorkflow({ applicationId, onBack }: UnderwritingWorkflowProps) {
  const [application, setApplication] = useState<Application | null>(null);
  const [activeStep, setActiveStep] = useState<'kyc' | 'kyb' | 'ubo' | 'review'>('kyc');
  const [kycId, setKycId] = useState<string | null>(null);
  const [kybId, setKybId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplication();
    checkExistingData();
  }, [applicationId]);

  const loadApplication = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .single();

      if (error) throw error;
      setApplication(data);
    } catch (err) {
      console.error('Error loading application:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkExistingData = async () => {
    try {
      const { data: kycData } = await supabase
        .from('kyc_verifications')
        .select('id, status')
        .eq('application_id', applicationId)
        .maybeSingle();

      if (kycData) {
        setKycId(kycData.id);
        if (kycData.status === 'submitted' || kycData.status === 'approved') {
          setActiveStep('kyb');
        }
      }

      const { data: kybData } = await supabase
        .from('kyb_verifications')
        .select('id, status')
        .eq('application_id', applicationId)
        .maybeSingle();

      if (kybData) {
        setKybId(kybData.id);
        if (kybData.status === 'submitted' || kybData.status === 'approved') {
          setActiveStep('ubo');
        }
      }

      if (kycData?.status === 'submitted' && kybData?.status === 'submitted') {
        const { data: uboData } = await supabase
          .from('ubo_records')
          .select('id')
          .eq('kyb_verification_id', kybData.id);

        if (uboData && uboData.length > 0) {
          setActiveStep('review');
        }
      }
    } catch (err) {
      console.error('Error checking existing data:', err);
    }
  };

  const steps = [
    { key: 'kyc', label: 'KYC Verification', description: 'Customer Identity' },
    { key: 'kyb', label: 'KYB Verification', description: 'Business Entity' },
    { key: 'ubo', label: 'UBO Records', description: 'Beneficial Owners' },
    { key: 'review', label: 'Final Review', description: 'Assessment & Decision' },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === activeStep);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading application...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Application not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Applications</span>
          </button>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Underwriting Workflow</h1>
                <p className="text-slate-600">{application.business_name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {steps.map((step, index) => (
                <div key={step.key} className="flex items-center flex-1">
                  <button
                    onClick={() => setActiveStep(step.key as any)}
                    className={`flex-1 ${
                      index === currentStepIndex
                        ? 'bg-blue-100 border-blue-500 text-blue-900'
                        : index < currentStepIndex
                        ? 'bg-green-50 border-green-500 text-green-900'
                        : 'bg-slate-50 border-slate-300 text-slate-600'
                    } border-2 rounded-lg p-4 text-left transition-all hover:shadow-md`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === currentStepIndex
                            ? 'bg-blue-500 text-white'
                            : index < currentStepIndex
                            ? 'bg-green-500 text-white'
                            : 'bg-slate-300 text-slate-600'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{step.label}</p>
                        <p className="text-xs opacity-75">{step.description}</p>
                      </div>
                    </div>
                  </button>
                  {index < steps.length - 1 && (
                    <div className="w-8 h-0.5 bg-slate-300 mx-2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          {activeStep === 'kyc' && (
            <KYCVerification
              applicationId={applicationId}
              onComplete={() => {
                setActiveStep('kyb');
                checkExistingData();
              }}
            />
          )}

          {activeStep === 'kyb' && (
            <KYBVerification
              applicationId={applicationId}
              onComplete={() => {
                setActiveStep('ubo');
                checkExistingData();
              }}
            />
          )}

          {activeStep === 'ubo' && kybId && (
            <div className="space-y-6">
              <UBOManagement kybVerificationId={kybId} />
              <div className="flex justify-end">
                <button
                  onClick={() => setActiveStep('review')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  Proceed to Final Review
                </button>
              </div>
            </div>
          )}

          {activeStep === 'review' && (
            <UnderwritingReview
              applicationId={applicationId}
              kycVerificationId={kycId}
              kybVerificationId={kybId}
              onComplete={onBack}
            />
          )}
        </div>
      </div>
    </div>
  );
}
