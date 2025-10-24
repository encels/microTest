'use client';

import * as React from 'react';
import { useState } from 'react';
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

  const handleStep3Submit = (values: any) => {
    const finalData = { ...formData, ...values };
    console.log('Datos finales de la póliza:', finalData);
    alert('¡Póliza creada exitosamente!');
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
