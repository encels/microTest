import { useForm } from 'react-hook-form';
import { z } from 'zod';
import useTranslation from '@/hooks/useTranslation';
import { DynamicForm } from '@/components/form/dynamic-form';

const Schema = z.object({
  policyName: z
    .string()
    .min(2, 'policies.create_policy.validation.policyName.min'),
  policyType: z.enum(['vida', 'salud', 'vehiculo', 'mascota']),
  description: z.string().optional(),
  basePrice: z
    .number()
    .nonnegative('policies.create_policy.validation.basePrice.nonnegative'),
  validFrom: z.date().optional(),
  isActive: z.boolean().default(true),
});

export type PolicyStep1Data = z.infer<typeof Schema>;

export function CreatePolicyStep1({
  onSubmit,
  defaultValues,
}: {
  onSubmit: (values: any) => void;
  defaultValues?: any;
}) {
  const { t } = useTranslation('forms');

  return (
    <DynamicForm
      title={t(
        'policies.create_policy.form_steps.step_placeholders.basic_info',
      )}
      submitLabel={t('policies.create_policy.buttons.continue')}
      schema={Schema}
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
          options: [
            {
              label: t('policies.create_policy.form_options.policyTypes.vida'),
              value: 'vida',
            },
            {
              label: t('policies.create_policy.form_options.policyTypes.salud'),
              value: 'salud',
            },
            {
              label: t(
                'policies.create_policy.form_options.policyTypes.vehiculo',
              ),
              value: 'vehiculo',
            },
            {
              label: t(
                'policies.create_policy.form_options.policyTypes.mascota',
              ),
              value: 'mascota',
            },
          ],
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
      onSubmit={onSubmit}
    />
  );
}
