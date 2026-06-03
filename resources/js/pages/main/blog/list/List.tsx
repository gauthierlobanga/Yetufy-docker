/* eslint-disable import/order */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import DOMPurify from 'dompurify';
import {
    Clock1Icon,
    EyeIcon,
    HeartIcon,
    MessageCircleIcon,
    SearchIcon,
    XIcon,
    BookOpenIcon,
    CalendarIcon,
    TrendingUpIcon,
    FilterIcon,
    SparklesIcon,
    Loader2Icon,
    RefreshCw,
} from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';

import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
// Import Swiper React components
import 'swiper/css';
import 'swiper/css/navigation';
import MainLayout from '@/layouts/main-layout';
import type { BreadcrumbItem } from '@/types';
import type { Category } from '@/types/posts/category';
import type { Post, PostsResponse } from '@/types/posts/posts';
import { AnimatedPostGrid } from './AnimatedPostGrid';
import tenant from '@/routes/tenant';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Blog',
        href: tenant.blog.index().url,
    },
];

interface Props {
    posts: PostsResponse;
    categories: {
        data: Category[];
    };
    tags?: Array<{
        id: number;
        name: string;
        slug: string;
        count?: number;
    }>;
    filters: {
        search?: string;
        tag?: string;
        category_id?: string;
        sort?: string;
        direction?: string;
        page?: number;
    };
}

const DEFAULT_SORT = 'published_at';
const DEFAULT_DIRECTION = 'desc';
const DEFAULT_SORT_VALUE = `${DEFAULT_SORT}:${DEFAULT_DIRECTION}`;

const sortOptions = [
    { value: 'published_at:desc', label: 'Plus récents', icon: TrendingUpIcon },
    { value: 'published_at:asc', label: 'Plus anciens', icon: TrendingUpIcon },
    { value: 'views_count:desc', label: 'Les plus vus', icon: EyeIcon },
    { value: 'likes_count:desc', label: 'Les plus aimés', icon: HeartIcon },
    {
        value: 'comments_count:desc',
        label: 'Les plus commentés',
        icon: MessageCircleIcon,
    },
    { value: 'title:asc', label: 'Titre A-Z', icon: BookOpenIcon },
    { value: 'title:desc', label: 'Titre Z-A', icon: BookOpenIcon },
];

type ProcessedPost = Post & {
    cleanExcerpt: string;
    formattedDate: string;
    readingTime: number;
};

