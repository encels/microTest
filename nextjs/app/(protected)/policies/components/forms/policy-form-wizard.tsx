/**
 * Policy form wizard component that manages the multi-step form process
 */

'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Container } from '@/components/common/container';
import { CreatePolicySteps } from '../ui/policy-steps';
import {
  CreatePolicyStep1,
  CreatePolicyStep2,
  CreatePolicyStep3,
} from './steps';
import { PolicyFormWizardProps } from '../../types';
import { usePolicyForm } from '../../hooks';

/**
 * Main policy form wizard component that handles the multi-step form process
 * @param props - Component props
 */
export function PolicyFormWizard({
  initialData,
  policyId,
}: PolicyFormWizardProps) {
  // Use the custom hook for form state management
  const {
    formState,
    handleStepSubmit,
    handleFinalSubmit,
    goToPreviousStep,
  } = usePolicyForm(initialData, policyId);

  /**
   * Render the current step component based on currentStep state
   */
  const renderCurrentStep = () => {
    switch (formState.currentStep) {
      case 0:
        return (
          <CreatePolicyStep1
            onSubmit={handleStepSubmit}
            defaultValues={formState.formData}
          />
        );
      case 1:
        return (
          <CreatePolicyStep2
            onSubmit={handleStepSubmit}
            onPrevious={goToPreviousStep}
            defaultValues={formState.formData}
          />
        );
      case 2:
        return (
          <CreatePolicyStep3
            onSubmit={handleFinalSubmit}
            onPrevious={goToPreviousStep}
            defaultValues={formState.formData}
            isLoading={formState.isLoading}
            isEditMode={!!policyId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      {/* Display the step progress indicator */}
      <CreatePolicySteps currentStep={formState.currentStep} />

      {/* Form content */}
      <div className="mx-auto max-w-3xl">
        <Card className="rounded-2xl border border-border bg-card">
          <CardContent className="px-6 py-8">
            {renderCurrentStep()}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
