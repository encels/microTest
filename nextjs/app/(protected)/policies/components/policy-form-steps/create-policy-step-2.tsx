import { z } from 'zod';
import useTranslation from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { DynamicForm } from '@/components/form/dynamic-form';

const Schema = z.object({
  firstName: z
    .string()
    .min(2, 'policies.create_policy.validation.firstName.min'),
  lastName: z.string().min(2, 'policies.create_policy.validation.lastName.min'),
  email: z.string().email('policies.create_policy.validation.email.invalid'),
  phone: z.string().optional(),
  birthDate: z.date().optional(),
  country: z.enum(['UY', 'CL', 'AR']).optional(),
});

export type PolicyStep2Data = z.infer<typeof Schema>;

export function CreatePolicyStep2({
  onSubmit,
  onPrevious,
  defaultValues,
}: {
  onSubmit: (values: any) => void;
  onPrevious: () => void;
  defaultValues?: any;
}) {
  const { t } = useTranslation('forms');

  return (
    <div className="space-y-6">
      <DynamicForm
        title={t(
          'policies.create_policy.form_steps.step_placeholders.insured_data',
        )}
        submitLabel={t('policies.create_policy.buttons.continue')}
        schema={Schema}
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
            options: [
              {
                label: t('policies.create_policy.form_options.countries.UY'),
                value: 'UY',
              },
              {
                label: t('policies.create_policy.form_options.countries.CL'),
                value: 'CL',
              },
              {
                label: t('policies.create_policy.form_options.countries.AR'),
                value: 'AR',
              },
            ],
          },
        ]}
        onSubmit={onSubmit}
      />
      <div className="flex justify-start">
        <Button type="button" variant="outline" onClick={onPrevious}>
          {t('policies.create_policy.buttons.previous')}
        </Button>
      </div>
    </div>
  );
}
