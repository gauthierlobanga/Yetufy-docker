/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/Pages/Vendor/Statistics.tsx

import { Head } from '@inertiajs/react';
import type { Variants } from 'framer-motion';
import {
    motion,
    useScroll,
    useTransform,
    AnimatePresence,
} from 'framer-motion';
import {
    Sparkles,
    CalendarDays,
    TrendingUp,
    Activity,
    ShieldCheck,
    Percent,
    Star,
} from 'lucide-react';
import { useRef } from 'react';

import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { VendorSidebar } from '@/components/VendorSidebar';

import type {
    FreightDataItem,
    SatisfactionDataItem,
    StockDataItem,
    Summary,
    SummaryCardsData,
    Tenant,
} from '@/types/tenants/products/vendor/tenant';
import { DataTableCommandes } from './Statistics/Avanced/data-table-commandes';
import { DataTablePaiements } from './Statistics/Avanced/data-table-payments';
import { ChartOrderStatuses } from './Statistics/Partials/ChartOrderStatuses';
import { ChartRevenueOverTime } from './Statistics/Partials/ChartRevenueOverTime';
import { FreightChart } from './Statistics/Partials/FreightChart';
import { SatisfactionChart } from './Statistics/Partials/SatisfactionChart';
import { SectionCard } from './Statistics/Partials/SectionCard';
import { SectionCards } from './Statistics/Partials/SectionCards';
import { StockChart } from './Statistics/Partials/StockChart';
import { SummaryCards } from './Statistics/Partials/SummaryCards';
import { TopClientsChart } from './Statistics/Partials/TopClientsChart';
import { TopProductsChart } from './Statistics/Partials/TopProductsChart';

interface Props {
    tenant: Tenant;
    summary: Summary;
    salesOverTime: { date: string; revenue: number; orders: number }[];
    topProducts: any[];
    topClients: any[];
    orderStatuses: any[];
    weeklyActivity: any[];
    monthlyOrders: any[];
    hourlyOrders: any[];
    categoryPerformance: any[];
    topCategories: any[];
    cartStats: { active: number; abandoned: number };
    customerMetrics: any;
    recentMovements: any[];
    planAllowsAdvancedStats: boolean;
    recentCommandes: any[];
    recentPaiements: any[];
    summaryCards: SummaryCardsData;
    stockData: StockDataItem[];
    satisfactionData: SatisfactionDataItem[];
    totalReviews: number;
    averageRating: number;
    freightData: FreightDataItem[];
}

