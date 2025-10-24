;
/**
 * Constants and configuration values for the policies module
 */

import { Country, CoverageLevel, PolicyType } from '../types';


// Policy type values (labels should be translated using i18n: policies.create_policy.form_options.policyTypes.{value})
export const POLICY_TYPE_OPTIONS: Array<{ value: PolicyType }> = [
  { value: 'vida' },
  { value: 'salud' },
  { value: 'vehiculo' },
  { value: 'mascota' },
];

// Country values (labels should be translated using i18n: policies.create_policy.form_options.countries.{value})
export const COUNTRY_OPTIONS: Array<{ value: Country }> = [
  { value: 'VE' },
  { value: 'CL' },
  { value: 'AR' },
];

// Coverage level values (labels should be translated using i18n: policies.create_policy.form_options.coverageLevels.{value})
export const COVERAGE_LEVEL_OPTIONS: Array<{ value: CoverageLevel }> = [
  { value: 'basic' },
  { value: 'premium' },
  { value: 'total' },
];

// Available addons for policies
export const AVAILABLE_ADDONS = [
  'legal_assistance',
  'international_coverage',
  'home_care',
] as const;



// Table configuration
export const TABLE_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  DEFAULT_SORT_FIELD: 'policyName' as const,
  DEFAULT_SORT_DIRECTION: 'asc' as const,
} as const;

// Form step configuration
export const FORM_STEPS = {
  BASIC_INFO: 0,
  INSURED_DATA: 1,
  COVERAGES_CONDITIONS: 2,
} as const;

// API endpoints and keys
export const API_KEYS = {
  POLICIES: 'policies',
  POLICY_DETAIL: (id: string) => `policies/${id}`,
} as const;