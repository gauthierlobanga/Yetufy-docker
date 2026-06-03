/* eslint-disable react-hooks/incompatible-library */
// resources/js/Components/DataTableCommandes.tsx

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
    FileText,
    Trash2,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    PackageCheck,
} from 'lucide-react';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

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

export interface CommandeRow {
    id: string;
    numero_commande: string;
    client: string;
    client_email?: string;
    total: number;
    statut: string;
    date_commande: string;
    url: string;
}

interface Props {
    commandes: {
        data: CommandeRow[];
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
        case 'payee':
            return {
                badge: `
                    border-emerald-500/20
                    bg-emerald-500/10
                    text-emerald-600
                    dark:text-emerald-400
                `,
                dot: 'bg-emerald-500',
                label: 'Payée',
            };

        case 'en_attente':
            return {
                badge: `
                    border-amber-500/20
                    bg-amber-500/10
                    text-amber-600
                    dark:text-amber-400
                `,
                dot: 'bg-amber-500',
                label: 'En attente',
            };

        case 'annulee':
            return {
                badge: `
                    border-red-500/20
                    bg-red-500/10
                    text-red-600
                    dark:text-red-400
                `,
                dot: 'bg-red-500',
                label: 'Annulée',
            };

        case 'expediee':
            return {
                badge: `
                    border-blue-500/20
                    bg-blue-500/10
                    text-blue-600
                    dark:text-blue-400
                `,
                dot: 'bg-blue-500',
                label: 'Expédiée',
            };

        default:
            return {
                badge: `
                    border-slate-500/20
                    bg-slate-500/10
                    text-slate-600
                    dark:text-slate-400
                `,
                dot: 'bg-slate-500',
                label: statut,
            };
    }
};

