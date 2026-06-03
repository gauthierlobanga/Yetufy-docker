/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/Pages/Vendor/Statistics/Partials/SectionCards.tsx
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    Package,
    ShoppingCart,
    Banknote,
    Users,
    ShoppingBag,
    Clock,
    BarChart3,
    Receipt,
    AlertTriangle,
    ArrowUpRight,
    Tag,
    UserCheck,
    DollarSign, // ← ajout
    ImageOff, // ← ajout
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type { Summary } from '@/types/tenants/products/vendor/tenant';

export function SectionCards({ summary }: { summary: Summary | null }) {
    const {
        sales_today = 0,
        promo_products = 0,
        customers = 0,
        abandoned_carts = 0,
        pending_orders = 0,
        returning_customers = 0,
        revenue_per_customer = 0,
        products_without_image = 0,
    } = summary ?? {};

    if (!summary) {
        return (
            <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @3xl/main:grid-cols-4">
                {[...Array(12)].map((_, i) => (
                    <Card
                        key={i}
                        className="animate-pulse border-slate-200 dark:border-slate-800"
                    >
                        <CardHeader>
                            <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                            <div className="mt-2 h-8 w-32 rounded bg-slate-200 dark:bg-slate-800" />
                        </CardHeader>
                    </Card>
                ))}
            </div>
        );
    }

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('fr-CD', {
            style: 'currency',
            currency: 'CDF',
        }).format(value);

    const cards = [
        {
            title: 'Clients',
            value: customers.toLocaleString(),
            icon: <Users className="h-6 w-6 text-purple-500" />,
            trend: summary.customers_change ?? 0,
            sub: 'nouveaux ce mois',
        },
        {
            title: 'Paniers abandonnés',
            value: abandoned_carts.toLocaleString(),
            icon: <ShoppingBag className="h-6 w-6 text-orange-500" />,
            trend: summary.carts_change ?? 0,
            sub: 'à relancer',
        },
        {
            title: 'En attente',
            value: pending_orders.toLocaleString(),
            icon: <Clock className="h-6 w-6 text-amber-500" />,
            trend: summary.pending_change ?? 0,
            sub: 'commandes en cours',
        },
        {
            title: 'Ventes du jour',
            value: formatCurrency(sales_today),
            icon: <ArrowUpRight className="h-6 w-6 text-yellow-500" />,
            trend: summary.sales_today_change ?? 0,
            sub: "aujourd'hui",
        },
        {
            title: 'Promotions actives',
            value: (summary.active_promotions ?? 0).toLocaleString(),
            icon: <Tag className="h-6 w-6 text-pink-500" />,
            trend: summary.promo_change ?? 0,
            sub: 'promotions en cours',
        },
        {
            title: 'Clients récurrents',
            value: returning_customers.toLocaleString(),
            icon: <UserCheck className="h-6 w-6 text-teal-500" />,
            trend: summary.returning_change ?? 0,
            sub: '≥ 2 commandes',
        },
        {
            title: 'Revenu / client',
            value: formatCurrency(revenue_per_customer),
            icon: <DollarSign className="h-6 w-6 text-teal-500" />,
            trend: 0, // vous pouvez ajouter une tendance
            sub: 'chiffre d’affaires par client',
        },
        {
            title: 'Sans image',
            value: products_without_image.toLocaleString(),
            icon: <ImageOff className="h-6 w-6 text-gray-500" />,
            trend: 0,
            sub: 'produits sans photo',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, index) => (
                <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <Card className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700 dark:hover:shadow-emerald-900/20">
                        {/* Ligne colorée en haut */}
                        <div className="absolute inset-x-0 top-0 h-1 bg-emerald-500 transition-all duration-200 group-hover:h-1.5" />

                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-6 pb-2">
                            <CardDescription className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                <span className="rounded-lg bg-emerald-50 p-1.5 dark:bg-emerald-900/30">
                                    {card.icon}
                                </span>
                                {card.title}
                            </CardDescription>
                            <Badge
                                variant="outline"
                                className={`flex items-center gap-1 text-xs ${
                                    card.trend >= 0
                                        ? 'border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400'
                                        : 'border-red-200 text-red-700 dark:border-red-800 dark:text-red-400'
                                }`}
                            >
                                {card.trend >= 0 ? (
                                    <TrendingUp className="h-3 w-3" />
                                ) : (
                                    <TrendingDown className="h-3 w-3" />
                                )}
                                {Math.abs(card.trend)}%
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 @[250px]/card:text-3xl dark:text-white">
                                {card.value}
                            </CardTitle>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                {card.sub}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
