// resources/js/components/section-cards-post.tsx

import { usePage } from '@inertiajs/react';
import {
    IconTrendingDown,
    IconTrendingUp,
    IconFileText,
    IconCalendar,
    IconUser,
    IconRocket,
    IconClock,
    IconChartBar,
    IconShoppingCart,
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

interface EcommerceStats {
    total_products: number;
    published_products: number;
    draft_products: number;
    total_orders: number;
    completed_orders: number;
    pending_orders: number;
    cancelled_orders: number;
    total_revenue: number;
    revenue_change: number;
    orders_change: number;
    total_customers: number;
    customers_change: number;
    active_carts: number;
    abandoned_carts: number;
    avg_order_value: number;
    conversion_rate: number;
    return_rate: number;
    inventory_count: number;
    low_stock_count: number;
    out_of_stock_count: number;
    revenue_this_month: number;
    revenue_this_month_change: number;
    orders_this_month: number;
    orders_this_month_change: number;
}

interface PageProps {
    stats: EcommerceStats;
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

    const cards = [
        {
            title: 'Total des produits',
            value: stats.total_products.toLocaleString(),
            description: 'Tous statuts confondus',
            trend: stats.orders_change,
            icon: <IconFileText className="size-6" />,
            subText: `${stats.published_products} publiés, ${stats.draft_products} brouillons`,
            trendUp: stats.orders_change >= 0,
        },
        {
            title: 'Produits publiés',
            value: stats.published_products.toLocaleString(),
            description: 'Accessibles au public',
            trend:
                stats.published_products > 0
                    ? Math.round(
                        (stats.published_products / stats.total_products) * 100,
                    )
                    : 0,
            icon: <IconFileText className="size-6 text-primary" />,
            subText: `${stats.low_stock_count} en stock faible`,
            trendUp: true,
        },
        {
            title: 'Chiffre d\'affaires',
            value: new Intl.NumberFormat('fr-CD', {
                style: 'currency',
                currency: 'CDF',
            }).format(stats.total_revenue),
            description: 'Revenu total',
            trend: stats.revenue_change,
            icon: <IconChartBar className="size-6" />,
            subText: 'Performance des ventes',
            trendUp: stats.revenue_change >= 0,
        },
        {
            title: 'Commandes totales',
            value: stats.total_orders.toLocaleString(),
            description: 'Commandes reçues',
            trend: stats.orders_change,
            icon: <IconRocket className="size-6 text-primary" />,
            subText: `${stats.completed_orders} complétées, ${stats.pending_orders} en attente`,
            trendUp: stats.orders_change >= 0,
        },
        {
            title: 'Clients',
            value: stats.total_customers.toLocaleString(),
            description: 'Clients enregistrés',
            trend: stats.customers_change,
            icon: <IconUser className="size-6 text-primary" />,
            subText: 'Base de clients',
            trendUp: stats.customers_change >= 0,
        },
        {
            title: 'Paniers actifs',
            value: stats.active_carts.toLocaleString(),
            description: 'Paniers en cours',
            trend: stats.abandoned_carts,
            icon: <IconShoppingCart className="size-6 text-primary" />,
            subText: `${stats.abandoned_carts} abandonnés`,
            trendUp: false,
        },
        {
            title: 'Paniers abandonnés',
            value: stats.abandoned_carts.toLocaleString(),
            description: 'Paniers non finalisés',
            trend: stats.return_rate,
            icon: <IconClock className="size-6 text-destructive" />,
            subText: 'Taux d\'abandon',
            trendUp: false,
        },
        {
            title: 'Panier moyen',
            value: new Intl.NumberFormat('fr-CD', {
                style: 'currency',
                currency: 'CDF',
            }).format(stats.avg_order_value),
            description: 'Valeur moyenne par commande',
            trend: stats.revenue_change,
            icon: <IconChartBar className="size-6 text-primary" />,
            subText: 'vs période précédente',
            trendUp: stats.revenue_change >= 0,
        },
        {
            title: 'Taux de conversion',
            value: `${stats.conversion_rate}%`,
            description: 'Visiteurs → Clients',
            trend: stats.conversion_rate,
            icon: <IconRocket className="size-6 text-primary" />,
            subText: 'Performance de conversion',
            trendUp: stats.conversion_rate >= 0,
        },
        {
            title: 'Taux de retour',
            value: `${stats.return_rate}%`,
            description: 'Produits retournés',
            trend: stats.return_rate,
            icon: <IconClock className="size-6 text-destructive" />,
            subText: 'vs période précédente',
            trendUp: stats.return_rate <= 0,
        },
        {
            title: 'Stock total',
            value: stats.inventory_count.toLocaleString(),
            description: 'Unités en stock',
            trend: stats.out_of_stock_count,
            icon: <IconFileText className="size-6 text-primary" />,
            subText: `${stats.out_of_stock_count} rupture de stock`,
            trendUp: stats.out_of_stock_count === 0,
        },
        {
            title: 'Revenu ce mois',
            value: new Intl.NumberFormat('fr-CD', {
                style: 'currency',
                currency: 'CDF',
            }).format(stats.revenue_this_month),
            description: 'Revenu mensuel',
            trend: stats.revenue_this_month_change,
            icon: <IconCalendar className="size-6 text-primary" />,
            subText: 'vs mois précédent',
            trendUp: stats.revenue_this_month_change >= 0,
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
