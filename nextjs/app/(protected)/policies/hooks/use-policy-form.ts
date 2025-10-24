/**
 * Custom hook for managing policy form state and operations
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/hooks/useTranslation';
import { LocalDB } from '@/lib/local-db';
import { ROUTES } from '@/config/routes';
import { PolicyFormData, PolicyFormStep, PolicyFormState } from '../types';
import { API_KEYS, FORM_STEPS } from '../utils';

/**
 * Hook for managing policy form wizard state and operations
 */
export const usePolicyForm = (initialData?: Partial<PolicyFormData>, policyId?: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useTranslation('forms');

  const [formState, setFormState] = useState<PolicyFormState>({
    currentStep: FORM_STEPS.BASIC_INFO,
    formData: initialData || {},
    isLoading: false,
    error: null,
  });

  // Navigate to next step
  const goToNextStep = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, FORM_STEPS.COVERAGES_CONDITIONS) as PolicyFormStep,
    }));
  }, []);

  // Navigate to previous step
  const goToPreviousStep = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, FORM_STEPS.BASIC_INFO) as PolicyFormStep,
    }));
  }, []);

  // Update form data
  const updateFormData = useCallback((newData: Partial<PolicyFormData>) => {
    setFormState(prev => ({
      ...prev,
      formData: { ...prev.formData, ...newData },
    }));
  }, []);

  // Handle step submission
  const handleStepSubmit = useCallback((stepData: Partial<PolicyFormData>) => {
    updateFormData(stepData);
    
    if (formState.currentStep < FORM_STEPS.COVERAGES_CONDITIONS) {
      goToNextStep();
    }
  }, [formState.currentStep, updateFormData, goToNextStep]);

  // Handle final form submission
  const handleFinalSubmit = useCallback(async (finalData: Partial<PolicyFormData>) => {
    setFormState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const completeData: Partial<PolicyFormData> & { id?: string } = { 
        ...formState.formData, 
        ...finalData 
      };
      
      if (policyId) {
        completeData.id = policyId;
      }

      // Simulate API delay (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await LocalDB.set('policies', completeData);
      await queryClient.invalidateQueries({ queryKey: [API_KEYS.POLICIES] });
      
      // Navigate to policies list after successful submission
      router.push(ROUTES.POLICIES.children.LIST_POLICY.path);
    } catch (error) {
      console.error('Error saving policy:', error);
      setFormState(prev => ({
        ...prev,
        error: t('common.messages.error') || 'Error saving policy. Please try again.',
        isLoading: false,
      }));
    }
  }, [formState.formData, policyId, queryClient, router, t]);

  // Reset form state
  const resetForm = useCallback(() => {
    setFormState({
      currentStep: FORM_STEPS.BASIC_INFO,
      formData: initialData || {},
      isLoading: false,
      error: null,
    });
  }, [initialData]);

  // Clear error
  const clearError = useCallback(() => {
    setFormState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    formState,
    goToNextStep,
    goToPreviousStep,
    updateFormData,
    handleStepSubmit,
    handleFinalSubmit,
    resetForm,
    clearError,
  };
};

/**
 * Hook for managing policy form validation
 */
export const usePolicyFormValidation = () => {
  const { t } = useTranslation('forms');

  const validateStep1 = useCallback((data: Partial<PolicyFormData>) => {
    const errors: Record<string, string> = {};

    if (!data.policyName || data.policyName.length < 2) {
      errors.policyName = t('policies.create_policy.validation.policyName.min');
    }

    if (!data.policyType) {
      errors.policyType = t('policies.create_policy.validation.policyType.required');
    }

    if (!data.basePrice || data.basePrice < 0) {
      errors.basePrice = t('policies.create_policy.validation.basePrice.nonnegative');
    }

    return errors;
  }, [t]);

  const validateStep2 = useCallback((data: Partial<PolicyFormData>) => {
    const errors: Record<string, string> = {};

    if (!data.firstName || data.firstName.length < 2) {
      errors.firstName = t('policies.create_policy.validation.firstName.min');
    }

    if (!data.lastName || data.lastName.length < 2) {
      errors.lastName = t('policies.create_policy.validation.lastName.min');
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = t('policies.create_policy.validation.email.invalid');
    }

    return errors;
  }, [t]);

  const validateStep3 = useCallback((data: Partial<PolicyFormData>) => {
    const errors: Record<string, string> = {};

    if (!data.coverageLevel) {
      errors.coverageLevel = t('policies.create_policy.validation.coverageLevel.required');
    }

    return errors;
  }, [t]);

  return {
    validateStep1,
    validateStep2,
    validateStep3,
  };
};
