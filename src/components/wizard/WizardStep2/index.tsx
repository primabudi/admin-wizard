import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import { Button, Input, NativeSelectRoot, NativeSelectField, Stack, Textarea } from '@chakra-ui/react';
import { Field } from '@chakra-ui/react/field';
import { wizardStep2Schema, type WizardStep2FormData } from './schema';
import { EMPLOYMENT_TYPES } from '../../../types';
import { fileToBase64, validateImageFile } from '../../../utils/fileToBase64';
import { locationApi } from '../../../services/api';
import { useDebounce } from '../../../hooks/useDebounce';
import styles from './styles.module.css';

interface WizardStep2Props {
  onBack: () => void;
  onSubmit: (data: WizardStep2FormData) => void;
  defaultValues?: Partial<WizardStep2FormData>;
  showBackButton?: boolean;
  onChange?: (data: WizardStep2FormData) => void;
}

export default function WizardStep2({ onBack, onSubmit, defaultValues, showBackButton = true, onChange }: WizardStep2Props) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
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

  const [photoPreview, setPhotoPreview] = useState<string | null>(defaultValues?.photo || null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const formValues = watch();

  const isFormFilled = formValues.employmentType && formValues.officeLocation;

  // Notify parent of form changes for auto-save using watch subscription
  useEffect(() => {
    if (!onChange) return;

    const subscription = watch((formData) => {
      onChange(formData as WizardStep2FormData);
    });

    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setPhotoError(validationError);
      return;
    }

    try {
      setPhotoError(null);
      const base64 = await fileToBase64(file);
      setPhotoPreview(base64);
      setValue('photo', base64);
    } catch (error) {
      setPhotoError('Failed to upload image');
      console.error('Failed to convert image to Base64:', error);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setValue('photo', '');
  };

  const loadLocationOptions = useDebounce(async (inputValue: string) => {
    if (!inputValue) return [];
    try {
      const locations = await locationApi.getLocations(inputValue);
      return locations.map((location) => ({
        label: location.name,
        value: location.name,
      }));
    } catch {
      return [];
    }
  }, 300);

  const handleFormSubmit = (data: WizardStep2FormData) => {
    onSubmit(data);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Step 2: Details & Submit</h2>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Stack gap={4}>
          <Field.Root invalid={!!errors.photo || !!photoError}>
            <Field.Label>Photo</Field.Label>
            {photoPreview ? (
              <div className={styles.photoPreview}>
                <img src={photoPreview} alt="Preview" className={styles.previewImage} />
                <Button onClick={handleRemovePhoto} colorPalette="red" size="sm" className={styles.removeButton}>
                  Remove
                </Button>
              </div>
            ) : (
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            )}
            {errors.photo && <Field.ErrorText>{errors.photo.message}</Field.ErrorText>}
            {photoError && <Field.ErrorText>{photoError}</Field.ErrorText>}
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
            <Controller
              name="officeLocation"
              control={control}
              render={({ field }) => (
                <AsyncSelect
                  cacheOptions
                  loadOptions={loadLocationOptions}
                  value={field.value ? { label: field.value, value: field.value } : null}
                  onChange={(option) => field.onChange(option?.value || '')}
                  onBlur={field.onBlur}
                  placeholder="Search location..."
                  isClearable
                />
              )}
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
            {showBackButton && (
              <Button onClick={onBack} colorPalette="gray">
                Back
              </Button>
            )}
            <Button type="submit" colorPalette="blue" disabled={!isFormFilled}>
              Submit
            </Button>
          </div>
        </Stack>
      </form>
    </div>
  );
}
