/**
 * Create policy page component
 */

'use client';

import useTranslation from '@/hooks/useTranslation';
import { PolicyFormWizard } from '../components';

/**
 * Create policy page that displays the policy form wizard
 */
export default function CreatePolicyPage() {
  const { t } = useTranslation('pages');

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">
        {t('policies.create_policy.title')}
      </h1>

      <PolicyFormWizard />
    </div>
  );
}
