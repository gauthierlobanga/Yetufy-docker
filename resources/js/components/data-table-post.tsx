/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/components/data-table-post.tsx
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { router, usePage } from '@inertiajs/react';
import {
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconCircleCheckFilled,
    IconDotsVertical,
    IconGripVertical,
    IconLayoutColumns,
    IconLoader,
    IconPlus,
    IconTrendingUp,
} from '@tabler/icons-react';
import {
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import type {
    ColumnDef,
    ColumnFiltersState,
    Row,
    SortingState,
    VisibilityState,
} from '@tanstack/react-table';
import { useState, useCallback, useEffect } from 'react';
import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

// Types pour les données Post
interface Category {
    id: number;
    nom: string;
    slug: string;
    color: string | null;
}

interface User {
    id: number;
    name: string;
    email: string;
    avatar_url: string | null;
}

export interface Post {
    id: number;
    title: string;
    slug: string;
    status: 'draft' | 'published' | 'scheduled' | 'expired' | 'archived';
    status_label: string;
    status_color: string;
    views_count: number;
    likes_count: number;
    comments_count: number;
    user?: User;
    categories?: Category[];
    published_at: string | null;
    created_at: string;
    featured_image_url: string | null;
    excerpt: string | null;
    url: string;
}

interface DataTableProps {
    posts: {
        data: Post[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
        per_page: number;
    };
    filters?: {
        search?: string;
        status?: string;
    };
}

// Composant DragHandle
function DragHandle({ id }: { id: number }) {
    const { attributes, listeners } = useSortable({ id });

    return (
        <Button
            {...attributes}
            {...listeners}
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:bg-transparent"
        >
            <IconGripVertical className="size-3 text-muted-foreground" />
            <span className="sr-only">Drag to reorder</span>
        </Button>
    );
}

// Fonction de suppression
async function handleDelete(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
        router.delete(`/posts/${id}`, {
            onSuccess: () => {
                toast.success('Article supprimé avec succès');
            },
            onError: () => {
                toast.error('Erreur lors de la suppression');
            },
        });
    }
}

// Composant DraggableRow
function DraggableRow({ row }: { row: Row<Post> }) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: row.original.id,
    });

    return (
        <TableRow
            data-state={row.getIsSelected() && 'selected'}
            data-dragging={isDragging}
            ref={setNodeRef}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
            style={{
                transform: CSS.Transform.toString(transform),
                transition: transition,
            }}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    );
}

