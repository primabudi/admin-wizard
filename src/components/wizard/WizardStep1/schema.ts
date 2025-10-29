import { z } from 'zod';

export const wizardStep1Schema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  department: z.string().min(1, 'Department is required'),
  role: z.string().min(1, 'Role is required'),
});

export type WizardStep1FormData = z.infer<typeof wizardStep1Schema>;