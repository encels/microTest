'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
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
import { apiFetch } from '@/lib/api';
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
  product_name: string;
  description: string;
  starting_price: number | null;
  currency: 'USD' | null;
  price_breakdown: Record<string, number> | null;
  image_src: string;
};

function slugify(name: string) {
  return name
    .toLowerCase()
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

  // useQuery with local mock
  const { data: policies = [], isLoading } = useQuery({
    queryKey: ['policies', 'mock=policies'],
    queryFn: async (): Promise<Policy[]> => {
      const res = await apiFetch('/api/policies?mock=policies');
      if (!res.ok) return []; // si no hay archivo o error => vacío
      const arr = (await res.json()) as Policy[];
      return arr;
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
          p.product_name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
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
    const slug = slugify(row.product_name);
    redirect(`/policies/${slug}`);
  };

  const columns = useMemo<ColumnDef<Policy>[]>(
    () => [
      {
        accessorKey: 'product_name',
        id: 'product_name',
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
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={p.image_src}
                  alt={p.product_name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="space-y-px">
                <div className="font-medium text-sm">{p.product_name}</div>
                <div className="text-muted-foreground text-xs line-clamp-1">
                  {p.description}
                </div>
              </div>
            </div>
          );
        },
        size: 360,
        meta: {
          headerTitle: t('policies.list.header_policy'),
          skeleton: (
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-lg" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-72" />
              </div>
            </div>
          ),
        },
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'starting_price',
        id: 'starting_price',
        header: ({ column }) => (
          <DataGridColumnHeader
            title={t('policies.list.header_from_usd')}
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) =>
          row.original.starting_price != null ? (
            <span>${row.original.starting_price!.toFixed(2)}</span>
          ) : (
            <span className="text-muted-foreground">-</span>
          ),
        size: 120,
        meta: {
          headerTitle: t('policies.list.header_from_usd'),
          skeleton: <Skeleton className="w-16 h-7" />,
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
    getRowId: (row: Policy) => slugify(row.product_name),
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

    const handleSearch = () => {
      setSearchQuery(inputValue);
      setPagination({ ...pagination, pageIndex: 0 });
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
          <Button
            onClick={() => alert('Crear nueva póliza')}
            disabled={isLoading}
          >
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
