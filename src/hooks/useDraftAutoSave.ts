import { useEffect, useRef } from 'react';
import type { UserRole } from '../types';
import type { WizardStep1FormData } from '../components/wizard/WizardStep1/schema';
import type { WizardStep2FormData } from '../components/wizard/WizardStep2/schema';

interface DraftData {
  step1Data: WizardStep1FormData | null;
  step2Data: WizardStep2FormData | null;
}

/**
 * Hook to auto-save wizard draft to localStorage
 * Debounces saves by 2 seconds of inactivity
 */
export function useDraftAutoSave(
  role: UserRole,
  step1Data: WizardStep1FormData | null,
  step2Data: WizardStep2FormData | null
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const AUTO_SAVE_DELAY = 2000;

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const draftKey = `draft_${role}`;
      const draftData: DraftData = {
        step1Data,
        step2Data,
      };

      localStorage.setItem(draftKey, JSON.stringify(draftData));
      console.log(`Draft saved to ${draftKey}`);
    }, AUTO_SAVE_DELAY);

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [role, step1Data, step2Data]);
}

/**
 * Load draft data from localStorage
 */
export function loadDraft(role: UserRole): DraftData | null {
  const draftKey = `draft_${role}`;
  const savedDraft = localStorage.getItem(draftKey);

  if (savedDraft) {
    try {
      return JSON.parse(savedDraft) as DraftData;
    } catch (error) {
      console.error('Failed to parse draft data:', error);
      return null;
    }
  }

  return null;
}

/**
 * Clear draft data from localStorage
 */
export function clearDraft(role: UserRole): void {
  const draftKey = `draft_${role}`;
  localStorage.removeItem(draftKey);
  console.log(`Draft cleared from ${draftKey}`);
}
