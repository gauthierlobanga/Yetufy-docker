// resources/js/Pages/Search/Index.tsx

import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge, Calendar, Folder, User } from 'lucide-react';
import type { SearchResult } from '@/components/search-my-input';
import MainLayout from '@/layouts/main-layout';
import { home } from '@/routes';

interface Props {
    results: SearchResult[];
    query: string;
}

export default function SearchIndex({ results, query }: Props) {
    const breadcrumbs = [
        { title: 'Accueil', href: home() },
        { title: 'Recherche', href: '/search' },
        { title: `"${query}"`, href: `/search?q=${query}` },
    ];

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title={`Recherche: ${query}`} />

            <div className="container mx-auto max-w-4xl px-4 py-12">
                <h1 className="mb-2 text-3xl font-bold">
                    Résultats pour "{query}"
                </h1>
                <p className="mb-8 text-muted-foreground">
                    {results.length} résultat{results.length > 1 ? 's' : ''}{' '}
                    trouvé(s)
                </p>

                {results.length === 0 ? (
                    <div className="rounded-lg border bg-muted/30 p-8 text-center">
                        <p className="text-muted-foreground">
                            Aucun résultat trouvé. Essayez une autre recherche.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {results.map((result) => (
                            <Link
                                key={`${result._type}-${result.id}`}
                                href={
                                    result._type === 'post'
                                        ? `/blog/${result.slug}`
                                        : result._type === 'category'
                                          ? `/blog/category/${result.slug}`
                                          : `/profile/${result.id}`
                                }
                                className="group block rounded-lg border bg-card p-6 transition-all hover:shadow-lg"
                            >
                                <div className="flex items-start gap-4">
                                    {result._type === 'post' &&
                                        result.featured_image_thumb && (
                                            <img
                                                src={
                                                    result.featured_image_thumb
                                                }
                                                alt={result.title}
                                                className="h-16 w-16 rounded-lg object-cover"
                                            />
                                        )}
                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold group-hover:text-blue-600">
                                            {result.title ||
                                                result.nom ||
                                                result.name}
                                        </h2>
                                        {result._type === 'post' &&
                                            result.excerpt && (
                                                <p className="mt-1 text-muted-foreground">
                                                    {result.excerpt}
                                                </p>
                                            )}
                                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                            <Badge>
                                                {result._type === 'post'
                                                    ? 'Article'
                                                    : result._type ===
                                                        'category'
                                                      ? 'Catégorie'
                                                      : 'Auteur'}
                                            </Badge>
                                            {result._type === 'post' &&
                                                result.published_at && (
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>
                                                            {format(
                                                                new Date(
                                                                    result.published_at,
                                                                ),
                                                                'dd MMM yyyy',
                                                                { locale: fr },
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                            {result._type === 'category' &&
                                                result.posts_count && (
                                                    <div className="flex items-center gap-1">
                                                        <Folder className="h-3 w-3" />
                                                        <span>
                                                            {result.posts_count}{' '}
                                                            articles
                                                        </span>
                                                    </div>
                                                )}
                                            {result._type === 'user' &&
                                                result.views_count && (
                                                    <div className="flex items-center gap-1">
                                                        <User className="h-3 w-3" />
                                                        <span>
                                                            {result.views_count}{' '}
                                                            articles
                                                        </span>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
