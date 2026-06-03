/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
    Calendar,
    Clock,
    Eye,
    User,
    ArrowLeft,
    ArrowRight,
    Share2,
    Bookmark,
    Heart,
    MessageCircle,
    Tag,
    Folder,
    List,
    ArrowUp,
    Hash,
    Heading1,
    Heading2,
    Heading3,
    ChevronRight,
    Sparkles,
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useInitials } from '@/hooks/use-initials';
import NewsletterSection from '@/layouts/app/app-newsletters-footer';
import MainLayout from '@/layouts/main-layout';
import { home } from '@/routes';
import blog from '@/routes/tenant/blog';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import type { Post, RelatedPost } from '@/types/posts/posts';

interface Props {
    post: { data: Post };
    previousPost: Post | null;
    nextPost: Post | null;
    relatedPosts: RelatedPost[];
}

// Icône selon le niveau de titre
const HeadingIcon = ({ level }: { level: number }) => {
    switch (level) {
        case 1:
            return <Heading1 className="h-3.5 w-3.5" />;
        case 2:
            return <Heading2 className="h-3.5 w-3.5" />;
        case 3:
            return <Heading3 className="h-3.5 w-3.5" />;
        default:
            return <Hash className="h-3.5 w-3.5" />;
    }
};

// Table des matières moderne
const TableOfContents = ({ content }: { content: string }) => {
    const [headings, setHeadings] = useState<
        Array<{ id: string; text: string; level: number }>
    >([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        if (!content) {
            return;
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const headingElements = tempDiv.querySelectorAll('h1, h2, h3');
        const generatedHeadings = Array.from(headingElements).map(
            (el, index) => {
                const text = el.textContent || '';
                const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

                return { id, text, level: parseInt(el.tagName[1]) };
            },
        );
        setHeadings(generatedHeadings);

        const observer = new IntersectionObserver(
            (entries) =>
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                }),
            { rootMargin: '-100px 0px -66%', threshold: 0.3 },
        );

        setTimeout(() => {
            const realHeadings = document.querySelectorAll(
                '.prose h1, .prose h2, .prose h3',
            );
            realHeadings.forEach((el, index) => {
                const generatedId = generatedHeadings[index]?.id;

                if (generatedId) {
                    el.id = generatedId;
                    observer.observe(el);
                }
            });
        }, 200);

        return () => observer.disconnect();
    }, [content]);

    if (headings.length === 0) {
        return null;
    }

    return (
        <div className="rounded-2xl border border-emerald-100 bg-white/80 shadow-sm backdrop-blur-sm dark:border-emerald-900/40 dark:bg-slate-900/80">
            <div className="border-b border-emerald-50 p-4 dark:border-emerald-900/20">
                <div className="flex items-center gap-2">
                    <List className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        Table des matières
                    </h3>
                </div>
            </div>
            <nav className="p-4">
                <ul className="space-y-1">
                    {headings.map((heading) => (
                        <li key={heading.id}>
                            <a
                                href={`#${heading.id}`}
                                className={`group -mx-2 flex items-start gap-2 rounded-md px-2 py-1.5 text-xs transition-all duration-200 ${
                                    activeId === heading.id
                                        ? 'bg-emerald-50 font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-600 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-emerald-400'
                                }`}
                                style={{
                                    paddingLeft: `${(heading.level - 1) * 12 + 8}px`,
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    const element = document.getElementById(
                                        heading.id,
                                    );

                                    if (element) {
                                        const offset = 80;
                                        const elementPosition =
                                            element.getBoundingClientRect().top;
                                        const offsetPosition =
                                            elementPosition +
                                            window.scrollY -
                                            offset;
                                        window.scrollTo({
                                            top: offsetPosition,
                                            behavior: 'smooth',
                                        });
                                    }
                                }}
                            >
                                <span
                                    className={`mt-0.5 shrink-0 ${
                                        activeId === heading.id
                                            ? 'text-emerald-600 dark:text-emerald-400'
                                            : 'text-slate-400 dark:text-slate-500'
                                    }`}
                                >
                                    <HeadingIcon level={heading.level} />
                                </span>
                                <span className="line-clamp-2">
                                    {heading.text}
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

// Barre de progression émeraude
const ReadingProgressBar = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight =
                document.documentElement.scrollHeight - window.innerHeight;
            setProgress((scrollTop / docHeight) * 100);
        };
        window.addEventListener('scroll', updateProgress);

        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    return (
        <div className="fixed top-0 right-0 left-0 z-50 h-0.5 bg-slate-200 dark:bg-slate-800">
            <div
                className="h-full bg-linear-to-r from-emerald-400 to-emerald-600 shadow-sm transition-all duration-150"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

// Bouton retour en haut
const ScrollToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => setVisible(window.scrollY > 500);
        window.addEventListener('scroll', toggleVisibility);

        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    if (!visible) {
        return null;
    }

    return (
        <Button
            className="fixed right-6 bottom-6 z-50 h-10 w-10 rounded-full border border-slate-200 bg-white text-slate-600 shadow-lg transition-all hover:bg-emerald-50 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            size="icon"
        >
            <ArrowUp className="h-4 w-4" />
        </Button>
    );
};

// Composant contenu riche avec style amélioré
const RichContentText = ({ content }: { content: string }) => {
    return (
        <div
            className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-h1:mt-4 prose-h1:mb-4 prose-h1:text-2xl prose-h1:text-slate-900 dark:prose-h1:text-white prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-emerald-100 prose-h2:pb-2 prose-h2:text-xl dark:prose-h2:border-emerald-900/40 prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-lg prose-h3:text-slate-800 dark:prose-h3:text-slate-200 prose-p:mt-3 prose-p:mb-3 prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-emerald-400 prose-blockquote:my-6 prose-blockquote:rounded-r-lg prose-blockquote:border-l-4 prose-blockquote:border-emerald-400 prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:pl-4 prose-blockquote:text-slate-600 prose-blockquote:italic dark:prose-blockquote:border-emerald-600 dark:prose-blockquote:bg-slate-900/30 dark:prose-blockquote:text-slate-300 prose-code:rounded-md prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:text-emerald-700 dark:prose-code:bg-slate-800 dark:prose-code:text-emerald-400 prose-pre:my-6 prose-pre:rounded-xl prose-pre:border prose-pre:border-slate-200 prose-pre:bg-slate-50 dark:prose-pre:border-slate-800 dark:prose-pre:bg-slate-900/60 prose-li:text-slate-600 dark:prose-li:text-slate-300 prose-img:rounded-xl prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
};

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);

    if (match) {
        return decodeURIComponent(match[1]);
    }

    const meta = document.querySelector('meta[name="csrf-token"]');

    return meta?.getAttribute('content') ?? '';
}

// Composant principal
export default function Show({
    post,
    previousPost,
    nextPost,
    relatedPosts,
}: Props) {
    const getInitials = useInitials();
    const [isLiked, setIsLiked] = useState(post.data.is_liked ?? false);
    const [isBookmarked, setIsBookmarked] = useState(
        post.data.is_bookmarked ?? false,
    );
    const [likesCount, setLikesCount] = useState(post.data.likes_count || 0);
    const [bookmarksCount, setBookmarksCount] = useState(
        post.data.bookmarks_count || 0,
    );
    const [showMobileToc, setShowMobileToc] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    if (!post?.data) {
        return (
            <MainLayout breadcrumbs={[]}>
                <div className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                        Article non trouvé
                    </h1>
                </div>
            </MainLayout>
        );
    }

    const readingTime =
        post.data.reading_time_minutes ||
        Math.ceil((post.data.content?.length || 0) / 1500);

    const breadcrumbs: BreadcrumbItemType[] = [
        { title: 'Accueil', href: home() },
        { title: 'Blog', href: blog.index().url },
        { title: post.data.title, href: blog.show(post.data.slug) },
    ];

    const handleLike = async () => {
        /* ... identique ... */
    };
    const handleBookmark = async () => {
        /* ... identique ... */
    };
    const handleShare = async () => {
        /* ... identique ... */
    };

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title={post.data.title}>{/* ... meta identiques ... */}</Head>

            <ReadingProgressBar />
            <ScrollToTop />

            <article className="min-h-screen bg-linear-to-b from-white via-emerald-50/30 to-slate-50/50 dark:from-slate-950 dark:via-emerald-950/10 dark:to-slate-950">
                {/* Hero section avec fond émeraude léger */}
                <div className="relative overflow-hidden border-b border-emerald-100 bg-linear-to-br from-white via-emerald-50/50 to-slate-50 dark:border-emerald-900/30 dark:from-slate-950 dark:via-emerald-950/20 dark:to-slate-950">
                    {/* Décoration d'arrière-plan */}
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-500/10" />
                        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-slate-200/30 blur-3xl dark:bg-slate-700/10" />
                    </div>

                    <div className="relative container mx-auto max-w-6xl px-4 py-12 md:py-16">
                        {post.data.categories &&
                            post.data.categories.length > 0 && (
                                <div className="mb-4 flex flex-wrap gap-2">
                                    {post.data.categories.map((category) => (
                                        <Link
                                            key={category.id}
                                            href={
                                                blog.index({
                                                    query: {
                                                        tag: category.slug,
                                                    },
                                                }).url
                                            }
                                            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-xs font-medium text-emerald-700 backdrop-blur-sm transition-all hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-slate-900/80 dark:text-emerald-400 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30"
                                        >
                                            <Folder className="h-3 w-3" />
                                            {category.nom}
                                        </Link>
                                    ))}
                                </div>
                            )}

                        <h1 className="mb-6 max-w-4xl text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl dark:text-white">
                            {post.data.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                            {post.data.user && (
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8 ring-2 ring-white dark:ring-slate-800">
                                        {post.data.user.avatar_url ? (
                                            <AvatarImage
                                                src={post.data.user.avatar_url}
                                                alt={post.data.user.name}
                                            />
                                        ) : (
                                            <AvatarFallback className="bg-emerald-100 text-xs text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                                                {getInitials(
                                                    post.data.user.name,
                                                )}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <span className="font-medium text-slate-700 dark:text-slate-300">
                                        {post.data.user.name}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4 text-emerald-500" />
                                <span>
                                    {post.data.published_at
                                        ? format(
                                              new Date(post.data.published_at),
                                              'PP',
                                              { locale: fr },
                                          )
                                        : ''}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4 text-emerald-500" />
                                <span>{readingTime} min de lecture</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Eye className="h-4 w-4 text-emerald-500" />
                                <span>{post.data.views_count} vues</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image à la une */}
                {post.data.featured_image_url && (
                    <div className="relative z-10 container mx-auto -mt-4 max-w-6xl px-4 md:-mt-8">
                        <div className="overflow-hidden rounded-2xl border border-white/50 shadow-xl shadow-emerald-500/10 dark:border-slate-800/50 dark:shadow-emerald-500/5">
                            <img
                                src={post.data.featured_image_url}
                                alt={post.data.title}
                                className="h-64 w-full object-cover md:h-96"
                                loading="lazy"
                            />
                        </div>
                    </div>
                )}

                {/* Layout deux colonnes */}
                <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
                    <div className="mb-6 lg:hidden">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                            onClick={() => setShowMobileToc(!showMobileToc)}
                        >
                            <List className="mr-2 h-4 w-4" />
                            Table des matières
                            <ChevronRight
                                className={`ml-2 h-4 w-4 transition-transform ${showMobileToc ? 'rotate-90' : ''}`}
                            />
                        </Button>
                        {showMobileToc && (
                            <div className="mt-3">
                                <TableOfContents
                                    content={
                                        JSON.stringify(post.data.content) || ''
                                    }
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        {/* Colonne principale */}
                        <div className="lg:col-span-8">
                            {/* Barre d'actions sticky */}
                            <div className="sticky top-20 z-30 mb-8 flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white/70 p-2 shadow-sm backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/70">
                                <div className="flex items-center gap-1">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-9 rounded-xl px-3 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 dark:text-slate-400 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400"
                                                    onClick={handleLike}
                                                >
                                                    <Heart
                                                        className={`mr-1.5 h-4 w-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`}
                                                    />
                                                    <span className="text-xs font-medium">
                                                        {likesCount}
                                                    </span>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                J'aime
                                            </TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-9 rounded-xl px-3 text-slate-600 hover:bg-amber-50 hover:text-amber-600 dark:text-slate-400 dark:hover:bg-amber-950/30 dark:hover:text-amber-400"
                                                    onClick={handleBookmark}
                                                >
                                                    <Bookmark
                                                        className={`mr-1.5 h-4 w-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`}
                                                    />
                                                    <span className="text-xs font-medium">
                                                        {bookmarksCount}
                                                    </span>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Favoris
                                            </TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-9 rounded-xl px-3 text-slate-600 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
                                                    onClick={handleShare}
                                                >
                                                    <Share2 className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Partager
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>

                            {/* Extrait */}
                            {post.data.excerpt && (
                                <div className="mb-8 rounded-2xl border-l-4 border-emerald-400 bg-white p-5 shadow-sm dark:border-emerald-600 dark:bg-slate-900/60">
                                    <p className="leading-relaxed text-slate-600 italic dark:text-slate-300">
                                        {typeof post.data.excerpt === 'string'
                                            ? post.data.excerpt
                                            : JSON.stringify(post.data.excerpt)}
                                    </p>
                                </div>
                            )}

                            {/* Contenu */}
                            <div ref={contentRef}>
                                {post.data.content && (
                                    <RichContentText
                                        content={
                                            typeof post.data.content ===
                                            'string'
                                                ? post.data.content
                                                : JSON.stringify(
                                                      post.data.content,
                                                  )
                                        }
                                    />
                                )}
                            </div>

                            {/* Tags */}
                            {post.data.tags && post.data.tags.length > 0 && (
                                <div className="mt-10 border-t border-slate-100 pt-8 dark:border-slate-800">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Tag className="h-4 w-4 text-emerald-500" />
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Tags :
                                        </span>
                                        {post.data.tags.map((tag) => (
                                            <Badge
                                                key={tag.id}
                                                variant="secondary"
                                                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-emerald-100 hover:text-emerald-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400"
                                            >
                                                {tag.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Navigation précédent/suivant */}
                            {(previousPost || nextPost) && (
                                <div className="mt-10 border-t border-slate-100 pt-8 dark:border-slate-800">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {previousPost && (
                                            <Link
                                                href={`/blog/${previousPost.slug}`}
                                                className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-500/5 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-emerald-700"
                                            >
                                                <span className="mb-1 text-xs text-slate-400 dark:text-slate-500">
                                                    ← Article précédent
                                                </span>
                                                <span className="line-clamp-1 font-medium text-slate-800 transition-colors group-hover:text-emerald-600 dark:text-slate-200 dark:group-hover:text-emerald-400">
                                                    {previousPost.title}
                                                </span>
                                            </Link>
                                        )}
                                        {nextPost && (
                                            <Link
                                                href={
                                                    blog.show(nextPost.slug).url
                                                }
                                                className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 text-right transition-all hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-500/5 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-emerald-700"
                                            >
                                                <span className="mb-1 text-xs text-slate-400 dark:text-slate-500">
                                                    Article suivant →
                                                </span>
                                                <span className="line-clamp-1 font-medium text-slate-800 transition-colors group-hover:text-emerald-600 dark:text-slate-200 dark:group-hover:text-emerald-400">
                                                    {nextPost.title}
                                                </span>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside className="hidden lg:col-span-4 lg:block">
                            <div className="sticky top-24 max-h-[calc(100vh-8rem)] space-y-6 overflow-y-auto">
                                <TableOfContents
                                    content={
                                        JSON.stringify(post.data.content) || ''
                                    }
                                />

                                {post.data.user && (
                                    <div className="rounded-2xl border border-slate-200/60 bg-white/60 p-5 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/60">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 ring-2 ring-emerald-100 dark:ring-emerald-900/30">
                                                {post.data.user.avatar_url ? (
                                                    <AvatarImage
                                                        src={
                                                            post.data.user
                                                                .avatar_url
                                                        }
                                                        alt={
                                                            post.data.user.name
                                                        }
                                                    />
                                                ) : (
                                                    <AvatarFallback className="bg-emerald-100 text-sm text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                                                        {getInitials(
                                                            post.data.user.name,
                                                        )}
                                                    </AvatarFallback>
                                                )}
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold text-slate-800 dark:text-slate-200">
                                                    {post.data.user.name}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    Rédacteur
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </aside>
                    </div>
                </div>

                {/* Articles similaires */}
                {relatedPosts && relatedPosts.length > 0 && (
                    <div className="border-t border-slate-100 bg-linear-to-b from-slate-50/50 to-white dark:border-slate-800 dark:from-slate-950/50 dark:to-slate-950">
                        <div className="container mx-auto max-w-6xl px-4 py-12">
                            <div className="mb-8 flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-emerald-500" />
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                                    Articles similaires
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {relatedPosts.map((relatedPost) => (
                                    <Link
                                        key={relatedPost.id}
                                        href={blog.show(relatedPost.slug).url}
                                        className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/5 dark:border-slate-800 dark:bg-slate-900/60"
                                    >
                                        {relatedPost.featured_image_url && (
                                            <div className="aspect-video w-full overflow-hidden">
                                                <img
                                                    src={
                                                        relatedPost.featured_image_url
                                                    }
                                                    alt={relatedPost.title}
                                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}
                                        <div className="flex flex-1 flex-col justify-between p-5">
                                            <div>
                                                <h3 className="mb-2 line-clamp-2 font-semibold text-slate-800 transition-colors group-hover:text-emerald-600 dark:text-slate-200 dark:group-hover:text-emerald-400">
                                                    {relatedPost.title}
                                                </h3>
                                                <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                                                    {relatedPost.excerpt}
                                                </p>
                                            </div>
                                            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                                                <Calendar className="h-3 w-3" />
                                                <span>
                                                    {relatedPost.published_at
                                                        ? format(
                                                              new Date(
                                                                  relatedPost.published_at,
                                                              ),
                                                              'PP',
                                                              { locale: fr },
                                                          )
                                                        : ''}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Commentaires */}
                <div className="border-t border-slate-100 dark:border-slate-800">
                    <div className="container mx-auto max-w-6xl px-4 py-12">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                                Commentaires
                            </h2>
                            <Badge
                                variant="outline"
                                className="border-emerald-200 px-3 py-1 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400"
                            >
                                <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                                {post.data.comments_count || 0}
                            </Badge>
                        </div>
                        <Separator className="mb-8 bg-slate-100 dark:bg-slate-800" />
                        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900/60">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30">
                                <MessageCircle className="h-8 w-8 text-emerald-500" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-slate-800 dark:text-slate-200">
                                Laissez un commentaire
                            </h3>
                            <p className="mb-6 text-slate-500 dark:text-slate-400">
                                Connectez-vous pour participer à la discussion
                            </p>
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-emerald-600 to-emerald-500 px-6 py-2.5 font-medium text-white shadow-md shadow-emerald-500/20 transition-all hover:from-emerald-700 hover:to-emerald-600"
                            >
                                Se connecter
                            </Link>
                        </div>
                    </div>
                </div>
            </article>
            <NewsletterSection />
        </MainLayout>
    );
}
