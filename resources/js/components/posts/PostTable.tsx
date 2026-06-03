// resources/js/components/posts/PostTable.tsx
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    Eye,
    MoreHorizontal,
    Pencil,
    Trash2,
    Pin,
    Copy,
    Star,
    BadgeCheck,
} from 'lucide-react';
import React from 'react';
import { EmptyData } from '@/components/empty-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { Post } from '@/types/posts/posts';
import { TruncatedText } from '../ui/TruncatedText';

interface PostTableProps {
    posts: Post[];
    selectedPosts: number[];
    processing: boolean;
    statusColors: Record<string, string>;
    onSelectAll: () => void;
    onSelectPost: (id: number) => void;
    onDelete: (id: number) => void;
    onTogglePin: (post: Post) => void;
    onDuplicate: (post: Post) => void;
    onEdit: (post: Post) => void;
    pagination?: {
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    onPageChange?: (page: number) => void;
}

export function PostTable({
    posts,
    selectedPosts,
    processing,
    statusColors,
    onSelectAll,
    onSelectPost,
    onDelete,
    onTogglePin,
    onDuplicate,
    onEdit,
    pagination,
    onPageChange,
}: PostTableProps) {
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const renderPagination = () => {
        if (!pagination || pagination.last_page <= 1 || !onPageChange) {
            return null;
        }

        return (
            <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Affichage de {pagination.from || 0} à {pagination.to || 0}{' '}
                    sur {pagination.total || 0} résultats
                </div>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();

                                    if (pagination.current_page > 1) {
                                        onPageChange(
                                            pagination.current_page - 1,
                                        );
                                    }
                                }}
                                className={
                                    pagination.current_page === 1
                                        ? 'pointer-events-none opacity-50'
                                        : 'cursor-pointer'
                                }
                            />
                        </PaginationItem>

                        {Array.from(
                            { length: pagination.last_page },
                            (_, i) => i + 1,
                        ).map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    href="#"
                                    isActive={page === pagination.current_page}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onPageChange(page);
                                    }}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();

                                    if (
                                        pagination.current_page <
                                        pagination.last_page
                                    ) {
                                        onPageChange(
                                            pagination.current_page + 1,
                                        );
                                    }
                                }}
                                className={
                                    pagination.current_page ===
                                    pagination.last_page
                                        ? 'pointer-events-none opacity-50'
                                        : 'cursor-pointer'
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader className="text-base">
                        <TableRow>
                            <TableHead className="w-12">
                                <input
                                    type="checkbox"
                                    checked={
                                        selectedPosts.length === posts.length &&
                                        posts.length > 0
                                    }
                                    onChange={onSelectAll}
                                    disabled={processing}
                                    className="rounded border-gray-300"
                                />
                            </TableHead>
                            <TableHead className="w-75">Titre</TableHead>
                            <TableHead>Catégories</TableHead>
                            <TableHead>Auteur</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Épinglé</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Vues</TableHead>
                            <TableHead className="w-25">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={9}
                                    className="py-4 text-center"
                                >
                                    <EmptyData />
                                </TableCell>
                            </TableRow>
                        ) : (
                            posts.map((post) => (
                                <TableRow
                                    key={post.id}
                                    className={
                                        processing
                                            ? 'text-base opacity-50'
                                            : 'text-base'
                                    }
                                >
                                    <TableCell>
                                        <input
                                            type="checkbox"
                                            checked={selectedPosts.includes(
                                                post.id,
                                            )}
                                            onChange={() =>
                                                onSelectPost(post.id)
                                            }
                                            disabled={processing}
                                            className="rounded border-gray-300"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            {post.featured_image_thumb && (
                                                <img
                                                    src={
                                                        post.featured_image_thumb
                                                    }
                                                    alt={post.title}
                                                    className="h-10 w-10 rounded object-cover"
                                                />
                                            )}
                                            <div>
                                                <div className="flex items-center gap-1 font-medium">
                                                    {post.is_pinned && (
                                                        <Pin className="h-3 w-3 fill-current" />
                                                    )}
                                                    <Link
                                                        href={route(
                                                            'post.show',
                                                            post.slug,
                                                        )}
                                                        className="hover:underline"
                                                    >
                                                        <TruncatedText
                                                            text={post.title}
                                                            maxLength={20}
                                                            showTooltip={true}
                                                        />
                                                    </Link>
                                                </div>
                                                <div className="line-clamp-1 text-sm text-muted-foreground">
                                                    <TruncatedText
                                                        text={
                                                            typeof post.excerpt ===
                                                            'string'
                                                                ? post.excerpt
                                                                : post.title
                                                        }
                                                        maxLength={30}
                                                        showTooltip={true}
                                                        className="bg-transparent"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {post.categories?.map((cat) => (
                                                <Badge
                                                    key={cat.id}
                                                    variant="outline"
                                                    className="text-sm"
                                                    style={{
                                                        borderColor: cat.color,
                                                    }}
                                                >
                                                    {cat.nom}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                                <span className="text-sm font-medium">
                                                    {getInitials(
                                                        post.user?.name || 'U',
                                                    )}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="font-medium">
                                                    {post.user?.name}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {post.user?.email}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={
                                                statusColors[post.status]
                                            }
                                        >
                                            <BadgeCheck
                                                data-icon="inline-start"
                                                className="mr-1 h-4 w-4"
                                            />
                                            {post.status_label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {post.is_pinned ? (
                                            <Star className="h-5 w-5 text-yellow-600" />
                                        ) : (
                                            <Star className="h-5 w-5 text-gray-400" />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {post.created_at ? (
                                            <div>
                                                {format(
                                                    new Date(post.created_at),
                                                    'dd/MM/yyyy',
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">
                                                -
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="outline">
                                            <div className="flex items-center justify-end gap-1">
                                                <Eye className="h-4 w-4" />
                                                {post.views_count || 0}
                                            </div>
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    disabled={processing}
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onSelect={() =>
                                                        onEdit(post)
                                                    }
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Modifier
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={route(
                                                            'post.show',
                                                            post.slug,
                                                        )}
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Voir
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        onTogglePin(post)
                                                    }
                                                >
                                                    <Pin className="mr-2 h-4 w-4" />
                                                    {post.is_pinned
                                                        ? 'Désépingler'
                                                        : 'Épingler'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        onDuplicate(post)
                                                    }
                                                >
                                                    <Copy className="mr-2 h-4 w-4" />
                                                    Dupliquer
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        onDelete(post.id)
                                                    }
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            {renderPagination()}
        </div>
    );
}