// Composant principal DataTable
export function DataTable({
    posts: initialPosts,
    filters = {},
}: DataTableProps) {
    // États pour les données locales
    const [data, setData] = useState(initialPosts.data);
    const [loading, setLoading] = useState(false);
    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        likes_count: false,
        comments_count: false,
    });
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState({
        pageIndex: (initialPosts.current_page || 1) - 1,
        pageSize: initialPosts.per_page || 10,
    });

    const sortableId = React.useId();
    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {}),
    );

    // Mettre à jour les données locales quand les props changent
    useEffect(() => {
        setData(initialPosts.data);
    }, [initialPosts.data]);

    // Gestion du changement de page
    const handlePaginationChange = (updater: any) => {
        const newPagination =
            typeof updater === 'function' ? updater(pagination) : updater;
        setPagination(newPagination);

        router.get(
            '/dashboard',
            {
                page: newPagination.pageIndex + 1,
                per_page: newPagination.pageSize,
                ...filters,
            },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['posts'],
            },
        );
    };

    // Gestion du tri
    const handleSortingChange = (updater: any) => {
        const newSorting =
            typeof updater === 'function' ? updater(sorting) : updater;
        setSorting(newSorting);

        if (newSorting.length > 0) {
            router.get(
                '/dashboard',
                {
                    sort: newSorting[0].id,
                    direction: newSorting[0].desc ? 'desc' : 'asc',
                    page: pagination.pageIndex + 1,
                    per_page: pagination.pageSize,
                    ...filters,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    only: ['posts'],
                },
            );
        }
    };

    const columns = React.useMemo<ColumnDef<Post>[]>(
        () => [
            {
                id: 'drag',
                header: () => null,
                cell: ({ row }) => <DragHandle id={row.original.id} />,
            },
            {
                id: 'select',
                header: ({ table }) => (
                    <div className="flex items-center justify-center">
                        <Checkbox
                            checked={
                                table.getIsAllPageRowsSelected() ||
                                (table.getIsSomePageRowsSelected() &&
                                    'indeterminate')
                            }
                            onCheckedChange={(value) =>
                                table.toggleAllPageRowsSelected(!!value)
                            }
                            aria-label="Select all"
                        />
                    </div>
                ),
                cell: ({ row }) => (
                    <div className="flex items-center justify-center">
                        <Checkbox
                            checked={row.getIsSelected()}
                            onCheckedChange={(value) =>
                                row.toggleSelected(!!value)
                            }
                            aria-label="Select row"
                        />
                    </div>
                ),
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: 'title',
                header: 'Titre',
                cell: ({ row }) => {
                    return <PostTableCellViewer post={row.original} />;
                },
                enableHiding: false,
            },
            {
                accessorKey: 'categories',
                header: 'Catégories',
                cell: ({ row }) => (
                    <div className="flex flex-wrap gap-1">
                        {row.original.categories?.slice(0, 2).map((cat) => (
                            <Badge
                                key={cat.id}
                                variant="outline"
                                className="px-1.5 text-muted-foreground"
                                style={
                                    cat.color
                                        ? {
                                              borderColor: cat.color,
                                              color: cat.color,
                                          }
                                        : {}
                                }
                            >
                                {cat.nom}
                            </Badge>
                        ))}
                        {row.original.categories &&
                            row.original.categories.length > 2 && (
                                <Badge variant="outline" className="px-1.5">
                                    +{row.original.categories.length - 2}
                                </Badge>
                            )}
                    </div>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Statut',
                cell: ({ row }) => (
                    <Badge
                        variant="outline"
                        className="px-1.5 text-muted-foreground"
                        style={{
                            backgroundColor:
                                row.original.status_color === 'green'
                                    ? 'rgba(34, 197, 94, 0.1)'
                                    : row.original.status_color === 'yellow'
                                      ? 'rgba(234, 179, 8, 0.1)'
                                      : row.original.status_color === 'red'
                                        ? 'rgba(239, 68, 68, 0.1)'
                                        : 'transparent',
                            borderColor:
                                row.original.status_color === 'green'
                                    ? '#22c55e'
                                    : row.original.status_color === 'yellow'
                                      ? '#eab308'
                                      : row.original.status_color === 'red'
                                        ? '#ef4444'
                                        : 'hsl(var(--border))',
                        }}
                    >
                        {row.original.status === 'published' ? (
                            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
                        ) : row.original.status === 'draft' ? (
                            <IconLoader />
                        ) : null}
                        {row.original.status_label}
                    </Badge>
                ),
            },
            {
                accessorKey: 'views_count',
                header: () => <div className="w-full text-right">Vues</div>,
                cell: ({ row }) => (
                    <div className="text-right font-medium tabular-nums">
                        {row.original.views_count.toLocaleString()}
                    </div>
                ),
            },
            {
                accessorKey: 'likes_count',
                header: () => <div className="w-full text-right">J'aime</div>,
                cell: ({ row }) => (
                    <div className="text-right font-medium tabular-nums">
                        {row.original.likes_count.toLocaleString()}
                    </div>
                ),
            },
            {
                accessorKey: 'comments_count',
                header: () => (
                    <div className="w-full text-right">Commentaires</div>
                ),
                cell: ({ row }) => (
                    <div className="text-right font-medium tabular-nums">
                        {row.original.comments_count.toLocaleString()}
                    </div>
                ),
            },
            {
                accessorKey: 'user',
                header: 'Auteur',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        {row.original.user?.avatar_url ? (
                            <img
                                src={row.original.user.avatar_url}
                                alt=""
                                className="size-6 rounded-full"
                            />
                        ) : (
                            <div className="flex size-6 items-center justify-center rounded-full bg-muted text-xs">
                                {row.original.user?.name?.charAt(0) || '?'}
                            </div>
                        )}
                        <span className="text-sm">
                            {row.original.user?.name || 'N/A'}
                        </span>
                    </div>
                ),
            },
            {
                accessorKey: 'published_at',
                header: 'Publié le',
                cell: ({ row }) => (
                    <div className="text-sm text-muted-foreground">
                        {row.original.published_at ||
                            row.original.created_at?.split('T')[0] ||
                            'Non publié'}
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
                                className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                                size="icon"
                            >
                                <IconDotsVertical />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem
                                onClick={() =>
                                    router.get(
                                        `/posts/${row.original.slug}/edit`,
                                    )
                                }
                            >
                                Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() =>
                                    navigator.clipboard.writeText(
                                        row.original.url,
                                    )
                                }
                            >
                                Copier le lien
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() =>
                                    router.post(
                                        `/posts/${row.original.id}/duplicate`,
                                    )
                                }
                            >
                                Dupliquer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() => handleDelete(row.original.id)}
                            >
                                Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            },
        ],
        [],
    );

    const table = useReactTable({
        data: data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
        },
        pageCount: initialPosts.last_page,
        manualPagination: true,
        manualSorting: true,
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: handleSortingChange,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: handlePaginationChange,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });

    const dataIds = React.useMemo<UniqueIdentifier[]>(
        () => data?.map(({ id }) => id) || [],
        [data],
    );

    // Gestion du drag & drop
    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active && over && active.id !== over.id) {
            const oldIndex = dataIds.indexOf(active.id);
            const newIndex = dataIds.indexOf(over.id);
            const newData = arrayMove(data, oldIndex, newIndex);

            // Mettre à jour l'état local immédiatement
            setData(newData);
            setLoading(true);

            // Envoyer la requête à Inertia
            router.post(
                '/posts/reorder',
                { ordered_ids: newData.map((p) => p.id) },
                {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => {
                        setLoading(false);
                        toast.success('Ordre mis à jour avec succès');
                    },
                    onError: () => {
                        setLoading(false);
                        toast.error("Erreur lors de la mise à jour de l'ordre");
                        // Revenir à l'ordre précédent en cas d'erreur
                        setData(initialPosts.data);
                    },
                },
            );
        }
    }

    if (!initialPosts || !initialPosts.data) {
        return (
            <div className="flex h-64 items-center justify-center">
                <IconLoader className="size-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">
                    Chargement des articles...
                </span>
            </div>
        );
    }

    return (
        <div className="relative">
            {loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50">
                    <IconLoader className="size-8 animate-spin text-primary" />
                </div>
            )}
            <Tabs
                defaultValue="outline"
                className="w-full flex-col justify-start gap-6"
            >
                <div className="flex items-center justify-between px-4 lg:px-6">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">Articles</h2>
                        <Badge variant="secondary">
                            {initialPosts.total} total
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <IconLayoutColumns />
                                    <span className="hidden lg:inline">
                                        Personnaliser
                                    </span>
                                    <IconChevronDown />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                {table
                                    .getAllColumns()
                                    .filter(
                                        (column) =>
                                            typeof column.accessorFn !==
                                                'undefined' &&
                                            column.getCanHide(),
                                    )
                                    .map((column) => {
                                        const columnLabels: Record<
                                            string,
                                            string
                                        > = {
                                            title: 'Titre',
                                            categories: 'Catégories',
                                            status: 'Statut',
                                            views_count: 'Vues',
                                            likes_count: "J'aime",
                                            comments_count: 'Commentaires',
                                            user: 'Auteur',
                                            published_at: 'Date',
                                        };

                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) =>
                                                    column.toggleVisibility(
                                                        !!value,
                                                    )
                                                }
                                            >
                                                {columnLabels[column.id] ||
                                                    column.id}
                                            </DropdownMenuCheckboxItem>
                                        );
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.get('/posts/create')}
                        >
                            <IconPlus />
                            <span className="hidden lg:inline">
                                Nouvel article
                            </span>
                        </Button>
                    </div>
                </div>
                <TabsContent
                    value="outline"
                    className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
                >
                    <div className="overflow-hidden rounded-lg border">
                        <DndContext
                            collisionDetection={closestCenter}
                            modifiers={[restrictToVerticalAxis]}
                            onDragEnd={handleDragEnd}
                            sensors={sensors}
                            id={sortableId}
                        >
                            <Table>
                                <TableHeader className="sticky top-0 z-10 bg-muted">
                                    {table
                                        .getHeaderGroups()
                                        .map((headerGroup) => (
                                            <TableRow key={headerGroup.id}>
                                                {headerGroup.headers.map(
                                                    (header) => {
                                                        return (
                                                            <TableHead
                                                                key={header.id}
                                                                colSpan={
                                                                    header.colSpan
                                                                }
                                                            >
                                                                {header.isPlaceholder
                                                                    ? null
                                                                    : flexRender(
                                                                          header
                                                                              .column
                                                                              .columnDef
                                                                              .header,
                                                                          header.getContext(),
                                                                      )}
                                                            </TableHead>
                                                        );
                                                    },
                                                )}
                                            </TableRow>
                                        ))}
                                </TableHeader>
                                <TableBody className="**:data-[slot=table-cell]:first:w-8">
                                    {table.getRowModel().rows?.length ? (
                                        <SortableContext
                                            items={dataIds}
                                            strategy={
                                                verticalListSortingStrategy
                                            }
                                        >
                                            {table
                                                .getRowModel()
                                                .rows.map((row) => (
                                                    <DraggableRow
                                                        key={row.id}
                                                        row={row}
                                                    />
                                                ))}
                                        </SortableContext>
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={columns.length}
                                                className="h-24 text-center"
                                            >
                                                Aucun article trouvé.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </DndContext>
                    </div>
                    <div className="flex items-center justify-between px-4">
                        <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
                            {table.getFilteredSelectedRowModel().rows.length}{' '}
                            sur {table.getFilteredRowModel().rows.length}{' '}
                            article(s) sélectionné(s).
                        </div>
                        <div className="flex w-full items-center gap-8 lg:w-fit">
                            <div className="hidden items-center gap-2 lg:flex">
                                <Label
                                    htmlFor="rows-per-page"
                                    className="text-sm font-medium"
                                >
                                    Lignes par page
                                </Label>
                                <Select
                                    value={`${table.getState().pagination.pageSize}`}
                                    onValueChange={(value) => {
                                        table.setPageSize(Number(value));
                                        router.get(
                                            '/dashboard',
                                            {
                                                per_page: Number(value),
                                                page: 1,
                                                ...filters,
                                            },
                                            {
                                                preserveState: true,
                                                only: ['posts'],
                                            },
                                        );
                                    }}
                                >
                                    <SelectTrigger
                                        size="sm"
                                        className="w-20"
                                        id="rows-per-page"
                                    >
                                        <SelectValue
                                            placeholder={
                                                table.getState().pagination
                                                    .pageSize
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent side="top">
                                        {[10, 20, 30, 50, 100].map(
                                            (pageSize) => (
                                                <SelectItem
                                                    key={pageSize}
                                                    value={`${pageSize}`}
                                                >
                                                    {pageSize}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex w-fit items-center justify-center text-sm font-medium">
                                Page {table.getState().pagination.pageIndex + 1}{' '}
                                sur {table.getPageCount()}
                            </div>
                            <div className="ml-auto flex items-center gap-2 lg:ml-0">
                                <Button
                                    variant="outline"
                                    className="hidden h-8 w-8 p-0 lg:flex"
                                    onClick={() => table.setPageIndex(0)}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    <span className="sr-only">
                                        Première page
                                    </span>
                                    <IconChevronsLeft />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="size-8"
                                    size="icon"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    <span className="sr-only">
                                        Page précédente
                                    </span>
                                    <IconChevronLeft />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="size-8"
                                    size="icon"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    <span className="sr-only">
                                        Page suivante
                                    </span>
                                    <IconChevronRight />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="hidden size-8 lg:flex"
                                    size="icon"
                                    onClick={() =>
                                        table.setPageIndex(
                                            table.getPageCount() - 1,
                                        )
                                    }
                                    disabled={!table.getCanNextPage()}
                                >
                                    <span className="sr-only">
                                        Dernière page
                                    </span>
                                    <IconChevronsRight />
                                </Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Graphique de données statiques pour la visualisation
const chartData = [
    { month: 'Jan', desktop: 186, mobile: 80 },
    { month: 'Fév', desktop: 305, mobile: 200 },
    { month: 'Mar', desktop: 237, mobile: 120 },
    { month: 'Avr', desktop: 73, mobile: 190 },
    { month: 'Mai', desktop: 209, mobile: 130 },
    { month: 'Juin', desktop: 214, mobile: 140 },
];

const chartConfig = {
    desktop: {
        label: 'Desktop',
        color: 'var(--primary)',
    },
    mobile: {
        label: 'Mobile',
        color: 'var(--primary)',
    },
} satisfies ChartConfig;

function PostTableCellViewer({ post }: { post: Post }) {
    const isMobile = useIsMobile();

    return (
        <Drawer direction={isMobile ? 'bottom' : 'right'}>
            <DrawerTrigger asChild>
                <Button
                    variant="link"
                    className="w-fit px-0 text-left font-medium text-foreground"
                >
                    {post.title.slice(0, 40)}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="gap-1">
                    <DrawerTitle>{post.title.slice(0, 40)}</DrawerTitle>
                    <DrawerDescription>
                        {post.excerpt?.slice(0, 40) ||
                            'Aucun extrait disponible'}
                    </DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                    {!isMobile && (
                        <>
                            <ChartContainer config={chartConfig}>
                                <AreaChart
                                    accessibilityLayer
                                    data={chartData}
                                    margin={{
                                        left: 0,
                                        right: 10,
                                    }}
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(value) => value}
                                        hide
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={
                                            <ChartTooltipContent indicator="dot" />
                                        }
                                    />
                                    <Area
                                        dataKey="mobile"
                                        type="natural"
                                        fill="var(--color-mobile)"
                                        fillOpacity={0.6}
                                        stroke="var(--color-mobile)"
                                        stackId="a"
                                    />
                                    <Area
                                        dataKey="desktop"
                                        type="natural"
                                        fill="var(--color-desktop)"
                                        fillOpacity={0.4}
                                        stroke="var(--color-desktop)"
                                        stackId="a"
                                    />
                                </AreaChart>
                            </ChartContainer>
                            <Separator />
                            <div className="grid gap-2">
                                <div className="flex gap-2 leading-none font-medium">
                                    Statistiques de l'article{' '}
                                    <IconTrendingUp className="size-4" />
                                </div>
                                <div className="text-muted-foreground">
                                    {post.views_count.toLocaleString()} vues •{' '}
                                    {post.likes_count.toLocaleString()} j'aime •{' '}
                                    {post.comments_count.toLocaleString()}{' '}
                                    commentaires
                                </div>
                            </div>
                            <Separator />
                        </>
                    )}
                    <form className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="title">Titre</Label>
                            <Input id="title" defaultValue={post.title} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="status">Statut</Label>
                                <Select defaultValue={post.status}>
                                    <SelectTrigger
                                        id="status"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Sélectionner un statut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">
                                            Brouillon
                                        </SelectItem>
                                        <SelectItem value="published">
                                            Publié
                                        </SelectItem>
                                        <SelectItem value="scheduled">
                                            Programmé
                                        </SelectItem>
                                        <SelectItem value="archived">
                                            Archivé
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="author">Auteur</Label>
                                <Input
                                    id="author"
                                    defaultValue={post.user?.name || 'N/A'}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="url">URL</Label>
                            <Input id="url" defaultValue={post.url} disabled />
                        </div>
                    </form>
                </div>
                <DrawerFooter>
                    <Button
                        onClick={() => router.get(`/posts/${post.slug}/edit`)}
                    >
                        Modifier
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Fermer</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
