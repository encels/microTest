/**
 * Main policies page component
 */

'use client';

import useTranslation from '@/hooks/useTranslation';
import { PoliciesList } from './components';

/**
 * Main policies page that displays the list of policies
 */
export default function PoliciesPage() {
  const { t } = useTranslation('pages');

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{t('policies.title')}</h1>
      <PoliciesList />
    </div>
  );
}
