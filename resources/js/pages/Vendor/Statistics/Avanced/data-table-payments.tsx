/* eslint-disable react-hooks/incompatible-library */

// resources/js/Components/DataTablePaiements.tsx

import { router } from '@inertiajs/react';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

import type {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
} from '@tanstack/react-table';

import {
    ArrowUpDown,
    MoreHorizontal,
    Eye,
    Trash2,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    CreditCard,
} from 'lucide-react';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Input } from '@/components/ui/input';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export interface PaiementRow {
    id: string;
    reference: string;
    transaction_id?: string;
    montant: number;
    mode: string;
    statut: string;
    date_paiement: string;
}

interface Props {
    paiements: {
        data: PaiementRow[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };

    filters?: {
        search?: string;
        statut?: string;
    };
}

const statusConfig = (statut: string) => {
    switch (statut) {
        case 'valide':
            return {
                bg: 'bg-emerald-500/10',
                text: 'text-emerald-600 dark:text-emerald-400',
                border: 'border-emerald-500/20',
                dot: 'bg-emerald-500',
            };

        case 'en_attente':
            return {
                bg: 'bg-amber-500/10',
                text: 'text-amber-600 dark:text-amber-400',
                border: 'border-amber-500/20',
                dot: 'bg-amber-500',
            };

        case 'echec':
            return {
                bg: 'bg-red-500/10',
                text: 'text-red-600 dark:text-red-400',
                border: 'border-red-500/20',
                dot: 'bg-red-500',
            };

        case 'rembourse':
            return {
                bg: 'bg-purple-500/10',
                text: 'text-purple-600 dark:text-purple-400',
                border: 'border-purple-500/20',
                dot: 'bg-purple-500',
            };

        default:
            return {
                bg: 'bg-slate-500/10',
                text: 'text-slate-600 dark:text-slate-400',
                border: 'border-slate-500/20',
                dot: 'bg-slate-500',
            };
    }
};

export function DataTablePaiements({ paiements: initialPaiements }: Props) {
    const [data, setData] = useState<PaiementRow[]>(
        initialPaiements.data ?? [],
    );

    const [sorting, setSorting] = useState<SortingState>([]);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const [rowSelection, setRowSelection] = useState({});

    const [pagination, setPagination] = useState({
        pageIndex: (initialPaiements.current_page || 1) - 1,
        pageSize: initialPaiements.per_page || 10,
    });

    useEffect(() => {
        setData(initialPaiements.data ?? []);
    }, [initialPaiements.data]);

    const columns: ColumnDef<PaiementRow>[] = [
        {
            id: 'select',

            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    className="border-slate-400/60 dark:border-slate-600"
                />
            ),

            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    className="border-slate-400/60 dark:border-slate-600"
                />
            ),

            enableSorting: false,
            enableHiding: false,
        },

