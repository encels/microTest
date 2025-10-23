'use client';

import useTranslation from '@/hooks/useTranslation';
import { FormSteps } from '../components/form-steps';

export default function CreatePolicyPage() {
  const { t } = useTranslation('pages');

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">
        {t('policies.create_policy.title')}
      </h1>

      <FormSteps currentStep={0} />
    </div>
  );
}
