import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, NativeSelectRoot, NativeSelectField, Stack, Textarea } from '@chakra-ui/react';
import { Field } from '@chakra-ui/react/field';
import { wizardStep2Schema, type WizardStep2FormData } from './schema';
import { EMPLOYMENT_TYPES } from '../../../types';
import styles from './styles.module.css';

interface WizardStep2Props {
  onBack: () => void;
  onSubmit: (data: WizardStep2FormData) => void;
  defaultValues?: Partial<WizardStep2FormData>;
}

export default function WizardStep2({ onBack, onSubmit, defaultValues }: WizardStep2Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<WizardStep2FormData>({
    resolver: zodResolver(wizardStep2Schema),
    mode: 'onChange',
    defaultValues: defaultValues || {
      photo: '',
      employmentType: '',
      officeLocation: '',
      notes: '',
    },
  });

  const handleFormSubmit = (data: WizardStep2FormData) => {
    onSubmit(data);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Step 2: Details & Submit</h2>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Stack gap={4}>
          <Field.Root invalid={!!errors.photo}>
            <Field.Label>Photo</Field.Label>
            <Input
              type="file"
              accept="image/*"
              placeholder="Upload photo"
            />
            {errors.photo && <Field.ErrorText>{errors.photo.message}</Field.ErrorText>}
          </Field.Root>

          <Field.Root invalid={!!errors.employmentType} required>
            <Field.Label>Employment Type</Field.Label>
            <NativeSelectRoot>
              <NativeSelectField {...register('employmentType')}>
                <option value="">Select employment type</option>
                {EMPLOYMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>
            {errors.employmentType && <Field.ErrorText>{errors.employmentType.message}</Field.ErrorText>}
          </Field.Root>

          <Field.Root invalid={!!errors.officeLocation} required>
            <Field.Label>Office Location</Field.Label>
            <Input
              placeholder="TODO: Autocomplete"
              {...register('officeLocation')}
            />
            {errors.officeLocation && <Field.ErrorText>{errors.officeLocation.message}</Field.ErrorText>}
          </Field.Root>

          <Field.Root invalid={!!errors.notes}>
            <Field.Label>Notes</Field.Label>
            <Textarea
              placeholder="Additional notes (optional)"
              rows={4}
              {...register('notes')}
            />
            {errors.notes && <Field.ErrorText>{errors.notes.message}</Field.ErrorText>}
          </Field.Root>

          <div className={styles.actions}>
            <Button onClick={onBack} colorPalette="gray">
              Back
            </Button>
            <Button type="submit" colorPalette="blue" disabled={!isValid}>
              Submit
            </Button>
          </div>
        </Stack>
      </form>
    </div>
  );
}
