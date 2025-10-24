/**
 * Centralized types and interfaces for the policies module
 */

// Base policy type with all possible fields
export interface Policy {
  id: string;
  policyName: string;
  policyType: PolicyType;
  description: string;
  basePrice: number;
  validFrom: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  country: Country;
  coverageLevel: CoverageLevel;
  addons: string[];
  deductible: number;
  notes: string;
}

// Enums for type safety
export type PolicyType = 'vida' | 'salud' | 'vehiculo' | 'mascota';
export type Country = 'VE' | 'CL' | 'AR';
export type CoverageLevel = 'basic' | 'premium' | 'total';

// Form data types for each step
export interface PolicyStep1Data {
  policyName: string;
  policyType: PolicyType;
  description?: string;
  basePrice: number;
  validFrom?: Date;
  isActive: boolean;
}

export interface PolicyStep2Data {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthDate?: Date;
  country?: Country;
}

export interface PolicyStep3Data {
  coverageLevel: CoverageLevel;
  addons?: string[];
  deductible?: number;
  notes?: string;
}

// Combined form data type
export type PolicyFormData = PolicyStep1Data &
  PolicyStep2Data &
  PolicyStep3Data;

// Component props interfaces
export interface PolicyFormWizardProps {
  initialData?: Partial<PolicyFormData>;
  policyId?: string;
}


export interface CreatePolicyStepsProps {
  currentStep: number;
}

// Form step component props
export interface PolicyStepProps {
  onSubmit: (values: any) => void;
  onPrevious?: () => void;
  defaultValues?: any;
  isLoading?: boolean;
  isEditMode?: boolean;
}

// Table and list related types
export interface PolicyTableColumn {
  id: string;
  title: string;
  size: number;
  sortable: boolean;
  filterable: boolean;
}

// API and data management types
export interface PolicyFilters {
  searchQuery: string;
  policyType?: PolicyType;
  coverageLevel?: CoverageLevel;
  isActive?: boolean;
}

export interface PolicySortOptions {
  field: keyof Policy;
  direction: 'asc' | 'desc';
}

// Utility types
export type PolicyFormStep = 0 | 1 | 2;

export interface PolicyFormState {
  currentStep: PolicyFormStep;
  formData: Partial<PolicyFormData>;
  isLoading: boolean;
  error: string | null;
}
