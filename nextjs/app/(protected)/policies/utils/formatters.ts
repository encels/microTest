/**
 * Utility functions for formatting and data transformation
 */

import { Policy } from '../types';
import { TFunction } from 'i18next';

/**
 * Formats a number as currency
 */
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Formats a date string for display
 */
export const formatDate = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

/**
 * Formats a policy name for URL slug
 */
export const slugify = (name: string): string => {
  return name
    ?.toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

/**
 * Formats a full name from first and last name
 */
export const formatFullName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim();
};

/**
 * Formats policy type for display
 * @deprecated Use formatPolicyTypeI18n with translation function instead
 */
export const formatPolicyType = (type: string): string => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

/**
 * Formats policy type for display with i18n support
 */
export const formatPolicyTypeI18n = (type: string, t: TFunction): string => {
  return t(`policies.create_policy.form_options.policyTypes.${type}`);
};

/**
 * Formats coverage level for display
 * @deprecated Use formatCoverageLevelI18n with translation function instead
 */
export const formatCoverageLevel = (level: string): string => {
  return level.charAt(0).toUpperCase() + level.slice(1);
};

/**
 * Formats coverage level for display with i18n support
 */
export const formatCoverageLevelI18n = (level: string, t: TFunction): string => {
  return t(`policies.create_policy.form_options.coverageLevels.${level}`);
};

/**
 * Formats country code for display with i18n support
 */
export const formatCountryI18n = (country: string, t: TFunction): string => {
  return t(`policies.create_policy.form_options.countries.${country}`);
};

/**
 * Formats a single addon for display with i18n support
 */
export const formatAddonI18n = (addon: string, t: TFunction): string => {
  return t(`policies.create_policy.form_options.addons.${addon}`);
};

/**
 * Formats addons array for display
 * @deprecated Use formatAddonsI18n with translation function instead
 */
export const formatAddons = (addons: string[]): string => {
  return addons.length > 0 ? addons.join(', ') : 'None';
};

/**
 * Formats addons array for display with i18n support
 */
export const formatAddonsI18n = (addons: string[], t: TFunction): string => {
  if (addons.length === 0) return t('policies.create_policy.form_options.no_addons', 'None');
  return addons.map(addon => formatAddonI18n(addon, t)).join(', ');
};

/**
 * Generates a display summary for a policy
 */
export const generatePolicySummary = (policy: Policy): string => {
  const { policyName, policyType, coverageLevel, basePrice } = policy;
  return `${policyName} - ${formatPolicyType(policyType)} (${formatCoverageLevel(coverageLevel)}) - ${formatCurrency(basePrice)}`;
};

/**
 * Truncates text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Capitalizes the first letter of each word
 */
export const capitalizeWords = (text: string): string => {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
