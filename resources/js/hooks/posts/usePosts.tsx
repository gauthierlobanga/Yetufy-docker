// resources/js/hooks/posts/usePosts.tsx
import { router } from '@inertiajs/react';
import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import type { Category } from '@/types/posts/category';
import type { Post, PostsResponse, PostFilters } from '@/types/posts/posts';

interface UsePostsOptions {
    initialPosts: PostsResponse;
    initialFilters: PostFilters;
    categories: Category[];
    statuses: Record<string, string>;
}

interface UsePostsReturn {
    // Données
    posts: Post[];
    pagination: {
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    filters: PostFilters;
    selectedPosts: number[];
    processing: boolean;
    statusColors: Record<string, string>;
    categories: Category[];

    // Actions
    updateFilters: (newFilters: Partial<PostFilters>) => void;
    changePage: (page: number) => void;
    deletePost: (postId: number) => Promise<void>;
    togglePin: (post: Post) => Promise<void>;
    duplicatePost: (post: Post) => Promise<void>;
    bulkDelete: () => Promise<void>;
    bulkStatus: (status: string) => Promise<void>;
    selectAll: () => void;
    selectPost: (postId: number) => void;
    clearSelection: () => void;
}

export function usePosts({
    initialPosts,
    initialFilters,
    categories,
    statuses,
}: UsePostsOptions): UsePostsReturn {
    const cleanFilters = useMemo(() => {
        const cleaned: PostFilters = {
            search: initialFilters.search,
            status: initialFilters.status,
            category_id: initialFilters.category_id,
            page: initialFilters.page,
        };

        // Ne garder sort que si c'est une chaîne valide
        if (initialFilters.sort && typeof initialFilters.sort === 'string') {
            cleaned.sort = initialFilters.sort;
        }

        // Ne garder direction que si c'est une chaîne valide
        if (
            initialFilters.direction &&
            (initialFilters.direction === 'asc' ||
                initialFilters.direction === 'desc')
        ) {
            cleaned.direction = initialFilters.direction;
        }

        return cleaned;
    }, [initialFilters]);

    const [postsData, setPostsData] = useState<PostsResponse>(initialPosts);
    // const [filters, setFilters] = useState<PostFilters>(initialFilters);
    const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
    const [processing, setProcessing] = useState(false);

    const [filters, setFilters] = useState<PostFilters>(cleanFilters);

    // Couleurs pour les statuts
    const statusColors: Record<string, string> = {
        draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        published:
            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        scheduled:
            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        archived:
            'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
        pending:
            'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    };

    // Pagination
    const pagination = useMemo(
        () => ({
            current_page: postsData.current_page,
            last_page: postsData.last_page,
            from: postsData.from || 0,
            to: postsData.to || 0,
            total: postsData.total,
        }),
        [postsData],
    );

    // Dans usePosts.tsx - mémoïser updateFilters
    const updateFilters = useCallback(
        (newFilters: Partial<PostFilters>) => {
            // Éviter les mises à jour inutiles si les filtres sont identiques
            const hasChanges = Object.entries(newFilters).some(
                ([key, value]) => {
                    return filters[key as keyof PostFilters] !== value;
                },
            );

            if (!hasChanges) {
                return;
            }

            setProcessing(true);
            const updatedFilters = { ...filters, ...newFilters };

            router.get(
                route('post.list'),
                { ...updatedFilters, page: 1 },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['posts', 'filters'],
                    onSuccess: (page) => {
                        const pageProps = page.props as unknown as {
                            posts: PostsResponse;
                            filters: PostFilters;
                        };
                        setPostsData(pageProps.posts);
                        setFilters(pageProps.filters);
                        setProcessing(false);
                        setSelectedPosts([]);
                    },
                    onError: () => {
                        setProcessing(false);
                        toast.error('Erreur lors du filtrage');
                    },
                },
            );
        },
        [filters],
    ); // Garder filters comme dépendance
    // Changer de page
    const changePage = useCallback(
        (page: number) => {
            setProcessing(true);

            router.get(
                route('post.list'),
                { ...filters, page },
                {
                    preserveState: true,
                    preserveScroll: true,
                    only: ['posts', 'filters'],
                    onSuccess: (page) => {
                        const pageProps = page.props as unknown as {
                            posts: PostsResponse;
                            filters: PostFilters;
                        };
                        setPostsData(pageProps.posts);
                        setProcessing(false);
                        setSelectedPosts([]);
                    },
                    onError: () => {
                        setProcessing(false);
                        toast.error('Erreur lors du chargement de la page');
                    },
                },
            );
        },
        [filters],
    );

    // Supprimer un post
    const deletePost = useCallback(async (postId: number) => {
        setProcessing(true);

        return new Promise<void>((resolve, reject) => {
            router.delete(route('post.destroy', postId), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    const pageProps = page.props as unknown as {
                        posts: PostsResponse;
                    };
                    setPostsData(pageProps.posts);
                    setSelectedPosts((prev) =>
                        prev.filter((id) => id !== postId),
                    );
                    setProcessing(false);
                    toast.success('Post supprimé avec succès');
                    resolve();
                },
                onError: (errors) => {
                    setProcessing(false);
                    console.error('Erreur suppression:', errors);
                    toast.error('Erreur lors de la suppression');
                    reject(errors);
                },
            });
        });
    }, []);

    // Épingler/Désépingler un post
    const togglePin = useCallback(async (post: Post) => {
        setProcessing(true);

        return new Promise<void>((resolve, reject) => {
            router.patch(
                route('post.toggle-pin', post.id),
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: (page) => {
                        const pageProps = page.props as unknown as {
                            posts: PostsResponse;
                        };
                        setPostsData(pageProps.posts);
                        setProcessing(false);
                        toast.success(
                            post.is_pinned ? 'Post désépinglé' : 'Post épinglé',
                        );
                        resolve();
                    },
                    onError: (errors) => {
                        setProcessing(false);
                        console.error('Erreur toggle pin:', errors);
                        toast.error("Erreur lors de l'opération");
                        reject(errors);
                    },
                },
            );
        });
    }, []);

    // Dupliquer un post
    const duplicatePost = useCallback(async (post: Post) => {
        setProcessing(true);

        return new Promise<void>((resolve, reject) => {
            router.post(
                route('post.duplicate', post.id),
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: (page) => {
                        const pageProps = page.props as unknown as {
                            posts: PostsResponse;
                        };
                        setPostsData(pageProps.posts);
                        setProcessing(false);
                        toast.success('Post dupliqué avec succès');
                        resolve();
                    },
                    onError: (errors) => {
                        setProcessing(false);
                        console.error('Erreur duplication:', errors);
                        toast.error('Erreur lors de la duplication');
                        reject(errors);
                    },
                },
            );
        });
    }, []);

    // Suppression en masse
    const bulkDelete = useCallback(async () => {
        if (selectedPosts.length === 0) {
            toast.warning('Aucun post sélectionné');
            return;
        }

        setProcessing(true);

        return new Promise<void>((resolve, reject) => {
            router.delete(route('post.bulk-destroy'), {
                data: { ids: selectedPosts },
                preserveState: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    const pageProps = page.props as unknown as {
                        posts: PostsResponse;
                    };
                    setPostsData(pageProps.posts);
                    setSelectedPosts([]);
                    setProcessing(false);
                    toast.success(
                        `${selectedPosts.length} post(s) supprimé(s)`,
                    );
                    resolve();
                },
                onError: (errors) => {
                    setProcessing(false);
                    console.error('Erreur suppression multiple:', errors);
                    toast.error('Erreur lors de la suppression multiple');
                    reject(errors);
                },
            });
        });
    }, [selectedPosts]);

    // Changement de statut en masse
    const bulkStatus = useCallback(
        async (status: string) => {
            if (selectedPosts.length === 0) {
                toast.warning('Aucun post sélectionné');
                return;
            }

            setProcessing(true);

            return new Promise<void>((resolve, reject) => {
                router.patch(
                    route('post.bulk-status'),
                    { ids: selectedPosts, status },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        onSuccess: (page) => {
                            const pageProps = page.props as unknown as {
                                posts: PostsResponse;
                            };
                            setPostsData(pageProps.posts);
                            setSelectedPosts([]);
                            setProcessing(false);
                            toast.success(
                                `Statut mis à jour pour ${selectedPosts.length} post(s)`,
                            );
                            resolve();
                        },
                        onError: (errors) => {
                            setProcessing(false);
                            console.error('Erreur mise à jour statut:', errors);
                            toast.error(
                                'Erreur lors de la mise à jour des statuts',
                            );
                            reject(errors);
                        },
                    },
                );
            });
        },
        [selectedPosts],
    );

    // Sélectionner tous les posts
    const selectAll = useCallback(() => {
        if (selectedPosts.length === postsData.data.length) {
            setSelectedPosts([]);
        } else {
            setSelectedPosts(postsData.data.map((post) => post.id));
        }
    }, [postsData.data, selectedPosts.length]);

    // Sélectionner un post individuel
    const selectPost = useCallback((postId: number) => {
        setSelectedPosts((prev) =>
            prev.includes(postId)
                ? prev.filter((id) => id !== postId)
                : [...prev, postId],
        );
    }, []);

    // Effacer la sélection
    const clearSelection = useCallback(() => {
        setSelectedPosts([]);
    }, []);

    return {
        // Données
        posts: postsData.data,
        pagination,
        filters,
        selectedPosts,
        processing,
        statusColors,
        categories,

        // Actions
        updateFilters,
        changePage,
        deletePost,
        togglePin,
        duplicatePost,
        bulkDelete,
        bulkStatus,
        selectAll,
        selectPost,
        clearSelection,
    };
}

// Export par défaut pour compatibilité
export default usePosts;
