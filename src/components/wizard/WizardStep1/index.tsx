import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import { Button, Input, NativeSelectRoot, NativeSelectField } from '@chakra-ui/react';
import { Field } from '@chakra-ui/react/field';
import { wizardStep1Schema, type WizardStep1FormData } from './schema';
import { ROLES } from '../../../types';
import { departmentApi } from '../../../services/api';
import { useDebounce } from '../../../hooks/useDebounce';
import { useEmployeeId } from '../../../hooks/useEmployeeId';
import styles from './styles.module.css';

interface WizardStep1Props {
  onNext: (data: WizardStep1FormData) => void;
  defaultValues?: Partial<WizardStep1FormData>;
  onChange?: (data: WizardStep1FormData) => void;
}

export default function WizardStep1({ onNext, defaultValues, onChange }: WizardStep1Props) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WizardStep1FormData>({
    resolver: zodResolver(wizardStep1Schema),
    mode: 'onChange',
    defaultValues: defaultValues || {
      fullName: '',
      email: '',
      department: '',
      role: '',
      employeeId: '',
    },
  });

  const department = watch('department');
  const formValues = watch();

  const isFormFilled = formValues.fullName && formValues.email && formValues.department && formValues.role && formValues.employeeId;

  // Notify parent of form changes for auto-save using watch subscription
  useEffect(() => {
    if (!onChange) return;

    const subscription = watch((formData) => {
      onChange(formData as WizardStep1FormData);
    });

    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  // Auto-generate employee ID when department changes
  useEmployeeId({
    department,
    onIdGenerated: (employeeId) => setValue('employeeId', employeeId),
  });

  const onSubmit = (data: WizardStep1FormData) => {
    onNext(data);
  };

  const loadDepartmentOptions = useDebounce(async (inputValue: string) => {
    if (!inputValue) return [];
    try {
      const departments = await departmentApi.getDepartments(inputValue);
      return departments.map((dept) => ({
        label: dept.name,
        value: dept.name,
      }));
    } catch {
      return [];
    }
  }, 300);

  return (
    <div className={styles.container}>
      <h2 className={styles.title} data-testid="step1-title">Step 1: Basic Information</h2>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form} data-testid="step1-form">
          <Field.Root invalid={!!errors.fullName} required>
            <Field.Label>Full Name</Field.Label>
            <Input {...register('fullName')} data-testid="fullName-input" />
            {errors.fullName && <Field.ErrorText>{errors.fullName.message}</Field.ErrorText>}
          </Field.Root>

          <Field.Root invalid={!!errors.email} required>
            <Field.Label>Email</Field.Label>
            <Input type="email" {...register('email')} data-testid="email-input" />
            {errors.email && <Field.ErrorText>{errors.email.message}</Field.ErrorText>}
          </Field.Root>

          <Field.Root invalid={!!errors.department} required>
            <Field.Label>Department</Field.Label>
            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <div data-testid="department-select">
                  <AsyncSelect
                    cacheOptions
                    loadOptions={loadDepartmentOptions}
                    value={field.value ? { label: field.value, value: field.value } : null}
                    onChange={(option) => field.onChange(option?.value || '')}
                    onBlur={field.onBlur}
                    placeholder="Search department..."
                    isClearable
                    classNamePrefix="department"
                  />
                </div>
              )}
            />
            {errors.department && <Field.ErrorText>{errors.department.message}</Field.ErrorText>}
          </Field.Root>

          <Field.Root invalid={!!errors.role} required>
            <Field.Label>Role</Field.Label>
            <NativeSelectRoot>
              <NativeSelectField {...register('role')} data-testid="role-select">
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

          <Field.Root invalid={!!errors.employeeId} required>
            <Field.Label>Employee ID</Field.Label>
            <Input
              {...register('employeeId')}
              disabled
              data-testid="employeeId-input"
            />
            {errors.employeeId && <Field.ErrorText>{errors.employeeId.message}</Field.ErrorText>}
          </Field.Root>

          <div className={styles.actions}>
            <Button type="submit" colorPalette="blue" disabled={!isFormFilled} data-testid="next-button">
              Next
            </Button>
          </div>
      </form>
    </div>
  );
}