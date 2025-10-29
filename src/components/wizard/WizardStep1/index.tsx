import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AsyncSelect from 'react-select/async';
import { Button, Input, NativeSelectRoot, NativeSelectField, Stack } from '@chakra-ui/react';
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
}

export default function WizardStep1({ onNext, defaultValues }: WizardStep1Props) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
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
            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <AsyncSelect
                  cacheOptions
                  loadOptions={loadDepartmentOptions}
                  value={field.value ? { label: field.value, value: field.value } : null}
                  onChange={(option) => field.onChange(option?.value || '')}
                  onBlur={field.onBlur}
                  placeholder="Search department..."
                  isClearable
                />
              )}
            />
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

          <Field.Root invalid={!!errors.employeeId} required>
            <Field.Label>Employee ID</Field.Label>
            <Input
              {...register('employeeId')}
              disabled
            />
            {errors.employeeId && <Field.ErrorText>{errors.employeeId.message}</Field.ErrorText>}
          </Field.Root>

          <div className={styles.actions}>
            <Button type="submit" colorPalette="blue" disabled={!isValid}>
              Next
            </Button>
          </div>
        </Stack>
      </form>
    </div>
  );
}