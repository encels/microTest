'use client';

import useTranslation from '@/hooks/useTranslation';

export default function PoliciesPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{t('pages.policies.title')}</h1>
    </div>
  );
}
