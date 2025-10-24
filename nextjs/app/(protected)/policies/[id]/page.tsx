/**
 * Policy edit page component
 */

'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { DeletePolicyDialog, PolicyFormWizard } from '../components';
import { usePolicy } from '../hooks';
import { PolicyFormData } from '../types';

/**
 * Policy edit page that allows editing and deleting a policy
 */
export default function PolicyEditPage() {
  const params = useParams();
  const { id } = params;
  const { t } = useTranslation('pages');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Use the custom hook for policy data management
  const { policy, isLoading, error } = usePolicy(id as string);

  /**
   * Convert Policy to PolicyFormData format for editing
   */
  const policyFormData = useMemo((): Partial<PolicyFormData> | undefined => {
    if (!policy) return undefined;

    return {
      policyName: policy.policyName,
      policyType: policy.policyType,
      description: policy.description,
      basePrice: policy.basePrice,
      validFrom: policy.validFrom ? new Date(policy.validFrom) : undefined,
      isActive: policy.isActive,
      firstName: policy.firstName,
      lastName: policy.lastName,
      email: policy.email,
      phone: policy.phone,
      birthDate: policy.birthDate ? new Date(policy.birthDate) : undefined,
      country: policy.country,
      coverageLevel: policy.coverageLevel,
      addons: policy.addons,
      deductible: policy.deductible,
      notes: policy.notes,
    };
  }, [policy]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading policy...</p>
      </div>
    );
  }

  // Error state
  if (error || !policy) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p>{error ? String(error) : 'Policy not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 py-6">
        <div className="flex justify-end mb-4">
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 /> {t('policies.edit_policy.delete_policy.confirm')}
          </Button>
        </div>
        <PolicyFormWizard
          initialData={policyFormData}
          policyId={id as string}
        />
      </div>

      {/* Delete Policy Dialog */}
      <DeletePolicyDialog
        policy={policy || null}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        redirectOnSuccess={true}
      />
    </>
  );
}
