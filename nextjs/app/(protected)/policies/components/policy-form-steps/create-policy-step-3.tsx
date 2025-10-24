import { z } from 'zod';
import useTranslation from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { DynamicForm } from '@/components/form/dynamic-form';

const Schema = z.object({
  coverageLevel: z.enum(['basic', 'premium', 'total']),
  addons: z.array(z.string()).optional(),
  deductible: z.number().optional(),
  notes: z.string().optional(),
});

export type PolicyStep3Data = z.infer<typeof Schema>;

export function CreatePolicyStep3({
  onSubmit,
  onPrevious,
  defaultValues,
  isLoading = false,
  isEditMode = false,
}: {
  onSubmit: (values: any) => void;
  onPrevious: () => void;
  defaultValues?: any;
  isLoading?: boolean;
  isEditMode?: boolean;
}) {
  const { t } = useTranslation('forms');

  return (
    <div className="space-y-6">
      <DynamicForm
        title={t(
          'policies.create_policy.form_steps.step_placeholders.coverages_conditions',
        )}
        submitLabel={
          isLoading
            ? isEditMode
              ? 'Actualizando póliza...'
              : t('policies.create_policy.buttons.creating_policy')
            : isEditMode
              ? 'Editar póliza'
              : t('policies.create_policy.buttons.create_policy')
        }
        schema={Schema}
        defaultValues={defaultValues}
        disabled={isLoading}
        fields={[
          {
            type: 'select',
            name: 'coverageLevel',
            label: t('policies.create_policy.form_fields.coverageLevel'),
            options: [
              {
                label: t(
                  'policies.create_policy.form_options.coverageLevels.basic',
                ),
                value: 'basic',
              },
              {
                label: t(
                  'policies.create_policy.form_options.coverageLevels.premium',
                ),
                value: 'premium',
              },
              {
                label: t(
                  'policies.create_policy.form_options.coverageLevels.total',
                ),
                value: 'total',
              },
            ],
          },
          {
            type: 'custom',
            name: 'addons',
            label: t('policies.create_policy.form_fields.addons'),
            render: (value, onChange) => (
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  'Asistencia legal',
                  'Cobertura internacional',
                  'Atención domiciliaria',
                ].map((label) => {
                  const selected = Array.isArray(value)
                    ? value.includes(label)
                    : false;
                  return (
                    <Button
                      key={label}
                      type="button"
                      variant={selected ? 'primary' : 'outline'}
                      onClick={() => {
                        const next = new Set(Array.isArray(value) ? value : []);
                        selected ? next.delete(label) : next.add(label);
                        onChange(Array.from(next));
                      }}
                    >
                      {label}
                    </Button>
                  );
                })}
              </div>
            ),
          },
          {
            type: 'number',
            name: 'deductible',
            label: t('policies.create_policy.form_fields.deductible'),
            placeholder: '0.00',
          },
          {
            type: 'textarea',
            name: 'notes',
            label: t('policies.create_policy.form_fields.notes'),
            placeholder: 'Comentarios adicionales sobre la póliza...',
          },
        ]}
        onSubmit={onSubmit}
      />
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={isLoading}
        >
          {t('policies.create_policy.buttons.previous')}
        </Button>
      </div>
    </div>
  );
}
