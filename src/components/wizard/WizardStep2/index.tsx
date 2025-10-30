import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import { Button, Input, NativeSelectRoot, NativeSelectField, Textarea } from '@chakra-ui/react';
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
  isSubmitting?: boolean;
}

export default function WizardStep2({ onBack, onSubmit, defaultValues, showBackButton = true, onChange, isSubmitting = false }: WizardStep2Props) {
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
      <h2 className={styles.title} data-testid="step2-title">Step 2: Details & Submit</h2>

      <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form} data-testid="step2-form">
          <Field.Root invalid={!!errors.photo || !!photoError} disabled={isSubmitting}>
            <Field.Label>Photo</Field.Label>
            {photoPreview ? (
              <div className={styles.photoPreview}>
                <img src={photoPreview} alt="Preview" className={styles.previewImage} />
                <Button onClick={handleRemovePhoto} colorPalette="red" size="sm" className={styles.removeButton} disabled={isSubmitting}>
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

          <Field.Root invalid={!!errors.employmentType} required disabled={isSubmitting}>
            <Field.Label>Employment Type</Field.Label>
            <NativeSelectRoot>
              <NativeSelectField {...register('employmentType')} data-testid="employmentType-select">
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

          <Field.Root invalid={!!errors.officeLocation} required disabled={isSubmitting}>
            <Field.Label>Office Location</Field.Label>
            <Controller
              name="officeLocation"
              control={control}
              render={({ field }) => (
                <div data-testid="location-select">
                  <AsyncSelect
                    cacheOptions
                    loadOptions={loadLocationOptions}
                    value={field.value ? { label: field.value, value: field.value } : null}
                    onChange={(option) => field.onChange(option?.value || '')}
                    onBlur={field.onBlur}
                    placeholder="Search location..."
                    isClearable
                    isDisabled={isSubmitting}
                    classNamePrefix="location"
                  />
                </div>
              )}
            />
            {errors.officeLocation && <Field.ErrorText>{errors.officeLocation.message}</Field.ErrorText>}
          </Field.Root>

          <Field.Root invalid={!!errors.notes} disabled={isSubmitting}>
            <Field.Label>Notes</Field.Label>
            <Textarea
              placeholder="Additional notes (optional)"
              rows={4}
              {...register('notes')}
              data-testid="notes-textarea"
            />
            {errors.notes && <Field.ErrorText>{errors.notes.message}</Field.ErrorText>}
          </Field.Root>

          <div className={styles.actions}>
            {showBackButton && (
              <Button onClick={onBack} colorPalette="gray" disabled={isSubmitting} data-testid="back-button">
                Back
              </Button>
            )}
            <Button type="submit" colorPalette="blue" disabled={!isFormFilled || isSubmitting} loading={isSubmitting} data-testid="submit-button">
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
      </form>
    </div>
  );
}
