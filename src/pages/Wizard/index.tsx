import { useState, useCallback } from 'react';
import { Button } from '@chakra-ui/react';
import WizardStep1 from '../../components/wizard/WizardStep1';
import WizardStep2 from '../../components/wizard/WizardStep2';
import type { WizardStep1FormData } from '../../components/wizard/WizardStep1/schema';
import type { WizardStep2FormData } from '../../components/wizard/WizardStep2/schema';
import { useRole } from '../../hooks/useRole';
import { useDraftAutoSave, loadDraft, clearDraft } from '../../hooks/useDraftAutoSave';
import { useWizardSubmit } from '../../hooks/useWizardSubmit';
import styles from './styles.module.css';

export default function Wizard() {
  const role = useRole();
  const { submit } = useWizardSubmit();

  // Admin starts at step 1, Ops starts at step 2
  const [currentStep, setCurrentStep] = useState<1 | 2>(role === 'admin' ? 1 : 2);

  const [step1Data, setStep1Data] = useState<WizardStep1FormData | null>(() => {
    const draft = loadDraft(role);
    return draft?.step1Data || null;
  });

  const [step2Data, setStep2Data] = useState<WizardStep2FormData | null>(() => {
    const draft = loadDraft(role);
    return draft?.step2Data || null;
  });

  useDraftAutoSave(role, step1Data, step2Data);

  const handleStep1Change = useCallback((data: WizardStep1FormData) => {
    setStep1Data(data);
  }, []);

  const handleStep2Change = useCallback((data: WizardStep2FormData) => {
    setStep2Data(data);
  }, []);

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

  const handleStep2Submit = async (data: WizardStep2FormData) => {
    setStep2Data(data);

    if (!step1Data) {
      console.error('Cannot submit: Missing step 1 data');
      return;
    }

    await submit(step1Data, data);
  };

  const handleClearDraft = () => {
    if (window.confirm('Are you sure you want to clear the draft? All unsaved data will be lost.')) {
      clearDraft(role);
      setStep1Data(null);
      setStep2Data(null);
      if (role === 'admin') {
        setCurrentStep(1);
      }
      window.location.reload();
    }
  };


  return (
    <div>
      <div className={styles.clearDraftContainer}>
        <Button onClick={handleClearDraft} colorPalette="red" variant="outline" size="sm">
          Clear Draft
        </Button>
      </div>

      {/* Only show Step 1 for Admin role */}
      {role === 'admin' && currentStep === 1 && (
        <WizardStep1
          onNext={handleStep1Next}
          defaultValues={step1Data || undefined}
          onChange={handleStep1Change}
        />
      )}
      {currentStep === 2 && (
        <WizardStep2
          onBack={handleStep2Back}
          onSubmit={handleStep2Submit}
          defaultValues={step2Data || undefined}
          showBackButton={role === 'admin'}
          onChange={handleStep2Change}
        />
      )}
    </div>
  );
}