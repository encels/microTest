/**
 * Custom hook for managing policies data and operations
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { LocalDB } from '@/lib/local-db';
import { Policy, PolicyFilters, PolicySortOptions } from '../types';
import { API_KEYS, TABLE_CONFIG } from '../utils';

/**
 * Hook for managing policies list with filtering, sorting, and pagination
 */
export const usePolicies = () => {
  const [filters, setFilters] = useState<PolicyFilters>({
    searchQuery: '',
  });
  const [sortOptions, setSortOptions] = useState<PolicySortOptions>({
    field: 'policyName',
    direction: 'asc',
  });

  // Fetch all policies from local storage
  const { data: policies = [], isLoading, error } = useQuery({
    queryKey: [API_KEYS.POLICIES],
    queryFn: async (): Promise<Policy[]> => {
      const data = await LocalDB.getAll<Omit<Policy, 'id'>>('policies');
      return data || [];
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 0,
  });

  // Filter and sort policies based on current filters and sort options
  const filteredAndSortedPolicies = useMemo(() => {
    let filteredPolicies = [...policies];

    // Apply search filter
    if (filters.searchQuery.trim()) {
      const searchTerm = filters.searchQuery.trim().toLowerCase();
      filteredPolicies = filteredPolicies.filter(
        (policy) =>
          policy.policyName.toLowerCase().includes(searchTerm) ||
          policy.description.toLowerCase().includes(searchTerm) ||
          policy.firstName.toLowerCase().includes(searchTerm) ||
          policy.lastName.toLowerCase().includes(searchTerm) ||
          policy.email.toLowerCase().includes(searchTerm) ||
          policy.policyType.toLowerCase().includes(searchTerm)
      );
    }

    // Apply type filter
    if (filters.policyType) {
      filteredPolicies = filteredPolicies.filter(
        (policy) => policy.policyType === filters.policyType
      );
    }

    // Apply coverage level filter
    if (filters.coverageLevel) {
      filteredPolicies = filteredPolicies.filter(
        (policy) => policy.coverageLevel === filters.coverageLevel
      );
    }

    // Apply active status filter
    if (filters.isActive !== undefined) {
      filteredPolicies = filteredPolicies.filter(
        (policy) => policy.isActive === filters.isActive
      );
    }

    // Apply sorting
    const { field, direction } = sortOptions;
    filteredPolicies.sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      if (aValue == null && bValue != null) return direction === 'desc' ? 1 : -1;
      if (aValue != null && bValue == null) return direction === 'desc' ? -1 : 1;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'desc' ? bValue - aValue : aValue - bValue;
      }

      return direction === 'desc'
        ? String(bValue).localeCompare(String(aValue))
        : String(aValue).localeCompare(String(bValue));
    });

    return filteredPolicies;
  }, [policies, filters, sortOptions]);

  return {
    policies: filteredAndSortedPolicies,
    isLoading,
    error,
    filters,
    setFilters,
    sortOptions,
    setSortOptions,
  };
};

/**
 * Hook for managing a single policy
 */
export const usePolicy = (policyId: string) => {
  const queryClient = useQueryClient();

  const { data: policy, isLoading, error } = useQuery({
    queryKey: [API_KEYS.POLICIES, policyId],
    queryFn: async (): Promise<Policy | null> => {
      const data = await LocalDB.get<Policy>(API_KEYS.POLICY_DETAIL(policyId));
      return data;
    },
    enabled: !!policyId,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 0,
  });

  const updatePolicy = async (updatedPolicy: Policy) => {
    try {
      // Simulate API delay (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await LocalDB.set('policies', updatedPolicy);
      await queryClient.invalidateQueries({ queryKey: [API_KEYS.POLICIES] });
      await queryClient.invalidateQueries({ queryKey: [API_KEYS.POLICIES, policyId] });
    } catch (error) {
      console.error('Error updating policy:', error);
      throw error;
    }
  };

  const deletePolicy = async () => {
    try {
      // Simulate API delay (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await LocalDB.erase(API_KEYS.POLICY_DETAIL(policyId));
      await queryClient.invalidateQueries({ queryKey: [API_KEYS.POLICIES] });
    } catch (error) {
      console.error('Error deleting policy:', error);
      throw error;
    }
  };

  return {
    policy,
    isLoading,
    error,
    updatePolicy,
    deletePolicy,
  };
};
