// resources/js/components/section-cards-post.tsx

import { usePage } from '@inertiajs/react';
import {
    IconTrendingDown,
    IconTrendingUp,
    IconEye,
    IconHeart,
    IconMessage,
    IconFileText,
    IconCalendar,
    IconUser,
    IconRocket,
    IconClock,
    IconChartBar,
} from '@tabler/icons-react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface PostStats {
    total_posts: number;
    published_posts: number;
    draft_posts: number;
    scheduled_posts: number;
    archived_posts: number;
    total_views: number;
    total_likes: number;
    total_comments: number;
    views_change: number;
    likes_change: number;
    posts_change: number;
    avg_engagement: number;
    max_engagement: number;
    old_drafts_count: number;
    posts_this_month: number;
    posts_this_month_change: number;
    active_authors: number;
    active_authors_change: number;
    conversion_rate: number;
    days_since_last_post: number | null;
    views_trend: number;
    pending_drafts: number;
    pending_drafts_change: number;
}

interface PageProps {
    stats: PostStats;
    [key: string]: unknown;
}

export function SectionCards() {
    const { props } = usePage<PageProps>();
    const stats = props.stats;

    if (!stats) {
        return (
            <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @3xl/main:grid-cols-4">
                {[...Array(12)].map((_, i) => (
                    <Card key={i} className="@container/card animate-pulse">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="h-4 w-24 rounded bg-muted" />
                                <div className="h-6 w-12 rounded bg-muted" />
                            </div>
                            <div className="mt-2 h-8 w-32 rounded bg-muted" />
                        </CardHeader>
                        <CardFooter>
                            <div className="h-4 w-40 rounded bg-muted" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        );
    }

    const getDaysSinceLastPost = () => {
        const days = stats.days_since_last_post;

        if (
            days === null ||
            days === undefined ||
            days < 0 ||
            days > 10000 ||
            isNaN(days)
        ) {
            return null;
        }

        return days;
    };

    const daysValue = getDaysSinceLastPost();

    const cards = [
        {
            title: 'Total des articles',
            value: stats.total_posts.toLocaleString(),
            description: 'Tous statuts confondus',
            trend: stats.posts_change,
            icon: <IconFileText className="size-6" />,
            subText: `${stats.published_posts} publiés, ${stats.draft_posts} brouillons`,
            trendUp: stats.posts_change >= 0,
        },
        {
            title: 'Articles publiés',
            value: stats.published_posts.toLocaleString(),
            description: 'Accessibles au public',
            trend:
                stats.published_posts > 0
                    ? Math.round(
                          (stats.published_posts / stats.total_posts) * 100,
                      )
                    : 0,
            icon: <IconFileText className="size-6 text-green-500" />,
            subText: `${stats.scheduled_posts} programmés`,
            trendUp: true,
        },
        {
            title: 'Vues totales',
            value: stats.total_views.toLocaleString(),
            description: 'Nombre total de vues',
            trend: stats.views_change,
            icon: <IconEye className="size-6" />,
            subText: 'Performance des articles',
            trendUp: stats.views_change >= 0,
        },
        {
            title: "J'aime",
            value: stats.total_likes.toLocaleString(),
            description: 'Likes cumulés',
            trend: stats.likes_change,
            icon: <IconHeart className="size-6 text-red-500" />,
            subText: 'Engagement des lecteurs',
            trendUp: stats.likes_change >= 0,
        },
        {
            title: 'Commentaires',
            value: stats.total_comments.toLocaleString(),
            description: 'Commentaires reçus',
            trend:
                stats.total_comments > 0
                    ? Math.round(
                          (stats.total_comments / stats.total_views) * 100,
                      )
                    : 0,
            icon: <IconMessage className="size-6 text-blue-500" />,
            subText: `${stats.avg_engagement}% d'engagement moyen`,
            trendUp: true,
        },
        {
            title: 'Taux de conversion',
            value: `${stats.conversion_rate}%`,
            description: 'Publications vs période précédente',
            trend: stats.conversion_rate,
            icon: <IconRocket className="size-6 text-purple-500" />,
            subText: 'Rythme de publication',
            trendUp: stats.conversion_rate >= 0,
        },
        {
            title: 'Dernière publication',
            value:
                daysValue === 0
                    ? "Aujourd'hui"
                    : daysValue !== null
                      ? `J-${daysValue}`
                      : 'Jamais',
            description: 'Dernier article publié',
            trend: daysValue !== null ? -daysValue : 0,
            icon: <IconClock className="size-6 text-orange-500" />,
            subText:
                daysValue === 0
                    ? "Publié aujourd'hui"
                    : daysValue !== null
                      ? `Il y a ${daysValue} jour${daysValue > 1 ? 's' : ''}`
                      : 'Aucun article publié',
            trendUp: false,
        },
        {
            title: 'Tendance des vues',
            value: `${stats.views_trend}%`,
            description: 'Évolution sur 7 jours',
            trend: stats.views_trend,
            icon: <IconChartBar className="size-6 text-indigo-500" />,
            subText: 'vs période précédente',
            trendUp: stats.views_trend >= 0,
        },
        {
            title: 'Articles ce mois',
            value: stats.posts_this_month.toLocaleString(),
            description: 'Créés ce mois-ci',
            trend: stats.posts_this_month_change,
            icon: <IconCalendar className="size-6" />,
            subText: 'Rythme de publication',
            trendUp: stats.posts_this_month_change >= 0,
        },
        {
            title: 'Auteurs actifs',
            value: stats.active_authors.toLocaleString(),
            description: 'Contributeurs',
            trend: stats.active_authors_change,
            icon: <IconUser className="size-6" />,
            subText: 'Équipe éditoriale',
            trendUp: stats.active_authors_change >= 0,
        },
        {
            title: 'Brouillons',
            value: stats.draft_posts.toLocaleString(),
            description: 'À terminer',
            trend:
                stats.draft_posts > 0
                    ? Math.round((stats.draft_posts / stats.total_posts) * 100)
                    : 0,
            icon: <IconFileText className="size-6 text-yellow-500" />,
            subText: `${stats.old_drafts_count} brouillons anciens (30j+)`,
            trendUp: false,
        },
        {
            title: 'Brouillons en attente',
            value: stats.pending_drafts?.toLocaleString() ?? '0',
            description: 'Modifiés cette semaine',
            trend: stats.pending_drafts_change ?? 0,
            icon: <IconFileText className="size-6 text-orange-500" />,
            subText: 'À publier prochainement',
            trendUp: (stats.pending_drafts_change ?? 0) >= 0,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @3xl/main:grid-cols-4">
            {cards.map((card, index) => (
                <Card key={index} className="@container/card">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardDescription className="flex items-center gap-2">
                                {card.icon}
                                {card.title}
                            </CardDescription>
                            <CardAction>
                                <Badge
                                    variant="outline"
                                    className={
                                        card.trendUp
                                            ? 'text-green-500'
                                            : 'text-red-500'
                                    }
                                >
                                    {card.trendUp ? (
                                        <IconTrendingUp className="size-5" />
                                    ) : (
                                        <IconTrendingDown className="size-5" />
                                    )}
                                    {Math.abs(card.trend)}%
                                </Badge>
                            </CardAction>
                        </div>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {card.value}
                        </CardTitle>
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            {card.subText}
                        </div>
                        <div className="text-muted-foreground">
                            {card.description}
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
