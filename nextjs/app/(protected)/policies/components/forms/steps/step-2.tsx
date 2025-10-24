/**
 * Policy form step 2 - Insured person data
 */

import { useMemo } from 'react';
import { z } from 'zod';
import useTranslation from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { DynamicForm } from '@/components/form/dynamic-form';
import { PolicyStep2Data, PolicyStepProps } from '../../../types';
import { COUNTRY_OPTIONS } from '../../../utils';


// Schema factory that creates validation schema with translated messages
// This schema ensures type compatibility with PolicyStep2Data interface
const createSchema = (t: (key: string) => string) =>
  z.object({
    firstName: z
      .string({
        required_error: t(
          'policies.create_policy.validation.firstName.required',
        ),
        invalid_type_error: t(
          'policies.create_policy.validation.common.invalid_type',
        ),
      })
      .min(2, t('policies.create_policy.validation.firstName.min')),
    lastName: z
      .string({
        required_error: t(
          'policies.create_policy.validation.lastName.required',
        ),
        invalid_type_error: t(
          'policies.create_policy.validation.common.invalid_type',
        ),
      })
      .min(2, t('policies.create_policy.validation.lastName.min')),
    email: z
      .string({
        required_error: t('policies.create_policy.validation.email.required'),
        invalid_type_error: t(
          'policies.create_policy.validation.common.invalid_type',
        ),
      })
      .email(t('policies.create_policy.validation.email.invalid')),
    phone: z.string().optional(),
    birthDate: z.date().optional(),
    country: z
      .enum(['UY', 'CL', 'AR'], {
        errorMap: () => ({
          message: 'policies.create_policy.validation.country.invalid',
        }),
      })
      .optional(),
  });

// Type for the step props with explicit typing for PolicyStep2Data
interface Step2Props extends Omit<PolicyStepProps, 'onSubmit' | 'defaultValues'> {
  onSubmit: (values: PolicyStep2Data) => void;
  defaultValues?: Partial<PolicyStep2Data>;
  onPrevious?: () => void;
}

/**
 * Second step of the policy form - collects insured person information
 * Uses PolicyStep2Data interface for type safety
 * @param props - Component props
 */
export function CreatePolicyStep2({
  onSubmit,
  onPrevious,
  defaultValues,
}: Step2Props) {
  const { t } = useTranslation('forms');
  
  // Create schema with translated messages that matches PolicyStep2Data interface
  const schema = useMemo(() => createSchema(t), [t]);

  return (
    <div className="space-y-6">
      <DynamicForm
        title={t(
          'policies.create_policy.form_steps.step_placeholders.insured_data',
        )}
        submitLabel={t('policies.create_policy.buttons.continue')}
        schema={schema}
        defaultValues={defaultValues}
        fields={[
          {
            type: 'text',
            name: 'firstName',
            label: t('policies.create_policy.form_fields.firstName'),
            placeholder: 'Ej: Juan',
          },
          {
            type: 'text',
            name: 'lastName',
            label: t('policies.create_policy.form_fields.lastName'),
            placeholder: 'Ej: Pérez',
          },
          {
            type: 'email',
            name: 'email',
            label: t('policies.create_policy.form_fields.email'),
            placeholder: 'juan.perez@email.com',
          },
          {
            type: 'phone',
            name: 'phone',
            label: t('policies.create_policy.form_fields.phone'),
            placeholder: '+598 99 123 456',
          },
          {
            type: 'date',
            name: 'birthDate',
            label: t('policies.create_policy.form_fields.birthDate'),
          },
          {
            type: 'select',
            name: 'country',
            label: t('policies.create_policy.form_fields.country'),
            options: COUNTRY_OPTIONS.map(option => ({
              label: t(`policies.create_policy.form_options.countries.${option.value}`),
              value: option.value,
            })),
          },
        ]}
        onSubmit={(values) => onSubmit(values as PolicyStep2Data)}
      />
      
      {/* Previous step button */}
      <div className="flex justify-start">
        <Button type="button" variant="outline" onClick={onPrevious}>
          {t('policies.create_policy.buttons.previous')}
        </Button>
      </div>
    </div>
  );
}