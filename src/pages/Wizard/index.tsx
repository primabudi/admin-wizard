import { useState } from 'react';
import WizardStep1 from '../../components/wizard/WizardStep1';
import type { WizardStep1FormData } from '../../components/wizard/WizardStep1/schema';

export default function Wizard() {
  const [step1Data, setStep1Data] = useState<WizardStep1FormData | null>(null);

  const handleStep1Next = (data: WizardStep1FormData) => {
    setStep1Data(data);
    console.log('Step 1 data:', data);
  };

  return (
    <div>
      <WizardStep1 onNext={handleStep1Next} defaultValues={step1Data || undefined} />
    </div>
  );
}