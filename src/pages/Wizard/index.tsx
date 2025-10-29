import { useState } from 'react';
import WizardStep1 from '../../components/wizard/WizardStep1';
import WizardStep2 from '../../components/wizard/WizardStep2';
import type { WizardStep1FormData } from '../../components/wizard/WizardStep1/schema';

export default function Wizard() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [step1Data, setStep1Data] = useState<WizardStep1FormData | null>(null);

  const handleStep1Next = (data: WizardStep1FormData) => {
    setStep1Data(data);
    setCurrentStep(2);
    console.log('Step 1 data:', data);
  };

  const handleStep2Back = () => {
    setCurrentStep(1);
  };

  const handleStep2Submit = () => {
    console.log('Submitting wizard with:', { step1Data });
  };

  return (
    <div>
      {currentStep === 1 && (
        <WizardStep1 onNext={handleStep1Next} defaultValues={step1Data || undefined} />
      )}
      {currentStep === 2 && (
        <WizardStep2 onBack={handleStep2Back} onSubmit={handleStep2Submit} />
      )}
    </div>
  );
}