export default function VendorStatistics({
    tenant,
    summary,
    salesOverTime,
    topProducts,
    topClients,
    orderStatuses,
    stockData,
    satisfactionData,
    totalReviews,
    averageRating,
    freightData,
    summaryCards,
    recentCommandes,
    recentPaiements,
}: Props) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Calculs dynamiques
    const totalRevenue = Number(summary?.total_revenue || 0);
    const totalOrders = Number(summary?.total_orders || 0);
    const totalCustomers = Number(summary?.total_customers || 0);
    const totalProducts = Number(summary?.total_products || 0);

    const growthRate =
        salesOverTime.length >= 2
            ? (() => {
                  const current =
                      salesOverTime[salesOverTime.length - 1]?.revenue || 0;

                  const previous =
                      salesOverTime[salesOverTime.length - 2]?.revenue || 0;

                  if (previous <= 0) {
                      return current > 0 ? 100 : 0;
                  }

                  return (((current - previous) / previous) * 100).toFixed(1);
              })()
            : 0;

    // Conversion réelle estimée
    const conversionRate =
        totalCustomers > 0
            ? ((totalOrders / totalCustomers) * 100).toFixed(1)
            : 0;

    // Satisfaction réelle
    const satisfactionRate =
        totalReviews > 0 ? ((averageRating / 5) * 100).toFixed(1) : 0;

    // Disponibilité réelle simulée selon activité
    const availabilityBase = 95 + totalOrders / 100;

    const availabilityRate =
        totalOrders > 0
            ? Number(Math.min(availabilityBase, 99.9).toFixed(1))
            : 95;

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.98]);

    const cardVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 24,
            scale: 0.98,
        },
        visible: (i: number = 1) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                delay: i * 0.05,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1] as const,
            },
        }),
    };

    return (
        <SidebarProvider
            className="dark:bg-slate-950/94"
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <VendorSidebar tenant={tenant} />

            <SidebarInset>
                <SiteHeader />

                <div
                    ref={containerRef}
                    className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.08),transparent_25%)] dark:bg-slate-950"
                >
                    <Head title={`Statistiques - ${tenant.raison_sociale}`} />

                    <div className="relative z-10 mx-auto max-w-425 px-4 py-8 sm:px-6 lg:px-8">
                        {/* HERO */}
                        <motion.div
                            style={{ scale: heroScale }}
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="relative mb-10 overflow-hidden rounded-lg border border-slate-200/60 bg-white/80 backdrop-blur-2xl dark:border-slate-800/60 dark:bg-slate-900/80 dark:shadow-slate-950/40"
                        >
                            {/* Éléments décoratifs discrets */}
                            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-transparent to-teal-500/5" />
                            <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-emerald-500/8 blur-3xl" />
                            <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-teal-500/8 blur-3xl" />

                            <div className="relative z-10 flex flex-col gap-8 p-6 md:p-8 xl:flex-row xl:items-center xl:justify-between">
                                {/* Texte principal */}
                                <div className="max-w-3xl space-y-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <Badge className="border-emerald-200 bg-emerald-50 px-4 py-1 text-emerald-700 dark:border-emerald-800/30 dark:bg-emerald-950/40 dark:text-emerald-300">
                                            <Sparkles className="mr-2 h-3.5 w-3.5" />
                                            Dashboard
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="border-slate-200 bg-white/50 text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300"
                                        >
                                            <Activity className="mr-2 h-3.5 w-3.5" />
                                            Temps réel
                                        </Badge>
                                    </div>

                                    <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-4xl dark:text-white">
                                        Tableau de bord analytique
                                    </h1>

                                    <p className="max-w-2xl text-base leading-normal text-slate-600 md:text-lg dark:text-slate-400">
                                        Analysez les performances de votre
                                        boutique, surveillez les ventes,
                                        optimisez votre croissance et obtenez
                                        des insights avancés en temps réel.
                                    </p>

                                    <div className="flex flex-wrap items-center gap-3 pt-2">
                                        <Button className="rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 dark:shadow-emerald-900/30">
                                            <TrendingUp className="mr-2 h-4 w-4" />
                                            Voir les tendances
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="rounded-2xl border-slate-200 bg-white/80 text-slate-700 shadow-sm backdrop-blur-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-900"
                                        >
                                            <CalendarDays className="mr-2 h-4 w-4" />
                                            30 derniers jours
                                        </Button>
                                    </div>
                                </div>

                                {/* Blocs de statistiques */}
                                <div className="grid grid-cols-2 gap-4 xl:min-w-95">
                                    {/* Croissance */}
                                    <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 backdrop-blur-md transition-all hover:shadow-md dark:border-slate-700/70 dark:bg-slate-900/70">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                Croissance
                                            </span>

                                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                                        </div>

                                        {(() => {
                                            const totalOrders = Number(
                                                summary?.total_orders ?? 0,
                                            );

                                            const totalProducts = Number(
                                                summary?.total_products ?? 1,
                                            );

                                            const growthRate = Math.min(
                                                Number(
                                                    (
                                                        (totalOrders /
                                                            Math.max(
                                                                totalProducts,
                                                                1,
                                                            )) *
                                                        100
                                                    ).toFixed(1),
                                                ),
                                                100,
                                            );

                                            return (
                                                <>
                                                    <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
                                                        +{growthRate}%
                                                    </div>

                                                    <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                                        Basé sur les commandes
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>

                                    {/* Conversion */}
                                    <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur-md transition-all hover:shadow-md dark:border-slate-700/70 dark:bg-slate-900/70">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                Conversion
                                            </span>

                                            <Percent className="h-4 w-4 text-cyan-500" />
                                        </div>

                                        {/* Conversion */}
                                        {(() => {
                                            const totalOrders = Number(
                                                summary?.total_orders ?? 0,
                                            );
                                            const totalClients = Number(
                                                summary?.total_clients ?? 0,
                                            );

                                            const conversionRate =
                                                totalClients > 0
                                                    ? Math.min(
                                                          Number(
                                                              (
                                                                  (totalOrders /
                                                                      totalClients) *
                                                                  100
                                                              ).toFixed(1),
                                                          ),
                                                          100,
                                                      )
                                                    : 0;

                                            return (
                                                <>
                                                    <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
                                                        {conversionRate}%
                                                    </div>

                                                    <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                                        Taux de transformation
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>

                                    {/* Satisfaction */}
                                    <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur-md transition-all hover:shadow-md dark:border-slate-700/70 dark:bg-slate-900/70">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                Satisfaction
                                            </span>

                                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                        </div>

                                        <div className="mt-3 flex items-end gap-1">
                                            <span className="text-3xl font-black text-slate-900 dark:text-white">
                                                {Number(
                                                    averageRating || 0,
                                                ).toFixed(1)}
                                            </span>

                                            <span className="mb-1 text-sm text-slate-500">
                                                /5
                                            </span>
                                        </div>

                                        <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                            {totalReviews} avis clients
                                        </div>
                                    </div>

                                    {/* Disponibilité / sécurité */}
                                    <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur-md transition-all hover:shadow-md dark:border-slate-700/70 dark:bg-slate-900/70">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                Disponibilité
                                            </span>

                                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                        </div>

                                        {/* Croissance */}
                                        {(() => {
                                            const totalOrders = Number(
                                                summary?.total_orders ?? 0,
                                            );
                                            const totalProducts = Number(
                                                summary?.total_products ?? 0,
                                            );

                                            const growthRate = Math.min(
                                                Number(
                                                    (
                                                        (totalOrders /
                                                            Math.max(
                                                                totalProducts,
                                                                1,
                                                            )) *
                                                        100
                                                    ).toFixed(1),
                                                ),
                                                100,
                                            );

                                            return (
                                                <>
                                                    <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
                                                        +{growthRate}%
                                                    </div>

                                                    <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                                        Basé sur les commandes
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        {/* SECTION CARDS */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={cardVariants}
                            className="mb-10"
                        >
                            <SectionCard summary={summary} />
                        </motion.div>
                        {/* SECTION CARDS */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={cardVariants}
                            className="mb-10"
                        >
                            <SectionCards summary={summary} />
                        </motion.div>

                        {/* SUMMARY CARDS */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={cardVariants}
                            transition={{ delay: 0.1 }}
                            className="mb-12"
                        >
                            <SummaryCards summary={summaryCards as any} />
                        </motion.div>

                        {/* CHARTS */}
                        <div className="space-y-8">
                            {/* Revenue + Status */}
                            <div className="grid gap-8 2xl:grid-cols-[1.5fr_1fr]">
                                <motion.div
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={cardVariants}
                                >
                                    <ChartRevenueOverTime
                                        data={salesOverTime}
                                    />
                                </motion.div>

                                <motion.div
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={cardVariants}
                                    transition={{ delay: 0.1 }}
                                >
                                    <ChartOrderStatuses data={orderStatuses} />
                                </motion.div>

                                <motion.div
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={cardVariants}
                                    transition={{ delay: 0.3 }}
                                >
                                    <TopProductsChart data={topProducts} />
                                </motion.div>
                            </div>

                            {/* Clients + Products */}
                            <div className="grid gap-8 xl:grid-cols-2">
                                <motion.div
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={cardVariants}
                                    transition={{ delay: 0.2 }}
                                >
                                    <TopClientsChart data={topClients} />
                                </motion.div>
                                {freightData && freightData.length > 0 && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: 20,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: 20,
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.2,
                                        }}
                                    >
                                        {stockData && stockData.length > 0 && (
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    y: 20,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    y: 20,
                                                }}
                                                transition={{
                                                    duration: 0.5,
                                                }}
                                            >
                                                <StockChart data={stockData} />
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}
                            </div>

                            {/* Advanced cards */}
                            <div className="grid gap-8 md:grid-cols-2 2xl:grid-cols-3">
                                <AnimatePresence>
                                    <FreightChart data={freightData} />

                                    {satisfactionData &&
                                        satisfactionData.length > 0 && (
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    y: 20,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    y: 20,
                                                }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: 0.1,
                                                }}
                                            >
                                                <SatisfactionChart
                                                    data={satisfactionData}
                                                    totalReviews={totalReviews}
                                                    averageRating={
                                                        averageRating
                                                    }
                                                />
                                            </motion.div>
                                        )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* TABLES ANALYTIQUES PREMIUM */}
                        <motion.section
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={cardVariants}
                            className="mt-14 space-y-8"
                        >
                            {/* Header */}
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <div className="mb-2 flex items-center gap-2">
                                        <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400">
                                            <Activity className="mr-1 h-3.5 w-3.5" />
                                            Données temps réel
                                        </Badge>

                                        <Badge
                                            variant="outline"
                                            className="border-slate-200 bg-white/70 dark:border-slate-800 dark:bg-slate-900/60"
                                        >
                                            Monitoring avancé
                                        </Badge>
                                    </div>

                                    <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                                        Activités récentes
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        Consultez les dernières commandes et
                                        transactions financières de votre
                                        boutique.
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="rounded-2xl border border-emerald-100 bg-white/70 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
                                        {recentCommandes.length} commandes
                                    </div>

                                    <div className="rounded-2xl border border-cyan-100 bg-white/70 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
                                        {recentPaiements.length} paiements
                                    </div>
                                </div>
                            </div>

                            {/* Tables */}
                            <div className="grid gap-8 2xl:grid-cols-2">
                                {/* Commandes */}
                                <motion.div
                                    variants={cardVariants}
                                    custom={1}
                                    className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/70 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] backdrop-blur-2xl dark:border-slate-800/80 dark:bg-slate-900/70"
                                >
                                    {/* Glow */}
                                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.08),transparent_35%)]" />

                                    <div className="relative z-10 border-b border-slate-200/70 px-6 py-5 dark:border-slate-800">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                                    Dernières commandes
                                                </h3>

                                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                    Suivi intelligent des
                                                    commandes clients.
                                                </p>
                                            </div>

                                            <div className="rounded-2xl bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                                                Live
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative z-10 p-1">
                                        <DataTableCommandes
                                            commandes={{
                                                data: recentCommandes,
                                                current_page: 1,
                                                last_page: 1,
                                                total: recentCommandes.length,
                                                per_page: 10,
                                            }}
                                        />
                                    </div>
                                </motion.div>

                                {/* Paiements */}
                                <motion.div
                                    variants={cardVariants}
                                    custom={2}
                                    className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/70 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] backdrop-blur-2xl dark:border-slate-800/80 dark:bg-slate-900/70"
                                >
                                    {/* Glow */}
                                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.08),transparent_35%)]" />

                                    <div className="relative z-10 border-b border-slate-200/70 px-6 py-5 dark:border-slate-800">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                                    Derniers paiements
                                                </h3>

                                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                    Historique des transactions
                                                    et encaissements.
                                                </p>
                                            </div>

                                            <div className="rounded-2xl bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-400">
                                                Sécurisé
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative z-10 p-1">
                                        <DataTablePaiements
                                            paiements={{
                                                data: recentPaiements,
                                                current_page: 1,
                                                last_page: 1,
                                                total: recentPaiements.length,
                                                per_page: 10,
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        </motion.section>
                        {/* FOOTER */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="mt-20 border-t border-slate-200/60 pt-8 dark:border-slate-800/60"
                        >
                            <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
                                <div>
                                    <h3 className="font-semibold text-slate-800 dark:text-white">
                                        {tenant.raison_sociale}
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        Tableau analytique intelligent &
                                        monitoring temps réel.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-slate-200/60 bg-white/60 px-5 py-3 text-sm text-slate-500 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                                    © {new Date().getFullYear()} — Tous droits
                                    réservés.
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
