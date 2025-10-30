import { useState } from 'react';
import type { WizardStep1FormData } from '../components/wizard/WizardStep1/schema';
import type { WizardStep2FormData } from '../components/wizard/WizardStep2/schema';
import { basicInfoApi, detailsApi } from '../services/api';
import type { BasicInfo, Details } from '../types';

export type SubmitState = 'idle' | 'submitting_basic' | 'submitting_details' | 'success' | 'error';

interface UseWizardSubmitReturn {
  state: SubmitState;
  error: string | null;
  submit: (step1Data: WizardStep1FormData, step2Data: WizardStep2FormData) => Promise<void>;
}

export function useWizardSubmit(): UseWizardSubmitReturn {
  const [state, setState] = useState<SubmitState>('idle');
  const [error, setError] = useState<string | null>(null);

  const submit = async (step1Data: WizardStep1FormData, step2Data: WizardStep2FormData) => {
    try {
      setState('submitting_basic');
      setError(null);

      // Step 1: POST to /basicInfo (port 4001)
      const basicInfo: BasicInfo = {
        fullName: step1Data.fullName,
        email: step1Data.email,
        department: step1Data.department,
        role: step1Data.role,
        employeeId: step1Data.employeeId,
      };

      const basicInfoResponse = await basicInfoApi.create(basicInfo);
      console.log('BasicInfo saved:', basicInfoResponse);

      // Step 2: POST to /details (port 4002)
      setState('submitting_details');

      const details: Details = {
        email: step1Data.email,
        employeeId: step1Data.employeeId,
        photo: step2Data.photo,
        employmentType: step2Data.employmentType,
        officeLocation: step2Data.officeLocation,
        notes: step2Data.notes,
      };

      const detailsResponse = await detailsApi.create(details);
      console.log('Details saved:', detailsResponse);

      // Success!
      setState('success');
    } catch (err) {
      console.error('Submission failed:', err);
      setError(err instanceof Error ? err.message : 'Submission failed');
      setState('error');
    }
  };

  return { state, error, submit };
}
