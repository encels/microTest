/**
 * Policy form step 3 - Coverages and conditions
 */

import { useMemo } from 'react';
import { z } from 'zod';
import useTranslation from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { DynamicForm } from '@/components/form/dynamic-form';
import { PolicyStep3Data, PolicyStepProps } from '../../../types';
import { AVAILABLE_ADDONS, COVERAGE_LEVEL_OPTIONS } from '../../../utils';

// Schema factory that creates validation schema with translated messages
// This schema ensures type compatibility with PolicyStep3Data interface
const createSchema = (t: (key: string) => string) =>
  z.object({
    coverageLevel: z.enum(['basic', 'premium', 'total'], {
      errorMap: () => ({
        message: 'policies.create_policy.validation.coverageLevel.invalid',
      }),
    }),
    addons: z.array(z.string()).optional(),
    deductible: z
      .number({
        invalid_type_error: t(
          'policies.create_policy.validation.deductible.invalid_type',
        ),
      })
      .nonnegative(
        t('policies.create_policy.validation.deductible.nonnegative'),
      )
      .optional(),
    notes: z.string().optional(),
  });

// Type for the step props with explicit typing for PolicyStep3Data
interface Step3Props
  extends Omit<PolicyStepProps, 'onSubmit' | 'defaultValues'> {
  onSubmit: (values: PolicyStep3Data) => void;
  defaultValues?: Partial<PolicyStep3Data>;
  onPrevious?: () => void;
  isLoading?: boolean;
  isEditMode?: boolean;
}

/**
 * Third step of the policy form - collects coverage and conditions information
 * Uses PolicyStep3Data interface for type safety
 * @param props - Component props
 */
export function CreatePolicyStep3({
  onSubmit,
  onPrevious,
  defaultValues,
  isLoading = false,
  isEditMode = false,
}: Step3Props) {
  const { t } = useTranslation('forms');

  // Create schema with translated messages that matches PolicyStep3Data interface
  const schema = useMemo(() => createSchema(t), [t]);

  return (
    <div className="space-y-6">
      <DynamicForm
        title={t(
          'policies.create_policy.form_steps.step_placeholders.coverages_conditions',
        )}
        submitLabel={
          isLoading
            ? isEditMode
              ? t('policies.create_policy.buttons.updating_policy')
              : t('policies.create_policy.buttons.creating_policy')
            : isEditMode
              ? t('policies.create_policy.buttons.edit_policy')
              : t('policies.create_policy.buttons.create_policy')
        }
        schema={schema}
        defaultValues={defaultValues}
        disabled={isLoading}
        isSubmitting={isLoading}
        fields={[
          {
            type: 'select',
            name: 'coverageLevel',
            label: t('policies.create_policy.form_fields.coverageLevel'),
            options: COVERAGE_LEVEL_OPTIONS.map((option) => ({
              label: t(
                `policies.create_policy.form_options.coverageLevels.${option.value}`,
              ),
              value: option.value,
            })),
          },
          {
            type: 'custom',
            name: 'addons',
            label: t('policies.create_policy.form_fields.addons'),
            render: (value, onChange) => (
              <div className="grid gap-2 sm:grid-cols-2">
                {AVAILABLE_ADDONS.map((addonKey) => {
                  const selected = Array.isArray(value)
                    ? value.includes(addonKey)
                    : false;
                  return (
                    <Button
                      key={addonKey}
                      type="button"
                      variant={selected ? 'primary' : 'outline'}
                      onClick={() => {
                        const next = new Set(Array.isArray(value) ? value : []);
                        if (selected) {
                          next.delete(addonKey);
                        } else {
                          next.add(addonKey);
                        }
                        onChange(Array.from(next));
                      }}
                    >
                      {t(
                        `policies.create_policy.form_options.addons.${addonKey}`,
                      )}
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
        onSubmit={(values) => onSubmit(values as PolicyStep3Data)}
      />

      {/* Previous step button */}
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
