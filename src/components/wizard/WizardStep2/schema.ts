import { z } from 'zod';

export const wizardStep2Schema = z.object({
  photo: z.string().optional(),
  employmentType: z.string().min(1, 'Employment type is required'),
  officeLocation: z.string().min(1, 'Office location is required'),
  notes: z.string().optional(),
});

export type WizardStep2FormData = z.infer<typeof wizardStep2Schema>;
