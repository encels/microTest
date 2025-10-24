'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { redirect, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronRight, Plus, Search, X } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { LocalDB } from '@/lib/local-db';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTable } from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

export type Policy = {
  id: string;
  policyName: string;
  policyType: string;
  description: string;
  basePrice: number;
  validFrom: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  country: string;
  coverageLevel: string;
  addons: string[];
  deductible: number;
  notes: string;
};

function slugify(name: string) {
  return name
    ?.toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const PoliciesList = () => {
  const { t } = useTranslation('pages');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'product_name', desc: false },
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  // useQuery with local storage
  const { data: policies = [], isLoading } = useQuery({
    queryKey: ['policies'],
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

  // Filter and sort
  const filteredSortedData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let rows = [...policies];

    if (q) {
      rows = rows.filter(
        (p) =>
          p.policyName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.firstName.toLowerCase().includes(q) ||
          p.lastName.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.policyType.toLowerCase().includes(q),
      );
    }

    const sort = sorting?.[0];
    if (sort) {
      const { id, desc } = sort;
      rows.sort((a: any, b: any) => {
        const av = a[id];
        const bv = b[id];
        if (av == null && bv != null) return desc ? 1 : -1;
        if (av != null && bv == null) return desc ? -1 : 1;
        if (typeof av === 'number' && typeof bv === 'number') {
          return desc ? bv - av : av - bv;
        }
        return desc
          ? String(bv).localeCompare(String(av))
          : String(av).localeCompare(String(bv));
      });
    }

    return rows;
  }, [policies, searchQuery, sorting]);

  const pagedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredSortedData.slice(start, end);
  }, [filteredSortedData, pagination]);

  const handleRowClick = (row: Policy) => {
    redirect(`/policies/${row.id}`);
  };

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
          const p = row.original;
          return (
            <div className="space-y-px">
              <div className="font-medium text-sm">{p.policyName}</div>
              <div className="text-muted-foreground text-xs line-clamp-1">
                {p.description}
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
            title="Tipo"
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => (
          <span className="capitalize">{row.original.policyType}</span>
        ),
        size: 120,
        meta: {
          headerTitle: 'Tipo',
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
            title="Cliente"
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => (
          <div className="space-y-px">
            <div className="font-medium text-sm">
              {row.original.firstName} {row.original.lastName}
            </div>
            <div className="text-muted-foreground text-xs">
              {row.original.email}
            </div>
          </div>
        ),
        size: 220,
        meta: {
          headerTitle: 'Cliente',
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
            title="Precio Base"
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => <span>${row.original.basePrice.toFixed(2)}</span>,
        size: 120,
        meta: {
          headerTitle: 'Precio Base',
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
            title="Cobertura"
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => (
          <span className="capitalize">{row.original.coverageLevel}</span>
        ),
        size: 120,
        meta: {
          headerTitle: 'Cobertura',
          skeleton: <Skeleton className="w-20 h-7" />,
        },
        enableSorting: true,
        enableHiding: true,
      },
      {
        accessorKey: 'actions',
        header: '',
        cell: () => (
          <ChevronRight className="text-muted-foreground/70 size-3.5" />
        ),
        meta: {
          skeleton: <Skeleton className="size-4" />,
        },
        size: 40,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
      },
    ],
    [],
  );

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((c) => c.id as string),
  );

  const table = useReactTable({
    columns,
    data: pagedData,
    pageCount: Math.ceil(filteredSortedData.length / pagination.pageSize),
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

  const DataGridToolbar = () => {
    const [inputValue, setInputValue] = useState(searchQuery);
    const router = useRouter();

    const handleSearch = () => {
      setSearchQuery(inputValue);
      setPagination({ ...pagination, pageIndex: 0 });
    };

    const handleCreatePolicyButtonClick = () => {
      router.push(ROUTES.POLICIES.children.CREATE_POLICY.path);
    };

    return (
      <CardHeader className="flex-col flex-wrap sm:flex-row items-stretch sm:items-center py-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 w-full">
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
            {searchQuery.length > 0 && (
              <Button
                mode="icon"
                variant="dim"
                className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
                onClick={() => {
                  setSearchQuery('');
                  setInputValue('');
                }}
                disabled={isLoading}
              >
                <X />
              </Button>
            )}
          </div>
          {/* Create policy button */}
          <Button onClick={handleCreatePolicyButtonClick} disabled={isLoading}>
            <Plus />
            {t('policies.list.create_button')}
          </Button>
        </div>
      </CardHeader>
    );
  };

  return (
    <DataGrid
      table={table}
      recordCount={filteredSortedData.length}
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
        <DataGridToolbar />
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
  );
};
