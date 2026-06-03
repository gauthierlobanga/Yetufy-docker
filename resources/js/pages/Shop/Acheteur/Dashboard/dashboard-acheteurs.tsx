/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/pages/customs/dashboard-acheteurs.tsx
import type { PageProps } from '@inertiajs/core';
import { Head, Link, usePage } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import {
    ArrowRight,
    BarChart3,
    ChevronRight,
    Gift,
    Package,
    RotateCcw,
    ShoppingBag,
    ShoppingCart,
    Sparkles,
    TrendingUp,
    Wallet,
    Target,
    CheckCircle2,
    Calendar,
    Tag,
} from 'lucide-react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import type {
    NameType,
    ValueType,
} from 'recharts/types/component/DefaultTooltipContent';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import tenant from '@/routes/tenant';
/* ---------- Types ---------- */
interface OrderItem {
    id: string;
    numero_commande: string;
    statut: string;
    total: number;
    created_at: string;
    lignes_count: number;
}

interface AdvancedStats {
    order_growth: number;
    completed_rate: number;
    orders_this_month: number;
}

interface WeeklySpending {
    day: string;
    total: number;
}

interface TopCategory {
    nom: string;
    total: number;
}

interface Props extends PageProps {
    stats: {
        orders_count: number;
        completed_orders: number;
        addresses_count: number;
        wishlist_items_count: number;
        pending_returns_count: number;
        loyalty_points: number;
        loyalty_level: string;
        total_spent: number;
        avg_order_amount: number;
        total_products_bought: number;
    };
    advancedStats: AdvancedStats;
    weeklySpending: WeeklySpending[];
    topCategories: TopCategory[];
    recentOrders: OrderItem[];
    wishlist?: { nom?: string; items_count?: number } | null;
    loyalty?: { points?: number; niveau_libelle?: string } | null;
    monthlyOrders: Record<string, { count: number; total: number }>;
    statusDistribution: Record<string, number>;
    loyaltyHistory: Record<
        string,
        { gain: number; utilisation: number }
    > | null;
}

/* ---------- Constantes ---------- */
const CHART_COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444'];
const MONTHS = [
    'Jan',
    'Fév',
    'Mar',
    'Avr',
    'Mai',
    'Juin',
    'Juil',
    'Août',
    'Sep',
    'Oct',
    'Nov',
    'Déc',
];
const DAYS_MAP: Record<string, string> = {
    Mon: 'Lun',
    Tue: 'Mar',
    Wed: 'Mer',
    Thu: 'Jeu',
    Fri: 'Ven',
    Sat: 'Sam',
    Sun: 'Dim',
};

const formatPrice = (amount: number) =>
    new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
    }).format(amount);

const statusVariant: Record<string, string> = {
    en_attente:
        'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    confirmee:
        'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    en_preparation:
        'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
    expediee:
        'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800',
    termine:
        'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    annulee:
        'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
};