export default function List({
    posts: initialPosts,
    categories,
    filters: initialFilters,
}: Props) {
    const cleanFilters = useCallback((filters: Props['filters']) => {
        return {
            search:
                filters.search && typeof filters.search === 'string'
                    ? filters.search
                    : '',
            tag:
                filters.tag && typeof filters.tag === 'string'
                    ? filters.tag
                    : filters.category_id &&
                        typeof filters.category_id === 'string'
                      ? filters.category_id
                      : 'all',
            sort:
                filters.sort && typeof filters.sort === 'string'
                    ? filters.sort
                    : DEFAULT_SORT,
            direction:
                filters.direction &&
                typeof filters.direction === 'string' &&
                (filters.direction === 'asc' || filters.direction === 'desc')
                    ? filters.direction
                    : DEFAULT_DIRECTION,
        };
    }, []);

    const cleanedFilters = cleanFilters(initialFilters);

    const [posts, setPosts] = useState<PostsResponse>(initialPosts);
    const [isChangingPage, setIsChangingPage] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const [searchTerm, setSearchTerm] = useState(() => {
        const search = cleanedFilters.search;

        return search && search.trim() !== '' ? search.trim() : '';
    });

    const [selectedCategory, setSelectedCategory] = useState(() => {
        return cleanedFilters.tag !== 'all' ? cleanedFilters.tag : 'all';
    });

    const [selectedSort, setSelectedSort] = useState(() => {
        const sort = cleanedFilters.sort;
        const direction = cleanedFilters.direction;

        if (sort === DEFAULT_SORT && direction === DEFAULT_DIRECTION) {
            return DEFAULT_SORT_VALUE;
        }

        return `${sort}:${direction}`;
    });

    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isNavigatingRef = useRef(false);
    const previousFiltersRef = useRef<string>('');

    useEffect(() => {
        setPosts(initialPosts);
        setIsChangingPage(false);
    }, [initialPosts]);

    const getPlainExcerpt = (
        excerpt: Record<string, unknown> | string | null | undefined,
        maxLength = 120,
    ): string => {
        if (!excerpt) {
            return '';
        }

        let text = '';

        if (typeof excerpt === 'string') {
            if (excerpt.trim().startsWith('{')) {
                try {
                    const parsed = JSON.parse(excerpt) as Record<
                        string,
                        unknown
                    >;
                    text = (parsed.html ||
                        parsed.content ||
                        parsed.text ||
                        excerpt) as string;
                } catch {
                    text = excerpt;
                }
            } else {
                text = excerpt;
            }
        } else if (typeof excerpt === 'object') {
            text = (excerpt.html ||
                excerpt.content ||
                excerpt.text ||
                JSON.stringify(excerpt)) as string;
        } else {
            text = String(excerpt);
        }

        const cleanText = DOMPurify.sanitize(text, {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: [],
        });

        if (cleanText.length > maxLength) {
            return cleanText.substring(0, maxLength) + '...';
        }

        return cleanText;
    };

    const processedPosts = useMemo<ProcessedPost[]>(() => {
        return posts.data.map((post) => ({
            ...post,
            cleanExcerpt: getPlainExcerpt(post.excerpt || post.content, 120),
            formattedDate: post.published_at
                ? format(new Date(post.published_at), 'dd MMMM yyyy', {
                      locale: fr,
                  })
                : 'Date non définie',
            readingTime:
                Math.ceil(
                    (post.content
                        ? JSON.stringify(post.content).length / 1000
                        : 0) / 200,
                ) || 3,
        }));
    }, [posts.data]);

    const buildFilterParams = useCallback(
        (
            overrides: {
                search?: string;
                category?: string;
                sort?: string;
                page?: number;
            } = {},
        ): Record<string, unknown> => {
            const params: Record<string, unknown> = {};

            const search =
                overrides.search !== undefined ? overrides.search : searchTerm;
            const category =
                overrides.category !== undefined
                    ? overrides.category
                    : selectedCategory;
            const sort =
                overrides.sort !== undefined ? overrides.sort : selectedSort;

            if (search && search.trim() !== '') {
                params.search = search.trim();
            }

            if (category !== 'all') {
                params.tag = category;
            }

            const [sortField, direction] = sort.split(':');

            if (sortField !== DEFAULT_SORT || direction !== DEFAULT_DIRECTION) {
                params.sort = sortField;
                params.direction = direction;
            }

            if (overrides.page && overrides.page > 1) {
                params.page = overrides.page;
            }

            return params;
        },
        [searchTerm, selectedCategory, selectedSort],
    );

    const applyFilters = useCallback(
        (params: Record<string, unknown>, isPageChange = false) => {
            const filterKey = JSON.stringify(params);

            if (filterKey === previousFiltersRef.current) {
                return;
            }

            if (isNavigatingRef.current) {
                return;
            }

            isNavigatingRef.current = true;

            if (isPageChange) {
                setIsChangingPage(true);
            }

            previousFiltersRef.current = filterKey;

            router.get(tenant.blog.index().url, params as any, {
                async: true,
                preserveState: true,
                preserveScroll: true,
                replace: true,
                showProgress: false,
                only: ['posts', 'filters'],
                onSuccess: (page) => {
                    const pageProps = page.props as unknown as {
                        posts: PostsResponse;
                        filters: Props['filters'];
                    };
                    setPosts(pageProps.posts);
                    setIsChangingPage(false);
                    isNavigatingRef.current = false;
                },
                onError: () => {
                    setIsChangingPage(false);
                    isNavigatingRef.current = false;
                },
            });
        },
        [],
    );

    const handleSearchChange = useCallback(
        (value: string) => {
            setSearchTerm(value);

            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }

            if (value.trim() === '') {
                const params = buildFilterParams({ search: '', page: 1 });
                applyFilters(params, false);
                setIsSearching(false);

                return;
            }

            setIsSearching(true);

            searchTimeoutRef.current = setTimeout(() => {
                const params = buildFilterParams({ search: value, page: 1 });
                applyFilters(params, false);
                setIsSearching(false);
            }, 500);
        },
        [buildFilterParams, applyFilters],
    );

    const handleSearchKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                if (searchTimeoutRef.current) {
                    clearTimeout(searchTimeoutRef.current);
                }

                const params = buildFilterParams({
                    search: searchTerm,
                    page: 1,
                });
                applyFilters(params, false);
                setIsSearching(false);
                searchInputRef.current?.blur();
            } else if (e.key === 'Escape') {
                setSearchTerm('');

                if (searchTimeoutRef.current) {
                    clearTimeout(searchTimeoutRef.current);
                }

                const params = buildFilterParams({ search: '', page: 1 });
                applyFilters(params, false);
                setIsSearching(false);
                searchInputRef.current?.blur();
            }
        },
        [buildFilterParams, applyFilters, searchTerm],
    );

    const handleClearSearch = useCallback(() => {
        setSearchTerm('');

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        const params = buildFilterParams({ search: '', page: 1 });
        applyFilters(params, false);
        setIsSearching(false);
        searchInputRef.current?.focus();
    }, [buildFilterParams, applyFilters]);

    const handleCategoryChange = useCallback(
        (value: string) => {
            setSelectedCategory(value);
            const params = buildFilterParams({ category: value, page: 1 });
            applyFilters(params, false);
        },
        [buildFilterParams, applyFilters],
    );

    const handleSortChange = useCallback(
        (value: string) => {
            setSelectedSort(value);
            const params = buildFilterParams({ sort: value, page: 1 });
            applyFilters(params, false);
        },
        [buildFilterParams, applyFilters],
    );

    const handlePageChange = useCallback(
        (page: number) => {
            if (page === posts.current_page) {
                return;
            }

            const params = buildFilterParams({ page });
            applyFilters(params, true);
        },
        [posts.current_page, buildFilterParams, applyFilters],
    );

    const clearFilters = useCallback(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        setSearchTerm('');
        setSelectedCategory('all');
        setSelectedSort(DEFAULT_SORT_VALUE);

        applyFilters({}, false);
    }, [applyFilters]);

    const hasActiveFilters = useMemo(() => {
        const hasSearch = searchTerm.trim() !== '';
        const hasCategory = selectedCategory !== 'all';
        const hasCustomSort = selectedSort !== DEFAULT_SORT_VALUE;

        return hasSearch || hasCategory || hasCustomSort;
    }, [searchTerm, selectedCategory, selectedSort]);

    const activeSortLabel = useMemo(() => {
        const found = sortOptions.find((opt) => opt.value === selectedSort);

        return found?.label || 'Plus récents';
    }, [selectedSort]);

    useEffect(() => {
        const urlSearch = initialFilters.search || '';
        const urlCategory =
            initialFilters.tag || initialFilters.category_id || 'all';
        const urlSort = initialFilters.sort || DEFAULT_SORT;
        const urlDirection = initialFilters.direction || DEFAULT_DIRECTION;
        const urlSortValue = `${urlSort}:${urlDirection}`;

        if (urlSearch !== searchTerm) {
            setSearchTerm(urlSearch);
        }

        if (urlCategory !== selectedCategory) {
            setSelectedCategory(urlCategory);
        }

        if (urlSortValue !== selectedSort) {
            setSelectedSort(urlSortValue);
        }
    }, [initialFilters, searchTerm, selectedCategory, selectedSort]);

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    const PostCard = ({ post }: { post: ProcessedPost }) => (
        <Link
            href={tenant.blog.show(post.slug).url}
            className="group block h-full"
        >
            <Card className="h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
                {/* Image */}
                <div className="relative overflow-hidden">
                    {post.featured_image_url ? (
                        <>
                            <img
                                src={post.featured_image_url}
                                className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                        </>
                    ) : (
                        <div className="flex h-52 items-center justify-center bg-linear-to-br from-primary/10 to-muted">
                            <BookOpenIcon className="h-10 w-10 text-primary/40" />
                        </div>
                    )}

                    {/* reading time */}
                    <div className="absolute right-3 bottom-3">
                        <Badge className="bg-black/50 text-white backdrop-blur">
                            {post.readingTime} min
                        </Badge>
                    </div>
                </div>

                {/* Content */}
                <CardContent className="space-y-4 p-5">
                    <h3 className="line-clamp-2 text-lg font-semibold transition group-hover:text-primary">
                        {post.title}
                    </h3>

                    <p className="line-clamp-3 text-sm text-muted-foreground">
                        {post.cleanExcerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{post.formattedDate}</span>

                        <div className="flex gap-3">
                            <span className="flex items-center gap-1">
                                <EyeIcon className="h-3 w-3" />
                                {post.views_count}
                            </span>
                            <span className="flex items-center gap-1">
                                <HeartIcon className="h-3 w-3" />
                                {post.likes_count}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <Avatar className="h-7 w-7">
                            <AvatarImage src={post.user?.avatar_url} />
                            <AvatarFallback>
                                {post.user?.name?.[0]}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{post.user?.name}</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title="Blog " />

            <section className="relative overflow-hidden py-18">
                {/* Background premium */}
                <div className="absolute inset-0 bg-linear-to-b from-primary/10 via-transparent to-transparent" />
                <div className="absolute inset-0 backdrop-blur-[2px]" />

                {/* Glow effects */}
                <div className="absolute -top-32 left-1/2 h-100 w-100 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-75 w-75 bg-secondary/20 blur-3xl" />

                <div className="relative mx-auto max-w-6xl px-4 text-center">
                    <Badge className="mb-6 border border-white/20 bg-white/10 px-4 py-1.5 text-sm backdrop-blur">
                        <SparklesIcon className="mr-2 h-4 w-4" />
                        Blog & Insights
                    </Badge>

                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                        Explorez des contenus
                        <span className="block bg-linear-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
                            inspirants & modernes
                        </span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                        Découvrez des articles de qualité sur le développement,
                        l’e-commerce et les technologies modernes.
                    </p>

                    {/* SEARCH PREMIUM */}
                    <div className="mx-auto mt-10 max-w-xl">
                        <div className="group relative">
                            <div className="absolute inset-0 rounded-full bg-linear-to-r from-primary/20 to-secondary/20 opacity-0 blur transition group-focus-within:opacity-100" />

                            <div className="relative">
                                <Input
                                    ref={searchInputRef}
                                    value={searchTerm}
                                    onChange={(e) =>
                                        handleSearchChange(e.target.value)
                                    }
                                    onKeyDown={handleSearchKeyDown}
                                    placeholder="Rechercher un article..."
                                    className="h-14 rounded-full border border-white/20 bg-white/10 pr-12 pl-12 text-base shadow-xl backdrop-blur focus:ring-2 focus:ring-primary/30"
                                />

                                <SearchIcon className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                                {searchTerm && (
                                    <button
                                        onClick={handleClearSearch}
                                        className="absolute top-1/2 right-4 -translate-y-1/2"
                                    >
                                        <XIcon className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-8">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                        {/* <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
                                <div className="flex items-center gap-2">
                                    <FilterIcon className="h-6 w-6 text-muted-foreground" />
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Filtres :
                                    </span>
                                </div>

                                <div className="relative w-full lg:w-auto">
                                    <Carousel
                                        opts={{
                                            align: 'start',
                                            dragFree: true,
                                            containScroll: 'trimSnaps',
                                        }}
                                        className="w-full lg:max-w-2xl"
                                    >
                                        <CarouselContent className="-ml-2 py-1">
                                            <CarouselItem className="basis-auto pl-2">
                                                <Badge
                                                    variant={
                                                        selectedCategory ===
                                                        'all'
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                    className="cursor-pointer gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-md"
                                                    onClick={() =>
                                                        handleCategoryChange(
                                                            'all',
                                                        )
                                                    }
                                                >
                                                    Tous
                                                </Badge>
                                            </CarouselItem>

                                            {categories.data.map((category) => (
                                                <CarouselItem
                                                    key={category.id}
                                                    className="basis-auto pl-2"
                                                >
                                                    <Badge
                                                        variant={
                                                            selectedCategory ===
                                                            category.slug
                                                                ? 'default'
                                                                : 'outline'
                                                        }
                                                        className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-md"
                                                        style={{
                                                            backgroundColor:
                                                                selectedCategory ===
                                                                category.slug
                                                                    ? category.color ||
                                                                      undefined
                                                                    : undefined,
                                                            borderColor:
                                                                category.color ||
                                                                undefined,
                                                        }}
                                                        onClick={() =>
                                                            handleCategoryChange(
                                                                category.slug,
                                                            )
                                                        }
                                                    >
                                                        {category.nom}
                                                    </Badge>
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        <CarouselPrevious className="absolute top-1/2 -left-4 h-8 w-8 -translate-y-1/2 rounded-full border-0 bg-background/80 shadow-md backdrop-blur-sm hover:bg-background" />
                                        <CarouselNext className="absolute top-1/2 -right-4 h-8 w-8 -translate-y-1/2 rounded-full border-0 bg-background/80 shadow-md backdrop-blur-sm hover:bg-background" />
                                    </Carousel>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Select
                                    value={selectedSort}
                                    onValueChange={handleSortChange}
                                >
                                    <SelectTrigger className="h-9 w-44 rounded-full border-border/50 text-sm">
                                        <SelectValue>
                                            {activeSortLabel}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sortOptions.map((option) => {
                                            const IconComponent = option.icon;

                                            return (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <IconComponent className="h-3.5 w-3.5" />
                                                        {option.label}
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>

                                {hasActiveFilters && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearFilters}
                                        className="h-9 cursor-pointer gap-1.5 rounded-full text-sm transition-all hover:bg-destructive/10 hover:text-destructive"
                                    >
                                        <RefreshCw className="h-5 w-5" />
                                    </Button>
                                )}
                            </div>
                        </div> */}
                        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            {/* Filtre par catégories avec Slider Swiper natif */}
                            <div className="flex w-full items-center gap-3 sm:w-auto">
                                <FilterIcon className="h-5 w-5 shrink-0 text-muted-foreground" />
                                <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
                                    Filtres :
                                </span>

                                <div className="relative w-full sm:max-w-2xl">
                                    <Swiper
                                        modules={[Navigation]}
                                        spaceBetween={8}
                                        slidesPerView="auto"
                                        freeMode={true}
                                        navigation={{
                                            prevEl: '.custom-prev',
                                            nextEl: '.custom-next',
                                        }}
                                        className="flex items-center"
                                    >
                                        <SwiperSlide className="w-auto!">
                                            <Badge
                                                variant={
                                                    selectedCategory === 'all'
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium shadow-sm transition-all hover:scale-105 hover:shadow-md"
                                                onClick={() =>
                                                    handleCategoryChange('all')
                                                }
                                            >
                                                Tous
                                            </Badge>
                                        </SwiperSlide>

                                        {categories.data.map((category) => (
                                            <SwiperSlide
                                                key={category.id}
                                                className="w-auto!"
                                            >
                                                <Badge
                                                    variant={
                                                        selectedCategory ===
                                                        category.slug
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                    className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium shadow-sm transition-all hover:scale-105 hover:shadow-md"
                                                    style={
                                                        selectedCategory ===
                                                        category.slug
                                                            ? {
                                                                  backgroundColor:
                                                                      category.color ||
                                                                      undefined,
                                                              }
                                                            : {
                                                                  borderColor:
                                                                      category.color ||
                                                                      undefined,
                                                                  color:
                                                                      category.color ||
                                                                      undefined,
                                                              }
                                                    }
                                                    onClick={() =>
                                                        handleCategoryChange(
                                                            category.slug,
                                                        )
                                                    }
                                                >
                                                    {category.nom}
                                                </Badge>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>

                                    {/* Flèches de navigation personnalisées */}
                                    <button className="custom-prev absolute top-1/2 -left-3 z-10 -translate-y-1/2 rounded-full border-0 bg-white/80 p-1 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg dark:bg-black/30 dark:hover:bg-black/50">
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <button className="custom-next absolute top-1/2 -right-3 z-10 -translate-y-1/2 rounded-full border-0 bg-white/80 p-1 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg dark:bg-black/30 dark:hover:bg-black/50">
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Tri + Réinitialisation */}
                            <div className="flex items-center gap-3">
                                <Select
                                    value={selectedSort}
                                    onValueChange={handleSortChange}
                                >
                                    <SelectTrigger className="h-9 w-44 rounded-full border border-border/50 bg-white/50 text-sm backdrop-blur-sm transition-all hover:border-primary hover:shadow-md dark:bg-black/20">
                                        <SelectValue>
                                            {activeSortLabel}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sortOptions.map((option) => {
                                            const IconComponent = option.icon;

                                            return (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <IconComponent className="h-3.5 w-3.5" />
                                                        {option.label}
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>

                                {hasActiveFilters && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearFilters}
                                        className="h-9 cursor-pointer gap-1.5 rounded-full text-sm transition-all hover:bg-destructive/10 hover:text-destructive"
                                    >
                                        <RefreshCw className="h-5 w-5" />
                                        <span className="hidden sm:inline">
                                            Réinitialiser
                                        </span>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">
                                {posts.total || 0}
                            </span>
                            {posts.total > 1 ? ' articles' : ' article'}
                        </p>

                        {isChangingPage && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                <span>Chargement...</span>
                            </div>
                        )}
                    </div>

                    {processedPosts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="rounded-full bg-muted p-6">
                                <BookOpenIcon className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <h3 className="mt-4 text-xl font-semibold">
                                Aucun article trouvé
                            </h3>
                            <p className="mt-2 text-muted-foreground">
                                Essayez de modifier vos filtres ou revenez plus
                                tard.
                            </p>
                            {hasActiveFilters && (
                                <Button
                                    variant="outline"
                                    className="mt-6 rounded-full"
                                    onClick={clearFilters}
                                >
                                    Réinitialiser les filtres
                                </Button>
                            )}
                        </div>
                    ) : (
                        <AnimatedPostGrid
                            posts={processedPosts}
                            renderItem={(post) => <PostCard post={post} />}
                        />
                    )}

                    {posts.last_page > 1 && (
                        <Pagination className="mt-12">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();

                                            if (posts.current_page > 1) {
                                                handlePageChange(
                                                    posts.current_page - 1,
                                                );
                                            }
                                        }}
                                        className={
                                            posts.current_page === 1
                                                ? 'pointer-events-none opacity-50'
                                                : 'cursor-pointer rounded-full transition-all hover:bg-primary/10'
                                        }
                                    />
                                </PaginationItem>

                                {Array.from(
                                    { length: Math.min(5, posts.last_page) },
                                    (_, i) => {
                                        let pageNum;

                                        if (posts.last_page <= 5) {
                                            pageNum = i + 1;
                                        } else if (posts.current_page <= 3) {
                                            pageNum = i + 1;
                                        } else if (
                                            posts.current_page >=
                                            posts.last_page - 2
                                        ) {
                                            pageNum = posts.last_page - 4 + i;
                                        } else {
                                            pageNum =
                                                posts.current_page - 2 + i;
                                        }

                                        return (
                                            <PaginationItem key={pageNum}>
                                                <PaginationLink
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handlePageChange(
                                                            pageNum,
                                                        );
                                                    }}
                                                    isActive={
                                                        posts.current_page ===
                                                        pageNum
                                                    }
                                                    className="rounded-full transition-all hover:bg-primary/10"
                                                >
                                                    {pageNum}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    },
                                )}

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();

                                            if (
                                                posts.current_page <
                                                posts.last_page
                                            ) {
                                                handlePageChange(
                                                    posts.current_page + 1,
                                                );
                                            }
                                        }}
                                        className={
                                            posts.current_page ===
                                            posts.last_page
                                                ? 'pointer-events-none opacity-50'
                                                : 'cursor-pointer rounded-full transition-all hover:bg-primary/10'
                                        }
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </div>
            </section>

            <style>{`
                .bg-grid-pattern {
                    background-image: radial-gradient(circle, currentColor 1px, transparent 1px);
                    background-size: 40px 40px;
                }
            `}</style>
        </MainLayout>
    );
}
