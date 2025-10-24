/**
 * Policies list component with table display and data management
 */

'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardTable } from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Policy } from '../../types';
import { usePolicies } from '../../hooks';
import { DeletePolicyDialog } from '../ui';
import { PoliciesToolbar } from './policies-toolbar';
import { formatCurrency, formatFullName } from '../../utils';

/**
 * Main policies list component that displays policies in a table format
 */
export const PoliciesList = () => {
  const router = useRouter();
  const { t } = useTranslation('pages');
  const { t: tForms } = useTranslation('forms');
  const { policies, isLoading, filters, setFilters } = usePolicies();

  // Table state management
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'policyName', desc: false },
  ]);

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState<Policy | null>(null);

  // Paginated data
  const pagedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return policies.slice(start, end);
  }, [policies, pagination]);

  /**
   * Handle row click to navigate to policy details
   * @param row - The clicked policy row
   */
  const handleRowClick = (row: Policy) => {
    router.push(`/policies/${row.id}`);
  };

  /**
   * Handle edit action
   * @param policy - The policy to edit
   * @param e - Click event
   */
  const handleEdit = useCallback((policy: Policy, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    router.push(`/policies/${policy.id}`);
  }, [router]);

  /**
   * Handle delete action (opens confirmation dialog)
   * @param policy - The policy to delete
   * @param e - Click event
   */
  const handleDeleteClick = useCallback((policy: Policy, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    setPolicyToDelete(policy);
    setDeleteDialogOpen(true);
  }, []);

  /**
   * Handle search query change
   * @param query - The new search query
   */
  const handleSearchChange = (query: string) => {
    setFilters({ ...filters, searchQuery: query });
    setPagination({ ...pagination, pageIndex: 0 });
  };

  // Table columns configuration
  const columns = useMemo<ColumnDef<Policy>[]>(
    () => [
      {
        accessorKey: 'policyName',
        id: 'policyName',
        header: ({ column }) => (
          <DataGridColumnHeader
            title={t('policies.list.header_policy')}
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => {
          const policy = row.original;
          return (
            <div className="space-y-px">
              <div className="font-medium text-sm">{policy.policyName}</div>
              <div className="text-muted-foreground text-xs line-clamp-1">
                {policy.description}
              </div>
            </div>
          );
        },
        size: 280,
        meta: {
          headerTitle: t('policies.list.header_policy'),
          skeleton: (
            <div className="space-y-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-72" />
            </div>
          ),
        },
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'policyType',
        id: 'policyType',
        header: ({ column }) => (
          <DataGridColumnHeader
            title={t('policies.list.header_type')}
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => (
          <span>{tForms(`policies.create_policy.form_options.policyTypes.${row.original.policyType}`)}</span>
        ),
        size: 120,
        meta: {
          headerTitle: t('policies.list.header_type'),
          skeleton: <Skeleton className="w-20 h-7" />,
        },
        enableSorting: true,
        enableHiding: true,
      },
      {
        accessorKey: 'firstName',
        id: 'client',
        header: ({ column }) => (
          <DataGridColumnHeader
            title={t('policies.list.header_client')}
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => (
          <div className="space-y-px">
            <div className="font-medium text-sm">
              {formatFullName(row.original.firstName, row.original.lastName)}
            </div>
            <div className="text-muted-foreground text-xs">
              {row.original.email}
            </div>
          </div>
        ),
        size: 220,
        meta: {
          headerTitle: t('policies.list.header_client'),
          skeleton: (
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          ),
        },
        enableSorting: true,
        enableHiding: true,
      },
      {
        accessorKey: 'basePrice',
        id: 'basePrice',
        header: ({ column }) => (
          <DataGridColumnHeader
            title={t('policies.list.header_base_price')}
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => (
          <span>{formatCurrency(row.original.basePrice)}</span>
        ),
        size: 120,
        meta: {
          headerTitle: t('policies.list.header_base_price'),
          skeleton: <Skeleton className="w-16 h-7" />,
        },
        enableSorting: true,
        enableHiding: true,
      },
      {
        accessorKey: 'coverageLevel',
        id: 'coverageLevel',
        header: ({ column }) => (
          <DataGridColumnHeader
            title={t('policies.list.header_coverage')}
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => (
          <span>{tForms(`policies.create_policy.form_options.coverageLevels.${row.original.coverageLevel}`)}</span>
        ),
        size: 120,
        meta: {
          headerTitle: t('policies.list.header_coverage'),
          skeleton: <Skeleton className="w-20 h-7" />,
        },
        enableSorting: true,
        enableHiding: true,
      },
      {
        accessorKey: 'actions',
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const policy = row.original;
          return (
            <div className="flex items-center justify-end gap-1">
              <Button
                mode="icon"
                variant="ghost"
                className="size-7"
                onClick={(e) => handleEdit(policy, e)}
                title="Edit policy"
              >
                <Pencil className="size-3.5" />
              </Button>
              <Button
                mode="icon"
                variant="ghost"
                className="size-7 hover:bg-destructive/10 hover:text-destructive"
                onClick={(e) => handleDeleteClick(policy, e)}
                title="Delete policy"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          );
        },
        meta: {
          skeleton: <Skeleton className="w-16 h-7" />,
        },
        size: 80,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
      },
    ],
    [t, tForms, handleEdit, handleDeleteClick],
  );

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((c) => c.id as string),
  );

  // React Table configuration
  const table = useReactTable({
    columns,
    data: pagedData,
    pageCount: Math.ceil(policies.length / pagination.pageSize),
    getRowId: (row: Policy) => row.id,
    state: { pagination, sorting, columnOrder },
    columnResizeMode: 'onChange',
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  return (
    <>
      <DataGrid
        table={table}
        recordCount={policies.length}
        isLoading={isLoading}
        onRowClick={handleRowClick}
        tableLayout={{
          columnsResizable: true,
          columnsPinnable: true,
          columnsMovable: true,
          columnsVisibility: true,
        }}
        tableClassNames={{
          edgeCell: 'px-5',
        }}
      >
        <Card>
          <PoliciesToolbar
            searchQuery={filters.searchQuery}
            onSearchChange={handleSearchChange}
            isLoading={isLoading}
          />
          <CardTable>
            <ScrollArea>
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardTable>
          <CardFooter>
            <DataGridPagination />
          </CardFooter>
        </Card>
      </DataGrid>

      {/* Delete Confirmation Dialog */}
      <DeletePolicyDialog
        policy={policyToDelete}
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setPolicyToDelete(null);
        }}
      />
    </>
  );
};