function getStatusBadge(statut: string) {
    return (
        <Badge
            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${statusVariant[statut] ?? 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-400'}`}
        >
            {statut.replace('_', ' ')}
        </Badge>
    );
}

/* ---------- Petits KPI ---------- */
function KpiCard({
    icon: Icon,
    label,
    value,
    helper,
    trend,
}: {
    icon: LucideIcon;
    label: string;
    value: string | number;
    helper?: string;
    trend?: number;
}) {
    return (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                    <Icon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {label}
                    </p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                        {value}
                    </p>
                    {helper && (
                        <p className="text-xs text-slate-400">{helper}</p>
                    )}
                </div>
            </div>
            {trend !== undefined && (
                <span
                    className={`text-sm font-semibold ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}
                >
                    {trend > 0 ? '+' : ''}
                    {trend}%
                </span>
            )}
        </div>
    );
}

/* ---------- Page ---------- */
export default function DashboardCustomerBuyer() {
    const {
        stats,
        advancedStats,
        recentOrders,
        monthlyOrders,
        statusDistribution,
        loyalty,
        loyaltyHistory,
        weeklySpending,
        topCategories,
    } = usePage<Props>().props;

    // Données des graphiques
    const orderChartData = Object.entries(monthlyOrders).map(
        ([month, data]) => ({
            month: MONTHS[parseInt(month.split('-')[1], 10) - 1],
            commandes: data.count,
        }),
    );

    const statusChartData = Object.entries(statusDistribution).map(
        ([key, value]) => ({
            name: key.replace('_', ' '),
            value,
        }),
    );

    const spendingChartData = (weeklySpending || []).map((item) => ({
        day: DAYS_MAP[item.day] || item.day,
        total: item.total,
    }));

    const maxCategoryTotal = Math.max(
        ...(topCategories || []).map((c) => c.total),
        1,
    );

    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <Head title="Dashboard client" />
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
                    <div className="space-y-8 p-4 md:p-8">
                        {/* Bienvenue */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    Bonjour 👋
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400">
                                    Voici un aperçu de votre activité récente.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant="outline"
                                    className="rounded-full"
                                >
                                    <Calendar className="mr-1 h-3.5 w-3.5" />
                                    {new Date().toLocaleDateString('fr-FR', {
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </Badge>
                            </div>
                        </div>

                        {/* KPI principaux */}
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                            <KpiCard
                                icon={Wallet}
                                label="Total dépensé"
                                value={formatPrice(stats.total_spent)}
                                helper={`${stats.orders_count} commandes`}
                            />
                            <KpiCard
                                icon={ShoppingCart}
                                label="Panier moyen"
                                value={formatPrice(stats.avg_order_amount)}
                            />
                            <KpiCard
                                icon={Gift}
                                label="Points"
                                value={stats.loyalty_points}
                                helper={`Niveau ${stats.loyalty_level}`}
                            />
                            <KpiCard
                                icon={RotateCcw}
                                label="Retours"
                                value={stats.pending_returns_count}
                                helper="En cours"
                            />
                        </div>

                        {/* Statistiques avancées + dépenses hebdo */}
                        <div className="grid gap-6 lg:grid-cols-3">
                            <div className="space-y-4 lg:col-span-1">
                                <KpiCard
                                    icon={TrendingUp}
                                    label="Croissance"
                                    value={`${advancedStats.order_growth}%`}
                                    trend={advancedStats.order_growth}
                                />
                                <KpiCard
                                    icon={CheckCircle2}
                                    label="Taux de complétion"
                                    value={`${advancedStats.completed_rate}%`}
                                />
                                <KpiCard
                                    icon={Target}
                                    label="Ce mois"
                                    value={advancedStats.orders_this_month}
                                    helper="commandes"
                                />
                            </div>

                            <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm lg:col-span-2 dark:border-slate-800/60 dark:bg-slate-900/70">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                                        <BarChart3 className="h-5 w-5 text-emerald-500" />
                                        Dépenses cette semaine
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="h-64">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart data={spendingChartData}>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                vertical={false}
                                                stroke="#e2e8f0"
                                            />
                                            <XAxis
                                                dataKey="day"
                                                tick={{ fontSize: 12 }}
                                            />
                                            <YAxis tick={{ fontSize: 12 }} />
                                            <Tooltip
                                                content={({
                                                    active,
                                                    payload,
                                                    label,
                                                }) => {
                                                    if (
                                                        !active ||
                                                        !payload?.length
                                                    ) {
                                                        return null;
                                                    }

                                                    const value =
                                                        payload[0]?.value;

                                                    return (
                                                        <div className="min-w-47.5 rounded-2xl border border-emerald-200/50 bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:border-emerald-800/40 dark:bg-slate-900/95">
                                                            <div className="mb-3 flex items-center justify-between">
                                                                <span className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                                                                    Jour
                                                                </span>

                                                                <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                                                                    {label}
                                                                </span>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
                                                                        <Wallet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                                    </div>

                                                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                                                        Dépenses
                                                                    </p>
                                                                </div>

                                                                <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                                                    {typeof value ===
                                                                    'number'
                                                                        ? formatPrice(
                                                                              value,
                                                                          )
                                                                        : value}
                                                                </h3>
                                                            </div>

                                                            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                                                <div className="h-full w-2/3 rounded-full bg-linear-to-r from-emerald-500 via-teal-400 to-cyan-400" />
                                                            </div>
                                                        </div>
                                                    );
                                                }}
                                            />
                                            <Bar
                                                dataKey="total"
                                                fill="#10b981"
                                                radius={[8, 8, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Graphiques commandes + répartition */}
                        <div className="grid gap-6 xl:grid-cols-3">
                            <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm xl:col-span-2 dark:border-slate-800/60 dark:bg-slate-900/70">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                                        <TrendingUp className="h-5 w-5 text-emerald-500" />
                                        Commandes (6 mois)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="h-80">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <AreaChart data={orderChartData}>
                                            <defs>
                                                <linearGradient
                                                    id="orders"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="5%"
                                                        stopColor="#10b981"
                                                        stopOpacity={0.3}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor="#10b981"
                                                        stopOpacity={0}
                                                    />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                vertical={false}
                                                stroke="#e2e8f0"
                                            />
                                            <XAxis
                                                dataKey="month"
                                                tick={{ fontSize: 12 }}
                                            />
                                            <YAxis tick={{ fontSize: 12 }} />
                                            <Tooltip />
                                            <Area
                                                type="monotone"
                                                dataKey="commandes"
                                                stroke="#10b981"
                                                fill="url(#orders)"
                                                strokeWidth={3}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Répartition
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="h-80">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <PieChart>
                                            <Pie
                                                data={statusChartData}
                                                dataKey="value"
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={5}
                                            >
                                                {statusChartData.map(
                                                    (_, index) => (
                                                        <Cell
                                                            key={index}
                                                            fill={
                                                                CHART_COLORS[
                                                                    index %
                                                                        CHART_COLORS.length
                                                                ]
                                                            }
                                                        />
                                                    ),
                                                )}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Top catégories + fidélité */}
                        <div className="grid gap-6 xl:grid-cols-2">
                            <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                                        <Tag className="h-5 w-5 text-emerald-500" />
                                        Catégories favorites
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {topCategories.map((cat) => (
                                        <div
                                            key={cat.nom}
                                            className="space-y-1.5"
                                        >
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-700 dark:text-slate-300">
                                                    {cat.nom}
                                                </span>
                                                <span className="font-medium text-slate-900 dark:text-white">
                                                    {cat.total}
                                                </span>
                                            </div>
                                            <Progress
                                                value={
                                                    (cat.total /
                                                        maxCategoryTotal) *
                                                    100
                                                }
                                                className="h-2 bg-slate-100 dark:bg-slate-800 [&>div]:bg-emerald-500"
                                            />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                                        <Gift className="h-5 w-5 text-amber-500" />
                                        Fidélité
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                Niveau
                                            </p>
                                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                                {loyalty?.niveau_libelle ??
                                                    stats.loyalty_level}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                Points
                                            </p>
                                            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                                {loyalty?.points ??
                                                    stats.loyalty_points}
                                            </p>
                                        </div>
                                    </div>
                                    <Progress
                                        value={
                                            ((loyalty?.points ?? 0) / 500) * 100
                                        }
                                        className="h-2 bg-slate-100 dark:bg-slate-800 [&>div]:bg-amber-500"
                                    />
                                    <p className="text-xs text-slate-400">
                                        500 points pour le prochain niveau
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Dernières commandes */}
                        <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                                    Dernières commandes
                                </CardTitle>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                                    asChild
                                >
                                    <Link href={tenant.orders.index().url}>
                                        Tout voir{' '}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {recentOrders.map((order) => (
                                    <Link
                                        key={order.id}
                                        href={tenant.orders.show(order.id).url}
                                        className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white p-4 transition-all hover:border-emerald-200 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                                                <Package className="h-5 w-5 text-slate-500" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 dark:text-white">
                                                    {order.numero_commande}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    {order.lignes_count}{' '}
                                                    article(s) ·{' '}
                                                    {new Date(
                                                        order.created_at,
                                                    ).toLocaleDateString(
                                                        'fr-FR',
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {getStatusBadge(order.statut)}
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                {formatPrice(order.total)}
                                            </span>
                                            <ChevronRight className="h-5 w-5 text-slate-300 transition-colors group-hover:text-emerald-500" />
                                        </div>
                                    </Link>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
