import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, NativeSelectRoot, NativeSelectField, Stack } from '@chakra-ui/react';
import { Field } from '@chakra-ui/react/field';
import { wizardStep1Schema, type WizardStep1FormData } from './schema';
import { ROLES } from '../../../types';
import styles from './styles.module.css';

interface WizardStep1Props {
  onNext: (data: WizardStep1FormData) => void;
  defaultValues?: Partial<WizardStep1FormData>;
}

export default function WizardStep1({ onNext, defaultValues }: WizardStep1Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WizardStep1FormData>({
    resolver: zodResolver(wizardStep1Schema),
    defaultValues: defaultValues || {
      fullName: '',
      email: '',
      department: '',
      role: '',
    },
  });

  const onSubmit = (data: WizardStep1FormData) => {
    onNext(data);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Step 1: Basic Information</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={4}>
          <Field.Root invalid={!!errors.fullName} required>
            <Field.Label>Full Name</Field.Label>
            <Input {...register('fullName')} />
            {errors.fullName && <Field.ErrorText>{errors.fullName.message}</Field.ErrorText>}
          </Field.Root>

          <Field.Root invalid={!!errors.email} required>
            <Field.Label>Email</Field.Label>
            <Input type="email" {...register('email')} />
            {errors.email && <Field.ErrorText>{errors.email.message}</Field.ErrorText>}
          </Field.Root>

          <Field.Root invalid={!!errors.department} required>
            <Field.Label>Department</Field.Label>
            <Input placeholder="TODO: Autocomplete" {...register('department')} />
            {errors.department && <Field.ErrorText>{errors.department.message}</Field.ErrorText>}
          </Field.Root>

          <Field.Root invalid={!!errors.role} required>
            <Field.Label>Role</Field.Label>
            <NativeSelectRoot>
              <NativeSelectField {...register('role')}>
                <option value="">Select a role</option>
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>
            {errors.role && <Field.ErrorText>{errors.role.message}</Field.ErrorText>}
          </Field.Root>

          <div className={styles.actions}>
            <Button type="submit" colorPalette="blue">
              Next
            </Button>
          </div>
        </Stack>
      </form>
    </div>
  );
}