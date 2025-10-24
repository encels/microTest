/**
 * Reusable Delete Policy Dialog Component
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoaderCircleIcon } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { usePolicy } from '../../hooks';
import { Policy } from '../../types';

interface DeletePolicyDialogProps {
  policy: Policy | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  redirectOnSuccess?: boolean;
}

/**
 * Dialog component for deleting a policy with confirmation
 */
export function DeletePolicyDialog({
  policy,
  open,
  onOpenChange,
  onSuccess,
  redirectOnSuccess = false,
}: DeletePolicyDialogProps) {
  const router = useRouter();
  const { t } = useTranslation('pages');
  const [isDeleting, setIsDeleting] = useState(false);

  // Get the deletePolicy function from the hook
  const { deletePolicy } = usePolicy(policy?.id || '');

  /**
   * Handle policy deletion
   */
  const handleDelete = async () => {
    if (!policy) return;

    setIsDeleting(true);
    try {
      await deletePolicy();
      
      // Close dialog
      onOpenChange(false);
      
      // Call success callback if provided
      onSuccess?.();
      
      // Redirect to policies list if requested
      if (redirectOnSuccess) {
        router.push('/policies');
      }
    } catch (err) {
      console.error('Error deleting policy:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Handle dialog close with deleting state check
   */
  const handleOpenChange = (newOpen: boolean) => {
    if (!isDeleting) {
      onOpenChange(newOpen);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="md:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('policies.delete_policy.title')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('policies.delete_policy.description')}{' '}
            <span className="font-semibold text-foreground">
              "{policy?.policyName}"
            </span>
            ? {t('policies.delete_policy.warning')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {t('policies.delete_policy.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <LoaderCircleIcon className="animate-spin size-4 mr-2" />
                {t('policies.delete_policy.deleting')}
              </>
            ) : (
              t('policies.delete_policy.confirm')
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

