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
    Receipt,
    BarChart3,
    AlertTriangle,
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

export function SectionCard({ summary }: { summary: Summary | null }) {
    // 🔒 Valeurs par défaut (toutes les propriétés utilisées dans les cartes)
    const {
        total_products = 0,
        published_products = 0,
        draft_products = 0,
        completed_orders = 0,
        cancelled_orders = 0,
        revenue_this_month = 0,
        revenue_this_month_change = 0,
        orders_this_month = 0,
        orders_this_month_change = 0,
        total_customers = 0,
        customers_change = 0,
        active_carts = 0,
        abandoned_carts = 0,
        avg_order_value = 0,
        conversion_rate = 0,
        conversion_change = 0,
        out_of_stock_count = 0,
        out_of_stock_change = 0,
        low_stock_count = 0,
    } = summary ?? {};

    if (!summary) {
        return (
            <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @3xl/main:grid-cols-4">
                {[...Array(8)].map((_, i) => (
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
            title: 'Produits',
            value: total_products.toLocaleString(),
            icon: <Package className="h-6 w-6 text-emerald-500" />,
            trend: summary.products_change ?? 0,
            sub: `${published_products} publiés · ${draft_products} brouillons`,
        },
        {
            title: 'Commandes (mois)',
            value: orders_this_month.toLocaleString(),
            icon: <ShoppingCart className="h-6 w-6 text-blue-500" />,
            trend: orders_this_month_change,
            sub: `${completed_orders} complétées · ${cancelled_orders} annulées`,
        },
        {
            title: 'Revenus (mois)',
            value: formatCurrency(revenue_this_month),
            icon: <Banknote className="h-6 w-6 text-green-500" />,
            trend: revenue_this_month_change,
            sub: 'vs mois précédent',
        },
        {
            title: 'Clients',
            value: total_customers.toLocaleString(),
            icon: <Users className="h-6 w-6 text-purple-500" />,
            trend: customers_change,
            sub: 'enregistrés',
        },
        {
            title: 'Paniers actifs',
            value: active_carts.toLocaleString(),
            icon: <ShoppingBag className="h-6 w-6 text-orange-500" />,
            trend: summary.carts_change ?? 0,
            sub: `${abandoned_carts} abandonnés`,
        },
        {
            title: 'Panier moyen',
            value: formatCurrency(avg_order_value),
            icon: <Receipt className="h-6 w-6 text-indigo-500" />,
            trend: summary.aov_change ?? 0,
            sub: 'par commande',
        },
        {
            title: 'Taux de conversion',
            value: `${conversion_rate.toFixed(1)} %`,
            icon: <BarChart3 className="h-6 w-6 text-cyan-500" />,
            trend: conversion_change,
            sub: 'paniers → commandes',
        },
        {
            title: 'En rupture',
            value: out_of_stock_count.toLocaleString(),
            icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
            trend: out_of_stock_change,
            sub: `${low_stock_count} en stock faible`,
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
