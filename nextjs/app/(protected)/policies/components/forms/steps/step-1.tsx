/**
 * Policy form step 1 - Basic information
 */

import { useMemo } from 'react';
import { z } from 'zod';
import useTranslation from '@/hooks/useTranslation';
import { DynamicForm } from '@/components/form/dynamic-form';
import { PolicyStep1Data, PolicyStepProps } from '../../../types';
import { POLICY_TYPE_OPTIONS } from '../../../utils';


// Schema factory that creates validation schema with translated messages
// This schema ensures type compatibility with PolicyStep1Data interface
const createSchema = (t: (key: string) => string) =>
  z.object({
    policyName: z
      .string({
        required_error: t(
          'policies.create_policy.validation.policyName.required',
        ),
        invalid_type_error: t(
          'policies.create_policy.validation.common.invalid_type',
        ),
      })
      .min(2, t('policies.create_policy.validation.policyName.min')),
    policyType: z.enum(['vida', 'salud', 'vehiculo', 'mascota'], {
      errorMap: () => ({ message: 'policies.create_policy.validation.policyType.invalid' }),
    }),
    description: z.string().optional(),
    basePrice: z
      .number({
        required_error: t(
          'policies.create_policy.validation.basePrice.required',
        ),
        invalid_type_error: t(
          'policies.create_policy.validation.basePrice.invalid_type',
        ),
      })
      .nonnegative(
        t('policies.create_policy.validation.basePrice.nonnegative'),
      ),
    validFrom: z.date().optional(),
    isActive: z.boolean().default(true),
  });

// Type for the step props with explicit typing for PolicyStep1Data
interface Step1Props extends Omit<PolicyStepProps, 'onSubmit' | 'defaultValues'> {
  onSubmit: (values: PolicyStep1Data) => void;
  defaultValues?: Partial<PolicyStep1Data>;
}

/**
 * First step of the policy form - collects basic policy information
 * Uses PolicyStep1Data interface for type safety
 * @param props - Component props
 */
export function CreatePolicyStep1({
  onSubmit,
  defaultValues,
}: Step1Props) {
  const { t } = useTranslation('forms');
  
  // Create schema with translated messages that matches PolicyStep1Data interface
  const schema = useMemo(() => createSchema(t), [t]);

  return (
    <DynamicForm
      title={t(
        'policies.create_policy.form_steps.step_placeholders.basic_info',
      )}
      submitLabel={t('policies.create_policy.buttons.continue')}
      schema={schema}
      defaultValues={defaultValues}
      fields={[
        {
          type: 'text',
          name: 'policyName',
          label: t('policies.create_policy.form_fields.policyName'),
          placeholder: 'Ej: Seguro de vida familiar',
        },
        {
          type: 'select',
          name: 'policyType',
          label: t('policies.create_policy.form_fields.policyType'),
          options: POLICY_TYPE_OPTIONS.map(option => ({
            label: t(`policies.create_policy.form_options.policyTypes.${option.value}`),
            value: option.value,
          })),
        },
        {
          type: 'textarea',
          name: 'description',
          label: t('policies.create_policy.form_fields.description'),
          placeholder:
            'Describe las características principales de la póliza...',
        },
        {
          type: 'number',
          name: 'basePrice',
          label: t('policies.create_policy.form_fields.basePrice'),
          placeholder: '0.00',
        },
        {
          type: 'date',
          name: 'validFrom',
          label: t('policies.create_policy.form_fields.validFrom'),
        },
        {
          type: 'switch',
          name: 'isActive',
          label: t('policies.create_policy.form_fields.isActive'),
        },
      ]}
      onSubmit={(values) => onSubmit(values as PolicyStep1Data)}
    />
  );
}