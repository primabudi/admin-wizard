import { useState } from 'react';
import WizardStep1 from '../../components/wizard/WizardStep1';
import WizardStep2 from '../../components/wizard/WizardStep2';
import type { WizardStep1FormData } from '../../components/wizard/WizardStep1/schema';
import type { WizardStep2FormData } from '../../components/wizard/WizardStep2/schema';
import { useRole } from '../../hooks/useRole';

export default function Wizard() {
  const role = useRole();
  // Admin starts at step 1, Ops starts at step 2
  const [currentStep, setCurrentStep] = useState<1 | 2>(role === 'admin' ? 1 : 2);
  const [step1Data, setStep1Data] = useState<WizardStep1FormData | null>(null);
  const [step2Data, setStep2Data] = useState<WizardStep2FormData | null>(null);

  const handleStep1Next = (data: WizardStep1FormData) => {
    setStep1Data(data);
    setCurrentStep(2);
    console.log('Step 1 data:', data);
  };

  const handleStep2Back = () => {
    // Only allow back navigation for admin users
    if (role === 'admin') {
      setCurrentStep(1);
    }
  };

  const handleStep2Submit = (data: WizardStep2FormData) => {
    setStep2Data(data);
    console.log('Submitting wizard with:', { step1Data, step2Data: data });
  };

  return (
    <div>
      {/* Only show Step 1 for Admin role */}
      {role === 'admin' && currentStep === 1 && (
        <WizardStep1 onNext={handleStep1Next} defaultValues={step1Data || undefined} />
      )}
      {currentStep === 2 && (
        <WizardStep2
          onBack={handleStep2Back}
          onSubmit={handleStep2Submit}
          defaultValues={step2Data || undefined}
          showBackButton={role === 'admin'}
        />
      )}
    </div>
  );
}