export function DataTableCommandes({ commandes: initialCommandes }: Props) {
    const [data, setData] = useState<CommandeRow[]>(initialCommandes.data);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const [rowSelection, setRowSelection] = useState({});

    const [pagination, setPagination] = useState({
        pageIndex: (initialCommandes.current_page || 1) - 1,
        pageSize: initialCommandes.per_page || 10,
    });

    useEffect(() => {
        setData(initialCommandes.data);
    }, [initialCommandes.data]);

    const columns: ColumnDef<CommandeRow>[] = [
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
                    className="border-slate-600"
                />
            ),

            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    className="border-slate-600"
                />
            ),

            enableSorting: false,
            enableHiding: false,
        },

        {
            accessorKey: 'numero_commande',

            header: 'Commande',

            cell: ({ row }) => (
                <div className="space-y-1">
                    <a
                        href={row.original.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-emerald-500 transition-colors hover:text-emerald-400 hover:underline"
                    >
                        {row.original.numero_commande}
                    </a>

                    <div className="text-xs text-slate-500 dark:text-slate-400">
                        #{row.original.id}
                    </div>
                </div>
            ),
        },

        {
            accessorKey: 'client',

            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                    className="h-auto p-0 font-medium text-slate-300 hover:bg-transparent hover:text-white"
                >
                    Client
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),

            cell: ({ row }) => (
                <div className="space-y-1">
                    <div className="font-medium text-slate-200">
                        {row.original.client}
                    </div>

                    {row.original.client_email && (
                        <div className="text-xs text-slate-500">
                            {row.original.client_email}
                        </div>
                    )}
                </div>
            ),
        },

        {
            accessorKey: 'total',

            header: () => (
                <div className="text-right text-slate-300">Montant</div>
            ),

            cell: ({ row }) => (
                <div className="text-right">
                    <div className="font-semibold text-white">
                        {new Intl.NumberFormat('fr-CD', {
                            style: 'currency',
                            currency: 'CDF',
                        }).format(row.original.total)}
                    </div>
                </div>
            ),
        },

        {
            accessorKey: 'statut',

            header: 'Statut',

            cell: ({ row }) => {
                const config = statusConfig(row.original.statut);

                return (
                    <Badge
                        variant="outline"
                        className={`rounded-full px-3 py-1 font-medium backdrop-blur-xl ${config.badge} `}
                    >
                        <span
                            className={`mr-2 h-2 w-2 rounded-full ${config.dot}`}
                        />

                        {config.label}
                    </Badge>
                );
            },

            filterFn: (row, id, value) =>
                String(row.getValue(id))
                    .toLowerCase()
                    .includes(String(value).toLowerCase()),
        },

        {
            accessorKey: 'date_commande',

            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                    className="h-auto p-0 font-medium text-slate-300 hover:bg-transparent hover:text-white"
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),

            cell: ({ row }) => (
                <div className="text-sm text-slate-400">
                    {new Date(row.original.date_commande).toLocaleDateString(
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
                            className="h-9 w-9 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="w-48 rounded-2xl border border-slate-800 bg-slate-950/95 backdrop-blur-2xl"
                    >
                        <DropdownMenuItem
                            onClick={() =>
                                window.open(row.original.url, '_blank')
                            }
                            className="cursor-pointer"
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            Voir
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() =>
                                window.open(
                                    `${row.original.url}/invoice`,
                                    '_blank',
                                )
                            }
                            className="cursor-pointer"
                        >
                            <FileText className="mr-2 h-4 w-4" />
                            Facture
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-slate-800" />

                        <DropdownMenuItem
                            className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-300"
                            onClick={() => {
                                if (confirm('Supprimer cette commande ?')) {
                                    router.delete(
                                        `/commandes/${row.original.id}`,
                                        {
                                            onSuccess: () =>
                                                toast.success(
                                                    'Commande supprimée',
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

        pageCount: initialCommandes.last_page,

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
        <Card className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/80 shadow-[0_10px_50px_-12px_rgba(15,23,42,0.10)] backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-950/70 dark:shadow-[0_10px_50px_-12px_rgba(0,0,0,0.6)]">
            {/* HEADER */}
            <CardHeader className="border-b border-slate-200/70 bg-linear-to-r from-white to-slate-50 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/10 bg-emerald-500/10 text-emerald-600 dark:border-emerald-500/20 dark:text-emerald-400">
                            <PackageCheck className="h-6 w-6" />
                        </div>

                        <div>
                            <CardTitle className="text-xl text-slate-900 dark:text-white">
                                Dernières commandes
                            </CardTitle>

                            <CardDescription className="mt-1 text-slate-500 dark:text-slate-400">
                                Historique récent des commandes clients
                            </CardDescription>
                        </div>
                    </div>

                    <Badge className="border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-emerald-700 dark:text-emerald-400">
                        {initialCommandes.total} commandes
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                {/* TOOLBAR */}
                <div className="flex flex-col gap-4 border-b border-slate-200/70 bg-slate-50/60 p-6 lg:flex-row lg:items-center dark:border-slate-800 dark:bg-slate-900/40">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

                        <Input
                            placeholder="Rechercher une commande..."
                            value={
                                (columnFilters.find((f) => f.id === 'client')
                                    ?.value as string) ?? ''
                            }
                            onChange={(e) =>
                                table
                                    .getColumn('client')
                                    ?.setFilterValue(e.target.value)
                            }
                            className="h-11 rounded-2xl border-slate-200 bg-white pl-11 text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:placeholder:text-slate-500"
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
                        <SelectTrigger className="h-11 w-full rounded-2xl border-slate-200 bg-white text-slate-700 lg:w-56 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                            <Filter className="mr-2 h-4 w-4 text-slate-400 dark:text-slate-500" />

                            <SelectValue placeholder="Tous les statuts" />
                        </SelectTrigger>

                        <SelectContent className="rounded-2xl border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                            <SelectItem value="all">
                                Tous les statuts
                            </SelectItem>

                            <SelectItem value="payee">Payée</SelectItem>

                            <SelectItem value="en_attente">
                                En attente
                            </SelectItem>

                            <SelectItem value="annulee">Annulée</SelectItem>

                            <SelectItem value="expediee">Expédiée</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="text-sm text-slate-500 dark:text-slate-400">
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
                                    className="border-slate-200/70 bg-slate-50/70 hover:bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900/40"
                                >
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className="h-14 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400"
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
                                        className="border-slate-200/60 transition-all hover:bg-slate-50/80 data-[state=selected]:bg-emerald-500/10 dark:border-slate-800/80 dark:hover:bg-slate-900/60"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="py-4 text-slate-700 dark:text-slate-300"
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
                                        className="h-40 text-center text-slate-500 dark:text-slate-400"
                                    >
                                        Aucune commande trouvée.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* FOOTER */}
                <div className="flex flex-col gap-4 border-t border-slate-200/70 bg-slate-50/60 px-6 py-4 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800 dark:bg-slate-900/40">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        {table.getFilteredSelectedRowModel().rows.length}{' '}
                        sélectionnée(s) sur{' '}
                        {table.getFilteredRowModel().rows.length}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="h-10 w-10 rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                            Page {table.getState().pagination.pageIndex + 1} /{' '}
                            {table.getPageCount()}
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="h-10 w-10 rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
