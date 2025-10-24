'use client';

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/config/routes';
import { LocalDB } from '@/lib/local-db';
import { Card, CardContent } from '@/components/ui/card';
import { Container } from '@/components/common/container';
import { CreatePolicySteps } from './create-policy-steps';
import {
  CreatePolicyStep1,
  CreatePolicyStep2,
  CreatePolicyStep3,
  PolicyStep1Data,
  PolicyStep2Data,
  PolicyStep3Data,
} from './policy-form-steps';

export type PolicyFormData = PolicyStep1Data &
  PolicyStep2Data &
  PolicyStep3Data;

export function PolicyFormWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<PolicyFormData>>({});

  const handleStep1Submit = (values: any) => {
    setFormData((prev) => ({ ...prev, ...values }));
    setCurrentStep(1);
  };

  const handleStep2Submit = (values: any) => {
    setFormData((prev) => ({ ...prev, ...values }));
    setCurrentStep(2);
  };

  const handleStep3Submit = async (values: any) => {
    const finalData = { ...formData, ...values };

    try {
      await LocalDB.set('policies', finalData);

      router.push(ROUTES.POLICIES.children.BUY_POLICY.path);
    } catch (error) {
      console.error('Error al guardar la póliza:', error);
      alert('Error al guardar la póliza. Por favor, intente nuevamente.');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <CreatePolicyStep1
            onSubmit={handleStep1Submit}
            defaultValues={formData}
          />
        );
      case 1:
        return (
          <CreatePolicyStep2
            onSubmit={handleStep2Submit}
            onPrevious={handlePrevious}
            defaultValues={formData}
          />
        );
      case 2:
        return (
          <CreatePolicyStep3
            onSubmit={handleStep3Submit}
            onPrevious={handlePrevious}
            defaultValues={formData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <CreatePolicySteps currentStep={currentStep} />

      <div className="mx-auto max-w-3xl">
        <Card className="rounded-2xl border border-border bg-card">
          <CardContent className="px-6 py-8">{renderCurrentStep()}</CardContent>
        </Card>
      </div>
    </Container>
  );
}
