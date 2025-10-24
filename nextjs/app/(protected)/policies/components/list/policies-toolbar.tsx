/**
 * Policies list toolbar component with search and create functionality
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Plus } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface PoliciesToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isLoading: boolean;
}

/**
 * Toolbar component for the policies list with search and create functionality
 * @param props - Component props
 */
export function PoliciesToolbar({
  searchQuery,
  onSearchChange,
  isLoading,
}: PoliciesToolbarProps) {
  const { t } = useTranslation('pages');
  const router = useRouter();
  const [inputValue, setInputValue] = useState(searchQuery);

  /**
   * Handle search input change
   */
  const handleSearch = () => {
    onSearchChange(inputValue);
  };

  /**
   * Clear search query
   */
  const handleClearSearch = () => {
    setInputValue('');
    onSearchChange('');
  };

  /**
   * Navigate to create policy page
   */
  const handleCreatePolicy = () => {
    router.push(ROUTES.POLICIES.children.CREATE_POLICY.path);
  };

  return (
    <CardHeader className="flex-col flex-wrap sm:flex-row items-stretch sm:items-center py-5">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 w-full">
        {/* Search input */}
        <div className="relative w-full sm:w-auto">
          <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder={t('policies.list.search_placeholder')}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="ps-9 w-full sm:w-64"
            disabled={isLoading}
          />
          {/* Clear search button */}
          {searchQuery.length > 0 && (
            <Button
              mode="icon"
              variant="dim"
              className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={handleClearSearch}
              disabled={isLoading}
            >
              <X />
            </Button>
          )}
        </div>
        
        {/* Create policy button */}
        <Button onClick={handleCreatePolicy} disabled={isLoading}>
          <Plus />
          {t('policies.list.create_button')}
        </Button>
      </div>
    </CardHeader>
  );
}