        {
            accessorKey: 'reference',

            header: 'Référence',

            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">
                        {row.original.reference}
                    </span>

                    <span className="mt-1 text-xs text-slate-400">
                        #{row.original.id.slice(0, 8)}
                    </span>
                </div>
            ),
        },

        {
            accessorKey: 'transaction_id',

            header: 'Transaction',

            cell: ({ row }) => (
                <div className="text-sm text-slate-600 dark:text-slate-400">
                    {row.original.transaction_id || '—'}
                </div>
            ),
        },

        {
            accessorKey: 'montant',

            header: () => <div className="text-right">Montant</div>,

            cell: ({ row }) => (
                <div className="text-right">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        {new Intl.NumberFormat('fr-CD', {
                            style: 'currency',
                            currency: 'CDF',
                            maximumFractionDigits: 0,
                        }).format(row.original.montant)}
                    </span>
                </div>
            ),
        },

        {
            accessorKey: 'mode',

            header: 'Mode',

            cell: ({ row }) => (
                <Badge className="rounded-full border border-slate-300/60 bg-slate-100/70 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
                    <CreditCard className="mr-1.5 h-3 w-3" />
                    {row.original.mode}
                </Badge>
            ),
        },

        {
            accessorKey: 'statut',

            header: 'Statut',

            cell: ({ row }) => {
                const config = statusConfig(row.original.statut);

                return (
                    <Badge
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-xl ${config.bg} ${config.text} ${config.border}`}
                    >
                        <span
                            className={`h-2 w-2 rounded-full ${config.dot}`}
                        />

                        {row.original.statut}
                    </Badge>
                );
            },

            filterFn: (row, id, value) => {
                if (!value) {
                    return true;
                }

                return row.getValue(id) === value;
            },
        },

        {
            accessorKey: 'date_paiement',

            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                    className="h-auto p-0 font-semibold text-slate-600 hover:bg-transparent hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400"
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),

            cell: ({ row }) => (
                <div className="text-sm text-slate-500 dark:text-slate-400">
                    {new Date(row.original.date_paiement).toLocaleDateString(
                        'fr-FR',
                        {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                        },
                    )}
                </div>
            ),
        },

        {
            id: 'actions',

            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="w-44 rounded-2xl border border-slate-200/70 bg-white/95 shadow-2xl backdrop-blur-2xl dark:border-slate-700/70 dark:bg-slate-900/95"
                    >
                        <DropdownMenuItem
                            onClick={() =>
                                router.get(`/paiements/${row.original.id}`)
                            }
                            className="cursor-pointer rounded-xl"
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            Voir
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            className="cursor-pointer rounded-xl text-red-600 focus:bg-red-500/10 dark:text-red-400"
                            onClick={() => {
                                if (confirm('Supprimer ce paiement ?')) {
                                    router.delete(
                                        `/paiements/${row.original.id}`,
                                        {
                                            onSuccess: () =>
                                                toast.success(
                                                    'Paiement supprimé',
                                                ),
                                        },
                                    );
                                }
                            }}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    const table = useReactTable({
        data,
        columns,

        state: {
            sorting,
            columnFilters,
            rowSelection,
            pagination,
        },

        pageCount: initialPaiements.last_page,

        manualPagination: true,
        manualSorting: true,

        enableRowSelection: true,

        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,

        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <Card className="overflow-hidden rounded-[1.75rem] border border-slate-200/60 bg-white/80 shadow-[0_10px_45px_-15px_rgba(15,23,42,0.15)] backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/70 dark:shadow-[0_10px_45px_-15px_rgba(0,0,0,0.65)]">
            {/* HEADER */}
            <CardHeader className="relative flex flex-row items-center justify-between border-b border-slate-200/60 bg-linear-to-r from-white/90 to-slate-50/80 px-7 py-5 backdrop-blur-xl dark:border-slate-800/70 dark:from-slate-900/95 dark:to-slate-950/95">
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-emerald-500/30 to-transparent" />

                <div className="flex items-center gap-3">
                    <CardTitle className="text-xl font-black tracking-tight text-slate-800 dark:text-white">
                        Derniers paiements
                    </CardTitle>

                    <Badge className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 font-medium text-emerald-700 backdrop-blur-xl dark:text-emerald-400">
                        {initialPaiements.total} total
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                {/* TOOLBAR */}
                <div className="flex flex-col gap-4 border-b border-slate-200/60 bg-slate-50/40 px-7 py-5 backdrop-blur-xl lg:flex-row lg:items-center dark:border-slate-800/70 dark:bg-slate-950/40">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <Input
                            placeholder="Rechercher une référence..."
                            value={
                                (columnFilters.find((f) => f.id === 'reference')
                                    ?.value as string) ?? ''
                            }
                            onChange={(e) =>
                                table
                                    .getColumn('reference')
                                    ?.setFilterValue(e.target.value)
                            }
                            className="h-11 rounded-2xl border-slate-200/70 bg-white/80 pl-10 shadow-sm backdrop-blur-xl transition-all duration-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700/70 dark:bg-slate-900/80 dark:focus:ring-emerald-500/20"
                        />
                    </div>

                    <Select
                        value={
                            (columnFilters.find((f) => f.id === 'statut')
                                ?.value as string) ?? 'all'
                        }
                        onValueChange={(value) =>
                            table
                                .getColumn('statut')
                                ?.setFilterValue(value === 'all' ? '' : value)
                        }
                    >
                        <SelectTrigger className="h-11 w-52 rounded-2xl border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-xl transition-all focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700/70 dark:bg-slate-900/80 dark:focus:ring-emerald-500/20">
                            <Filter className="mr-2 h-4 w-4 text-slate-400" />

                            <SelectValue placeholder="Tous les statuts" />
                        </SelectTrigger>

                        <SelectContent className="rounded-2xl border border-slate-200/70 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/95">
                            <SelectItem value="all">
                                Tous les statuts
                            </SelectItem>

                            <SelectItem value="valide">Validé</SelectItem>

                            <SelectItem value="en_attente">
                                En attente
                            </SelectItem>

                            <SelectItem value="echec">Échec</SelectItem>

                            <SelectItem value="rembourse">Remboursé</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="flex-1" />

                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {table.getFilteredRowModel().rows.length} résultat(s)
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow
                                    key={headerGroup.id}
                                    className="border-slate-200/60 bg-slate-100/40 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/60"
                                >
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className="h-14 px-4 text-xs font-bold tracking-wider whitespace-nowrap text-slate-500 uppercase dark:text-slate-400"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>

                        <TableBody>
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && 'selected'
                                        }
                                        className="border-slate-200/50 transition-all duration-300 hover:bg-slate-100/50 hover:shadow-inner data-[state=selected]:bg-emerald-500/5 dark:border-slate-800/60 dark:hover:bg-slate-800/40 dark:data-[state=selected]:bg-emerald-500/10"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="px-4 py-4 align-middle"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-32 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
                                            <CreditCard className="h-10 w-10 opacity-30" />

                                            <p className="font-medium">
                                                Aucun paiement trouvé
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* PAGINATION */}
                <div className="flex flex-col gap-4 border-t border-slate-200/60 bg-slate-50/40 px-7 py-5 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between dark:border-slate-800/70 dark:bg-slate-950/40">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        {table.getFilteredSelectedRowModel().rows.length}{' '}
                        sélectionné(s)
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="h-10 rounded-xl border-slate-200/70 bg-white/80 px-4 backdrop-blur-xl hover:bg-slate-100 dark:border-slate-700/70 dark:bg-slate-900/70 dark:hover:bg-slate-800"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="rounded-xl border border-slate-200/70 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-300">
                            Page {table.getState().pagination.pageIndex + 1} /{' '}
                            {table.getPageCount()}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="h-10 rounded-xl border-slate-200/70 bg-white/80 px-4 backdrop-blur-xl hover:bg-slate-100 dark:border-slate-700/70 dark:bg-slate-900/70 dark:hover:bg-slate-800"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
