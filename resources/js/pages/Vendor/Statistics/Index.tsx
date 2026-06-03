/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Head, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Eye,
    Clock,
    Percent,
    TrendingUp,
    Smartphone,
    Monitor,
    Tablet,
    Globe,
    Activity,
    ArrowUpRight,
    Sparkles,
    BarChart3,
    Zap,
    DollarSign,
    ShoppingCart,
    Package,
    MapPin,
    Link as LinkIcon,
    Loader2,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    XCircle,
    TrendingDown,
    CreditCard,
    CheckCircle,
    AlertTriangle,
    Brain,
    FileText,
    HomeIcon,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import {
    FaChrome,
    FaEdge,
    FaFacebook,
    FaFirefox,
    FaInstagram,
    FaSafari,
    FaTiktok,
    FaTwitter,
} from 'react-icons/fa';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    LineChart,
    Line,
    ComposedChart,
    Sector,
} from 'recharts';

import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { VendorSidebar } from '@/components/VendorSidebar';
import { useEcho } from '@/hooks/use-echo';
import { cn } from '@/lib/utils';
import Home from '@/pages/main/home/Home';
import type { Tenant } from '@/types/tenants/products/vendor/tenant';

interface RevenueStats {
    today_revenue: number;
    weekly_revenue: number;
    monthly_revenue: number;
    yearly_revenue: number;
    growth_rate: number;
    average_order_value: number;
    average_order_value_change?: number; // ← ajout facultatif
    revenue_chart: Array<{ date: string; revenue: number; orders: number }>;
}

interface ConversionFunnel {
    visitors: number;
    product_views: number;
    add_to_cart: number;
    begin_checkout: number;
    purchases: number;
    previous_conversion_rate?: number; // ← ajout facultatif
    losses: {
        visitors_to_views: number;
        views_to_cart: number;
        cart_to_checkout: number;
        checkout_to_purchase: number;
    };
}

interface VisitorStats {
    total_visits: number;
    unique_visitors: number;
    unique_visitors_change?: number; // ← ajout facultatif
    avg_duration: number;
    bounce_rate: number;
    top_pages: Array<{ path: string; views: number }>;
    devices: Array<{ device: string; count: number }>;
    browsers: Array<{ browser: string; count: number }>;
    daily: Array<{ date: string; visits: number; uniques: number }>;
}

interface RevenueStats {
    today_revenue: number;
    weekly_revenue: number;
    monthly_revenue: number;
    yearly_revenue: number;
    growth_rate: number;
    average_order_value: number;
    revenue_chart: Array<{ date: string; revenue: number; orders: number }>;
}

interface ConversionFunnel {
    visitors: number;
    product_views: number;
    add_to_cart: number;
    begin_checkout: number;
    purchases: number;
    previous_conversion_rate?: number;
    losses: {
        visitors_to_views: number;
        views_to_cart: number;
        cart_to_checkout: number;
        checkout_to_purchase: number;
    };
}

interface TopProduct {
    product_id: string;
    views?: number;
    sold?: number;
}

interface TrafficSource {
    source: string;
    visits: number;
}

interface GeographicStat {
    country: string;
    visits: number;
    city?: string;
}

interface RealTimeStats {
    active_visitors: number;
    recent_pages: Array<{ path: string; visited_at: string }>;
}

interface VisitorStats {
    total_visits: number;
    unique_visitors: number;
    avg_duration: number;
    bounce_rate: number;
    top_pages: Array<{ path: string; views: number }>;
    devices: Array<{ device: string; count: number }>;
    browsers: Array<{ browser: string; count: number }>;
    daily: Array<{ date: string; visits: number; uniques: number }>;
}

interface AnalyticsProps {
    tenant: Tenant;
    period: string;
    visitorStats: VisitorStats;
    revenueStats: RevenueStats;
    conversionFunnel: ConversionFunnel;
    topProducts: {
        top_viewed: TopProduct[];
        top_sold: TopProduct[];
    };
    trafficSources: Array<{ source: string; visits: number }>;
    geographicStats: {
        countries: GeographicStat[];
        cities: GeographicStat[];
    };
    realTimeStats: RealTimeStats;
    aiInsights: string[];
}

export default function AnalyticsDashboard(props: AnalyticsProps) {
    const {
        tenant,
        period: initialPeriod,
        visitorStats,
        revenueStats,
        conversionFunnel,
        topProducts,
        trafficSources,
        geographicStats,
        realTimeStats: initialRealTime,
        aiInsights,
    } = props;

    const [period, setPeriod] = useState<'week' | 'month' | 'year'>(
        initialPeriod as any,
    );
    const [realTime, setRealTime] = useState(initialRealTime);
    const [loading, setLoading] = useState(false);

    const safeNumber = (value?: number | string | null) => Number(value ?? 0);

    const uniqueVisitors = safeNumber(visitorStats?.unique_visitors);
    const avgDuration = safeNumber(visitorStats?.avg_duration);
    const bounceRate = safeNumber(visitorStats?.bounce_rate);

    // Extraire les données de visitorStats (dès que visitorStats est disponible)
    const devices = visitorStats?.devices ?? [];
    const browsers = visitorStats?.browsers ?? [];
    const top_pages = visitorStats?.top_pages ?? [];
    const daily = visitorStats?.daily ?? [];

    // Calcul du total des visites à partir des devices
    const totalVisitsFromDevices = devices.reduce((acc, d) => acc + d.count, 0);
    const totalVisits = devices.reduce((acc, d) => acc + d.count, 0);

    // Couleurs
    const COLORS = {
        primary: '#10b981',
        secondary: '#64748b',
        accent: '#059669',
        highlight: '#14b8a6',
        chart: [
            '#10b981',
            '#14b8a6',
            '#06b6d4',
            '#8b5cf6',
            '#f59e0b',
            '#ef4444',
            '#3b82f6',
        ],
    };

    const colorMap: Record<string, string> = {
        slate: 'bg-slate-500',
        blue: 'bg-blue-500',
        cyan: 'bg-cyan-500',
        teal: 'bg-teal-500',
        emerald: 'bg-emerald-500',
    };

    // Données pour le camembert
    const chartData = devices.map((d, i) => ({
        ...d,
        fill: COLORS.chart[i % COLORS.chart.length],
        percent: totalVisitsFromDevices
            ? (d.count / totalVisitsFromDevices) * 100
            : 0,
    }));

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const trafficGrowth =
        totalVisits > 0
            ? Math.min(
                  Number(
                      (
                          (uniqueVisitors / Math.max(totalVisits, 1)) *
                          100
                      ).toFixed(1),
                  ),
                  100,
              )
            : 0;

    const activeUsers = Math.max(Math.round(uniqueVisitors * 0.35), 1);

    const estimatedConversion = Math.max(
        Number((100 - bounceRate / 2).toFixed(1)),
        0,
    );

    const stats = [
        {
            title: 'Visites totales',
            value: totalVisits.toLocaleString('fr-FR'),
            icon: Eye,
            growth: `+${Math.min(
                Number(
                    ((totalVisits / Math.max(uniqueVisitors, 1)) * 8).toFixed(
                        1,
                    ),
                ),
                99,
            )}%`,
            positive: true,
            description: 'Trafic global',
            color: 'from-emerald-500 to-teal-500',
            glow: 'shadow-emerald-500/20',
        },

        {
            title: 'Visiteurs uniques',
            value: uniqueVisitors.toLocaleString('fr-FR'),
            icon: Users,
            growth: `+${Math.min(
                Number(
                    ((uniqueVisitors / Math.max(totalVisits, 1)) * 100).toFixed(
                        1,
                    ),
                ),
                100,
            )}%`,
            positive: true,
            description: 'Audience active',
            color: 'from-cyan-500 to-blue-500',
            glow: 'shadow-cyan-500/20',
        },

        {
            title: 'Durée moyenne',
            value: formatDuration(avgDuration),
            icon: Clock,
            growth: `+${Math.min(Number((avgDuration / 10).toFixed(1)), 30)}%`,
            positive: true,
            description: 'Temps moyen/session',
            color: 'from-violet-500 to-fuchsia-500',
            glow: 'shadow-violet-500/20',
        },

        {
            title: 'Taux de rebond',
            value: `${bounceRate.toFixed(1)}%`,
            icon: Percent,
            growth: `-${Math.min(Number((bounceRate / 8).toFixed(1)), 25)}%`,
            positive: false,
            description: 'Sessions quittées',
            color: 'from-orange-500 to-red-500',
            glow: 'shadow-orange-500/20',
        },
    ];

    // Écouter les événements temps réel via Laravel Echo
    useEcho(`tenant.${tenant.id}`, 'VisitorActivity', (event) => {
        setRealTime((prev) => ({
            active_visitors: event.active_visitors,
            recent_pages: [event.page, ...prev.recent_pages.slice(0, 9)],
        }));
    });

    const refreshData = () => {
        setLoading(true);
        router.reload({
            only: [
                'visitorStats',
                'revenueStats',
                'conversionFunnel',
                'trafficSources',
                'geographicStats',
                'realTimeStats',
                'aiInsights',
            ],
        });
        setTimeout(() => setLoading(false), 1000);
    };

    // Formatage
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('fr-CD', {
            style: 'currency',
            currency: 'CDF',
        }).format(value);
    };

    const getDeviceIcon = (device: string) => {
        const d = device.toLowerCase();

        if (d.includes('mobile')) {
            return <Smartphone className="h-4 w-4" />;
        }

        if (d.includes('tablet')) {
            return <Tablet className="h-4 w-4" />;
        }

        return <Monitor className="h-4 w-4" />;
    };

    const getBrowserIcon = (browser: string) => {
        const b = browser.toLowerCase();

        if (b.includes('chrome')) {
            return <FaChrome className="h-4 w-4" />;
        }

        if (b.includes('firefox')) {
            return <FaFirefox className="h-4 w-4" />;
        }

        if (b.includes('edge')) {
            return <FaEdge className="h-4 w-4" />;
        }

        if (b.includes('safari')) {
            return <FaSafari className="h-4 w-4" />;
        }

        return <Globe className="h-4 w-4" />;
    };

    const getSourceIcon = (source: string) => {
        const s = source.toLowerCase();

        if (s === 'direct') {
            return <LinkIcon className="h-4 w-4 text-slate-500" />;
        }

        if (s.includes('facebook')) {
            return <FaFacebook className="h-4 w-4" />;
        }

        if (s.includes('instagram')) {
            return <FaInstagram className="h-4 w-4" />;
        }

        if (s.includes('tiktok')) {
            return <FaTiktok className="h-4 w-4" />;
        }

        if (s.includes('twitter')) {
            return <FaTwitter className="h-4 w-4" />;
        }

        if (s.includes('google')) {
            return <Globe className="h-4 w-4" />;
        }

        return <LinkIcon className="h-4 w-4" />;
    };

    return (
        <SidebarProvider
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
                <Head title={`Analytique - ${tenant.raison_sociale}`} />

                <div className="relative min-h-screen overflow-hidden bg-[#f8fafc] dark:bg-[#020617]">
                    {/* Glow décoratif */}
                    <div className="absolute top-0 left-0 h-125 w-125 rounded-full bg-emerald-500/10 blur-[120px]" />
                    <div className="absolute right-0 bottom-0 h-125 w-125 rounded-full bg-cyan-500/10 blur-[120px]" />

                    <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        {/* Header avec titre et filtres */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative mb-10 overflow-hidden rounded-[32px] border border-white/20 bg-white/70 p-8 backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/70"
                        >
                            <div className="absolute inset-0 bg-[radial-linear(circle_at_top_right,rgba(16,185,129,0.18),transparent_35%)]" />
                            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                        <Sparkles className="h-3.5 w-3.5" />
                                        Analytics
                                    </div>
                                    <h1 className="text-xl font-medium tracking-tight text-slate-900 dark:text-white">
                                        Tableau de bord analytique
                                    </h1>
                                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                        Mesures avancées du trafic, conversions,
                                        revenus et insights IA pour optimiser
                                        votre boutique.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={refreshData}
                                        disabled={loading}
                                        className="cursor-pointer rounded-xl border-slate-200/70 bg-white/50 backdrop-blur-sm"
                                    >
                                        {loading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <RefreshCw className="h-4 w-4" />
                                        )}
                                    </Button>
                                    <Tabs
                                        value={period}
                                        onValueChange={(v) =>
                                            setPeriod(v as any)
                                        }
                                    >
                                        <TabsList className="h-12 rounded-2xl border border-slate-200/70 bg-white/70 p-1 shadow-sm backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70">
                                            <TabsTrigger
                                                value="week"
                                                className="rounded-xl"
                                            >
                                                7 jours
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="month"
                                                className="rounded-xl"
                                            >
                                                30 jours
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="year"
                                                className="rounded-xl"
                                            >
                                                12 mois
                                            </TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </div>
                            </div>
                        </motion.div>

                        {/* Real-time bar */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="mb-8 overflow-hidden rounded-2xl border border-slate-200/60 bg-white/70 shadow-lg shadow-slate-200/30 backdrop-blur-2xl dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-slate-950/30"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                {/* Section gauche : indicateur de visiteurs actifs */}
                                <div className="flex items-center gap-4 border-b border-slate-200/50 px-5 py-4 lg:border-r lg:border-b-0 lg:px-6 dark:border-slate-800/50">
                                    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                                        <div className="absolute inset-0 animate-ping rounded-xl bg-emerald-500/20" />
                                        <Activity className="relative h-5 w-5 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium tracking-wider text-slate-400 dark:text-slate-500">
                                            En ligne
                                        </p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">
                                                {realTime.active_visitors}
                                            </span>
                                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                                visiteur
                                                {realTime.active_visitors > 1
                                                    ? 's'
                                                    : ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Section centrale : pages récentes sous forme de carrousel / badges */}
                                <div className="flex-1 px-5 py-4 lg:px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                            <Globe className="h-4 w-4 text-slate-500" />
                                        </div>
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                            Consultations récentes
                                        </span>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {realTime.recent_pages
                                            .slice(0, 4)
                                            .map((page, idx) => {
                                                const isHome =
                                                    page.path === '/';
                                                const displayPath = isHome
                                                    ? 'Accueil'
                                                    : page.path.replace(
                                                          /^\//,
                                                          '',
                                                      );

                                                return (
                                                    <motion.span
                                                        key={idx}
                                                        initial={{
                                                            scale: 0.9,
                                                            opacity: 0,
                                                        }}
                                                        animate={{
                                                            scale: 1,
                                                            opacity: 1,
                                                        }}
                                                        transition={{
                                                            delay: idx * 0.05,
                                                        }}
                                                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/70 bg-white/60 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-sm transition-all hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300"
                                                    >
                                                        {isHome ? (
                                                            <HomeIcon className="h-3 w-3" />
                                                        ) : (
                                                            <FileText className="h-3 w-3" />
                                                        )}
                                                        {displayPath.length > 30
                                                            ? `${displayPath.substring(0, 27)}...`
                                                            : displayPath}
                                                    </motion.span>
                                                );
                                            })}
                                        {realTime.recent_pages.length > 4 && (
                                            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                                +
                                                {realTime.recent_pages.length -
                                                    4}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Section droite : micro KPI temps réel (optionnel) */}
                                <div className="flex items-center gap-4 border-t border-slate-200/50 px-5 py-4 lg:border-t-0 lg:border-l lg:px-6 dark:border-slate-800/50">
                                    <div className="text-right">
                                        <p className="text-xs font-medium tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                            TAUX DE CLIC (est.)
                                        </p>
                                        <p className="text-lg font-bold text-slate-800 dark:text-white">
                                            {Math.round(estimatedConversion)}%
                                        </p>
                                    </div>
                                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
                                </div>
                            </div>
                        </motion.div>

                        {/* KPIs revenus et conversion - Grille 4 colonnes */}
                        <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                            {/* 1. Revenus aujourd'hui */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 }}
                                className="flex" // ← important
                            >
                                <Card className="group relative flex w-full flex-col overflow-hidden rounded-lg border border-slate-200/70 bg-white/80 dark:border-slate-800/70 dark:bg-slate-900/70">
                                    <CardContent className="relative flex flex-1 flex-col px-4 py-2">
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                        Revenus aujourd'hui
                                                    </p>
                                                    <h3 className="mt-3 text-xl font-medium tracking-tight text-slate-900 dark:text-white">
                                                        <CountUp
                                                            end={safeNumber(
                                                                revenueStats?.today_revenue,
                                                            )}
                                                            duration={1.2}
                                                            separator=" "
                                                            suffix=" FC"
                                                        />
                                                    </h3>
                                                    <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                                                        Revenus générés
                                                        aujourd'hui
                                                    </p>
                                                </div>
                                                <div className="rounded bg-linear-to-br from-emerald-500 to-teal-500 p-2.5 text-white">
                                                    <DollarSign className="h-5 w-5" />
                                                </div>
                                            </div>
                                            <div className="mt-6 flex items-center gap-3">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        'rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-xl',
                                                        safeNumber(
                                                            revenueStats?.growth_rate,
                                                        ) >= 0
                                                            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                            : 'border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400',
                                                    )}
                                                >
                                                    {safeNumber(
                                                        revenueStats?.growth_rate,
                                                    ) >= 0 ? (
                                                        <TrendingUp className="mr-1 h-3.5 w-3.5" />
                                                    ) : (
                                                        <TrendingDown className="mr-1 h-3.5 w-3.5" />
                                                    )}
                                                    {safeNumber(
                                                        revenueStats?.growth_rate,
                                                    ) > 0
                                                        ? '+'
                                                        : ''}
                                                    {safeNumber(
                                                        revenueStats?.growth_rate,
                                                    ).toFixed(1)}
                                                    %
                                                </Badge>
                                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                                    vs période précédente
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* 2. Panier moyen */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="flex"
                            >
                                <Card className="group relative flex w-full flex-col overflow-hidden rounded-lg border border-slate-200/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70">
                                    <CardContent className="relative flex flex-1 flex-col px-4 py-3">
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-500">
                                                        Panier moyen
                                                    </p>
                                                    <h3 className="mt-3 text-xl font-medium text-slate-900 dark:text-white">
                                                        <CountUp
                                                            end={safeNumber(
                                                                revenueStats?.average_order_value,
                                                            )}
                                                            duration={1}
                                                            suffix=" FC"
                                                        />
                                                    </h3>
                                                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                                        Montant moyen par
                                                        commande
                                                    </p>
                                                </div>
                                                <div className="rounded bg-linear-to-br from-cyan-500 to-blue-500 p-2.5 text-white">
                                                    <ShoppingCart className="h-5 w-5" />
                                                </div>
                                            </div>
                                            {/* Tendance du panier moyen */}
                                            {revenueStats?.average_order_value_change !==
                                                undefined && (
                                                <div className="mt-4 flex items-center gap-3">
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            'rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-xl',
                                                            safeNumber(
                                                                revenueStats.average_order_value_change,
                                                            ) >= 0
                                                                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                                : 'border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400',
                                                        )}
                                                    >
                                                        {safeNumber(
                                                            revenueStats.average_order_value_change,
                                                        ) >= 0 ? (
                                                            <TrendingUp className="mr-1 h-3.5 w-3.5" />
                                                        ) : (
                                                            <TrendingDown className="mr-1 h-3.5 w-3.5" />
                                                        )}
                                                        {safeNumber(
                                                            revenueStats.average_order_value_change,
                                                        ) > 0
                                                            ? '+'
                                                            : ''}
                                                        {safeNumber(
                                                            revenueStats.average_order_value_change,
                                                        ).toFixed(1)}
                                                        %
                                                    </Badge>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                                        vs période précédente
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* 3. Taux de conversion global */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="flex"
                            >
                                <Card className="group relative flex w-full flex-col overflow-hidden rounded-lg border border-slate-200/90 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70">
                                    <CardContent className="relative flex flex-1 flex-col px-4 py-3">
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-500">
                                                        Conversion globale
                                                    </p>
                                                    <h3 className="mt-3 text-xl font-medium text-slate-900 dark:text-white">
                                                        {conversionFunnel.visitors >
                                                        0
                                                            ? (
                                                                  (conversionFunnel.purchases /
                                                                      conversionFunnel.visitors) *
                                                                  100
                                                              ).toFixed(1)
                                                            : 0}
                                                        %
                                                    </h3>
                                                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                                        Visiteurs → Achat
                                                        finalisé
                                                    </p>
                                                </div>
                                                <div className="rounded bg-linear-to-br from-purple-500 to-pink-500 p-2.5 text-white">
                                                    <Percent className="h-5 w-5" />
                                                </div>
                                            </div>
                                            {/* Tendance de la conversion (simulée ou réelle) */}
                                            {(() => {
                                                const currentRate =
                                                    conversionFunnel.visitors >
                                                    0
                                                        ? (conversionFunnel.purchases /
                                                              conversionFunnel.visitors) *
                                                          100
                                                        : 0;
                                                // Si vous avez un taux précédent, utilisez-le ; sinon, simulation basée sur la perte visitors->views
                                                const previousRate =
                                                    conversionFunnel.previous_conversion_rate ??
                                                    currentRate *
                                                        (1 -
                                                            (conversionFunnel
                                                                .losses
                                                                ?.visitors_to_views ||
                                                                0) /
                                                                100);
                                                const convChange =
                                                    previousRate > 0
                                                        ? ((currentRate -
                                                              previousRate) /
                                                              previousRate) *
                                                          100
                                                        : 0;

                                                return (
                                                    <div className="mt-4 flex items-center gap-3">
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                'rounded-full border px-3 py-1 text-xs font-medium',
                                                                convChange >= 0
                                                                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                                    : 'border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400',
                                                            )}
                                                        >
                                                            {convChange >= 0 ? (
                                                                <TrendingUp className="mr-1 h-3.5 w-3.5" />
                                                            ) : (
                                                                <TrendingDown className="mr-1 h-3.5 w-3.5" />
                                                            )}
                                                            {convChange > 0
                                                                ? '+'
                                                                : ''}
                                                            {convChange.toFixed(
                                                                1,
                                                            )}
                                                            %
                                                        </Badge>
                                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                                            vs période
                                                            précédente
                                                        </span>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* 4. Visiteurs uniques */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex"
                            >
                                <Card className="group relative flex w-full flex-col overflow-hidden rounded-lg border border-slate-200/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70">
                                    <CardContent className="relative flex flex-1 flex-col px-4 py-3">
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="text-sm text-slate-500">
                                                        Visiteurs uniques
                                                    </p>
                                                    <h3 className="mt-3 text-xl font-medium text-slate-900 dark:text-white">
                                                        <CountUp
                                                            end={
                                                                visitorStats.unique_visitors
                                                            }
                                                            duration={1}
                                                        />
                                                    </h3>
                                                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                                        Derniers 30 jours
                                                    </p>
                                                </div>
                                                <div className="rounded bg-linear-to-br from-emerald-500 to-teal-500 p-2.5 text-white">
                                                    <Users className="h-5 w-5" />
                                                </div>
                                            </div>
                                            {/* Tendance des visiteurs uniques */}
                                            {visitorStats.unique_visitors_change !==
                                                undefined && (
                                                <div className="mt-4 flex items-center gap-3">
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            'rounded-full border px-3 py-1 text-xs font-medium',
                                                            safeNumber(
                                                                visitorStats.unique_visitors_change,
                                                            ) >= 0
                                                                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                                : 'border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400',
                                                        )}
                                                    >
                                                        {safeNumber(
                                                            visitorStats.unique_visitors_change,
                                                        ) >= 0 ? (
                                                            <TrendingUp className="mr-1 h-3.5 w-3.5" />
                                                        ) : (
                                                            <TrendingDown className="mr-1 h-3.5 w-3.5" />
                                                        )}
                                                        {safeNumber(
                                                            visitorStats.unique_visitors_change,
                                                        ) > 0
                                                            ? '+'
                                                            : ''}
                                                        {safeNumber(
                                                            visitorStats.unique_visitors_change,
                                                        ).toFixed(1)}
                                                        %
                                                    </Badge>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                                        vs période précédente
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* MINI STATS */}
                        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {/* Trafic Growth */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 }}
                            >
                                <Card className="group relative overflow-hidden rounded-lg border border-slate-200/60 bg-white/80 dark:border-slate-800/60 dark:bg-slate-900/80">
                                    <CardContent className="px-3.5 py-2.5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-normal text-slate-500 dark:text-slate-400">
                                                    Croissance trafic
                                                </p>
                                                <div className="mt-2 flex items-baseline gap-2">
                                                    <span className="text-xl font-normal tracking-tight text-slate-900 dark:text-white">
                                                        +{trafficGrowth}%
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                                    Évolution visiteurs
                                                </p>
                                            </div>
                                            <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-500 dark:bg-emerald-500/15">
                                                <TrendingUp className="h-5 w-5" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Active Users */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Card className="group relative overflow-hidden rounded-lg border border-slate-200/60 bg-white/80 dark:border-slate-800/60 dark:bg-slate-900/80">
                                    <CardContent className="px-3.5 py-2.5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-normal text-slate-500 dark:text-slate-400">
                                                    Utilisateurs actifs
                                                </p>
                                                <div className="mt-2 flex items-baseline gap-2">
                                                    <span className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                                                        {activeUsers.toLocaleString(
                                                            'fr-FR',
                                                        )}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                                    Sessions actives
                                                </p>
                                            </div>
                                            <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-500 dark:bg-emerald-500/15">
                                                <Activity className="h-5 w-5" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Conversion estimée */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                            >
                                <Card className="group relative overflow-hidden rounded-lg border border-slate-200/60 bg-white/80 dark:border-slate-800/60 dark:bg-slate-900/80">
                                    <CardContent className="px-3.5 py-2.5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-normal text-slate-500 dark:text-slate-400">
                                                    Conversion estimée
                                                </p>
                                                <div className="mt-2 flex items-baseline gap-2">
                                                    <span className="text-xl font-normal tracking-tight text-slate-900 dark:text-white">
                                                        {estimatedConversion}%
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                                    Basé sur le rebond
                                                </p>
                                            </div>
                                            <div className="rounded-lg bg-yellow-500/10 p-2.5 text-yellow-500 dark:bg-yellow-500/15">
                                                <Zap className="h-5 w-5" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Taux de rebond (nouvelle carte) */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Card className="group relative overflow-hidden rounded-lg border border-slate-200/60 bg-white/80 dark:border-slate-800/60 dark:bg-slate-900/80">
                                    <CardContent className="px-3.5 py-2.5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-normal text-slate-500 dark:text-slate-400">
                                                    Taux de rebond
                                                </p>
                                                <div className="mt-2 flex items-baseline gap-2">
                                                    <span className="text-xl font-normal tracking-tight text-slate-900 dark:text-white">
                                                        {bounceRate.toFixed(1)}%
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                                    Sessions une seule page
                                                </p>
                                            </div>
                                            <div className="rounded-lg bg-orange-500/10 p-2.5 text-orange-500 dark:bg-orange-500/15">
                                                <TrendingDown className="h-5 w-5" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Graphique revenus */}
                        <Card className="mb-4 overflow-hidden rounded-lg border border-white/20 bg-white/70 dark:border-slate-800 dark:bg-slate-900/70">
                            <div className="border-b border-slate-200/50 p-4 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="rounded bg-emerald-500/10 p-2.5 text-emerald-500">
                                        <DollarSign className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-normal text-slate-900 dark:text-white">
                                            Évolution des revenus
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            Tendance des ventes sur la période
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="px-3.5 py-4">
                                <ResponsiveContainer width="100%" height={350}>
                                    <AreaChart
                                        data={revenueStats.revenue_chart}
                                    >
                                        <defs>
                                            <linearGradient
                                                id="revenuelinear"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#10b981"
                                                    stopOpacity={0.4}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#10b981"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>

                                        <CartesianGrid
                                            strokeDasharray="4 4"
                                            stroke="rgba(148,163,184,0.12)"
                                        />

                                        <XAxis
                                            dataKey="date"
                                            stroke="#94a3b8"
                                        />

                                        <YAxis
                                            stroke="#94a3b8"
                                            tickFormatter={(v) =>
                                                formatCurrency(v)
                                            }
                                        />

                                        <RechartsTooltip
                                            formatter={(value) =>
                                                formatCurrency(value as number)
                                            }
                                        />

                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#10b981"
                                            strokeWidth={3}
                                            fill="url(#revenuelinear)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Funnel de conversion & Sources de trafic - Layout responsive */}
                        <div className="mb-8 grid gap-4 lg:grid-cols-2">
                            {/* Carte Tunnel de conversion */}
                            <Card className="overflow-hidden rounded-lg border border-slate-200/60 bg-white/80 dark:border-slate-800/60 dark:bg-slate-900/80">
                                <CardHeader className="border-b border-slate-100/50 pb-4 dark:border-slate-800/50">
                                    <div className="flex items-center gap-2">
                                        <div className="rounded bg-emerald-500/10 p-2 text-emerald-500">
                                            <TrendingUp className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base font-normal">
                                                Tunnel de conversion
                                            </CardTitle>
                                            <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                                                Parcours client étape par étape
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-3.5 py-4">
                                    {/* Indicateurs synthétiques */}
                                    <div className="mb-6 grid grid-cols-2 gap-3">
                                        <div className="rounded-xl bg-linear-to-br from-emerald-50 to-white p-4 shadow-sm dark:from-emerald-950/20 dark:to-slate-900">
                                            <p className="text-xs text-slate-500">
                                                Conversion globale
                                            </p>
                                            <p className="text-base font-medium text-emerald-600 dark:text-emerald-400">
                                                {conversionFunnel.visitors > 0
                                                    ? (
                                                          (conversionFunnel.purchases /
                                                              conversionFunnel.visitors) *
                                                          100
                                                      ).toFixed(1)
                                                    : 0}
                                                %
                                            </p>
                                            <p className="mt-1 text-xs text-slate-400">
                                                visiteurs → achats
                                            </p>
                                        </div>
                                        <div className="rounded-lg bg-linear-to-br from-slate-50 to-white p-4 shadow-sm dark:from-slate-800/50 dark:to-slate-900">
                                            <p className="text-xs text-slate-500">
                                                Achats finalisés
                                            </p>
                                            <p className="text-base font-medium text-slate-800 dark:text-white">
                                                {conversionFunnel.purchases}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-400">
                                                commandes terminées
                                            </p>
                                        </div>
                                    </div>

                                    {/* Étapes du funnel */}
                                    <div className="space-y-5">
                                        {[
                                            {
                                                label: 'Visiteurs',
                                                value: conversionFunnel.visitors,
                                                icon: 'Users',
                                                color: 'slate',
                                            },
                                            {
                                                label: 'Pages produits',
                                                value: conversionFunnel.product_views,
                                                icon: 'Package',
                                                color: 'blue',
                                            },
                                            {
                                                label: 'Ajouts panier',
                                                value: conversionFunnel.add_to_cart,
                                                icon: 'ShoppingCart',
                                                color: 'cyan',
                                            },
                                            {
                                                label: 'Checkout',
                                                value: conversionFunnel.begin_checkout,
                                                icon: 'CreditCard',
                                                color: 'teal',
                                            },
                                            {
                                                label: 'Achats',
                                                value: conversionFunnel.purchases,
                                                icon: 'CheckCircle',
                                                color: 'emerald',
                                            },
                                        ].map((step, idx) => {
                                            const percent =
                                                conversionFunnel.visitors > 0
                                                    ? (step.value /
                                                          conversionFunnel.visitors) *
                                                      100
                                                    : 0;

                                            // Définir les pertes comme un tableau constant
                                            const lossValues = [
                                                conversionFunnel.losses
                                                    .visitors_to_views,
                                                conversionFunnel.losses
                                                    .views_to_cart,
                                                conversionFunnel.losses
                                                    .cart_to_checkout,
                                                conversionFunnel.losses
                                                    .checkout_to_purchase,
                                            ] as const; // `as const` garantit que TypeScript connaît la longueur

                                            return (
                                                <div key={step.label}>
                                                    <div className="mb-1 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className={`rounded p-1 ${colorMap[step.color]} bg-opacity-10`}
                                                            >
                                                                {step.icon ===
                                                                    'Users' && (
                                                                    <Users className="h-4 w-4 text-slate-500" />
                                                                )}
                                                                {step.icon ===
                                                                    'Package' && (
                                                                    <Package className="h-4 w-4 text-blue-500" />
                                                                )}
                                                                {step.icon ===
                                                                    'ShoppingCart' && (
                                                                    <ShoppingCart className="h-4 w-4 text-cyan-500" />
                                                                )}
                                                                {step.icon ===
                                                                    'CreditCard' && (
                                                                    <CreditCard className="h-4 w-4 text-teal-500" />
                                                                )}
                                                                {step.icon ===
                                                                    'CheckCircle' && (
                                                                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                                                                )}
                                                            </div>
                                                            <span className="text-sm font-normal text-slate-700 dark:text-slate-300">
                                                                {step.label}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-normal text-slate-900 dark:text-white">
                                                                {step.value.toLocaleString()}
                                                            </span>
                                                            <span className="text-xs text-slate-400">
                                                                (
                                                                {percent.toFixed(
                                                                    1,
                                                                )}
                                                                %)
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="relative h-2 w-full overflow-hidden rounded bg-slate-100 dark:bg-slate-800">
                                                        <motion.div
                                                            initial={{
                                                                width: 0,
                                                            }}
                                                            animate={{
                                                                width: `${percent}%`,
                                                            }}
                                                            transition={{
                                                                duration: 0.8,
                                                                ease: 'easeOut',
                                                            }}
                                                            className={`absolute inset-y-0 left-0 rounded ${colorMap[step.color]}`}
                                                        />
                                                    </div>
                                                    {idx < 4 && (
                                                        <div className="mt-1 flex items-center justify-end gap-1 text-xs">
                                                            <span className="text-red-500">
                                                                Perte :{' '}
                                                                {
                                                                    lossValues[
                                                                        idx
                                                                    ]
                                                                }
                                                                %
                                                            </span>
                                                            {lossValues[idx] >
                                                                50 && (
                                                                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Carte Sources de trafic */}
                            <Card className="overflow-hidden rounded-lg border border-slate-200/60 bg-white/80 dark:border-slate-800/60 dark:bg-slate-900/80">
                                <CardHeader className="border-b border-slate-100/50 pb-4 dark:border-slate-800/50">
                                    <div className="flex items-center gap-2">
                                        <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
                                            <Globe className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base font-medium">
                                                Sources de trafic
                                            </CardTitle>
                                            <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                                                Origine des visiteurs
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {trafficSources.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                            <Globe className="mb-3 h-10 w-10 text-slate-400" />
                                            <p className="text-sm text-slate-500">
                                                Aucune donnée disponible
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                Les sources apparaîtront ici
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mb-4 flex justify-end">
                                                <div className="rounded bg-slate-100 px-3 py-1 text-xs font-normal text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                    Total :{' '}
                                                    {trafficSources
                                                        .reduce(
                                                            (acc, s) =>
                                                                acc + s.visits,
                                                            0,
                                                        )
                                                        .toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                {trafficSources.map(
                                                    (source) => {
                                                        const total =
                                                            trafficSources.reduce(
                                                                (acc, s) =>
                                                                    acc +
                                                                    s.visits,
                                                                0,
                                                            );
                                                        const percent =
                                                            total > 0
                                                                ? (source.visits /
                                                                      total) *
                                                                  100
                                                                : 0;

                                                        return (
                                                            <div
                                                                key={
                                                                    source.source
                                                                }
                                                                className="group"
                                                            >
                                                                <div className="mb-1 flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        {getSourceIcon(
                                                                            source.source,
                                                                        )}
                                                                        <span className="text-sm font-normal text-slate-700 dark:text-slate-300">
                                                                            {
                                                                                source.source
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-sm font-medium text-slate-800 dark:text-white">
                                                                            {source.visits.toLocaleString()}
                                                                        </span>
                                                                        <span className="text-xs text-slate-400">
                                                                            (
                                                                            {percent.toFixed(
                                                                                1,
                                                                            )}
                                                                            %)
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="relative h-2 w-full overflow-hidden rounded bg-slate-100 dark:bg-slate-800">
                                                                    <motion.div
                                                                        initial={{
                                                                            width: 0,
                                                                        }}
                                                                        animate={{
                                                                            width: `${percent}%`,
                                                                        }}
                                                                        transition={{
                                                                            duration: 0.5,
                                                                            ease: 'easeOut',
                                                                        }}
                                                                        className="absolute inset-y-0 left-0 rounded bg-linear-to-r from-emerald-500 to-teal-500"
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Top produits et géographie */}
                        <div className="mb-8 grid gap-6 lg:grid-cols-2">
                            <Card className="rounded-lg border border-white/20 bg-white/70 dark:border-slate-800 dark:bg-slate-900/70">
                                <CardHeader>
                                    <CardTitle className="text-lg font-medium">
                                        Produits les plus vendus
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {topProducts.top_sold.map(
                                            (product, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800"
                                                >
                                                    <span className="max-w-50 truncate text-sm">
                                                        Produit{' '}
                                                        {product.product_id.slice(
                                                            0,
                                                            8,
                                                        )}
                                                    </span>
                                                    <span className="font-medium text-emerald-600">
                                                        {product.sold} vendus
                                                    </span>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-lg border border-white/20 bg-white/70 backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/70">
                                <CardHeader>
                                    <CardTitle className="text-base font-medium">
                                        Géolocalisation
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {geographicStats.countries.map(
                                            (country, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-between"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-emerald-500" />
                                                        <span className="text-sm">
                                                            {country.country}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm font-medium">
                                                        {country.visits} visites
                                                    </span>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* AI Insights */}
                        <Card className="mb-8 overflow-hidden rounded-lg border border-amber-200/50 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/20">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center justify-between gap-2 text-amber-700 dark:text-amber-300">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-5 w-5" />
                                        Insights IA
                                        <Badge
                                            variant="outline"
                                            className="ml-2 border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                                        >
                                            En direct
                                        </Badge>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={refreshData}
                                        className="h-8 w-8 rounded-full p-0 text-amber-600 hover:bg-amber-100 hover:text-amber-700 dark:text-amber-400 dark:hover:bg-amber-900/30"
                                        disabled={loading}
                                    >
                                        <RefreshCw
                                            className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                                        />
                                    </Button>
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 text-amber-600/80 dark:text-amber-400/80">
                                    <Brain className="h-4 w-4" />
                                    <span>
                                        Insights intelligents générés à partir
                                        de vos données en temps réel
                                    </span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {aiInsights.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center text-amber-600/60 dark:text-amber-400/60">
                                        <Zap className="mb-3 h-10 w-10" />
                                        <p>Aucun insight pour le moment.</p>
                                        <p className="text-xs">
                                            Revenez plus tard pour des analyses
                                            automatiques.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {aiInsights.map((insight, idx) => {
                                            const isPositive =
                                                insight.includes('hausse') ||
                                                insight.includes(
                                                    'augmentation',
                                                ) ||
                                                insight.includes('excellente');
                                            const isWarning =
                                                insight.includes('abandons') ||
                                                insight.includes('baisse') ||
                                                insight.includes('faible');
                                            const icon = isPositive ? (
                                                <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                            ) : isWarning ? (
                                                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                                            ) : (
                                                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                                            );
                                            const bgClass = isPositive
                                                ? 'bg-emerald-50 dark:bg-emerald-950/30'
                                                : isWarning
                                                  ? 'bg-amber-50 dark:bg-amber-950/30'
                                                  : 'bg-amber-50/50 dark:bg-amber-950/20';

                                            return (
                                                <div
                                                    key={idx}
                                                    className={`flex items-start gap-3 rounded-lg p-3 ${bgClass} transition-all hover:shadow-sm`}
                                                >
                                                    {icon}
                                                    <span className="flex-1 text-sm text-amber-800 dark:text-amber-200">
                                                        {insight}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                {aiInsights.length > 0 && (
                                    <div className="mt-4 text-center text-xs text-amber-600/60 dark:text-amber-400/60">
                                        Ces analyses sont générées
                                        automatiquement à partir de vos données.
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Graphique évolution des visites */}
                        <Card className="mb-8 overflow-hidden rounded-lg border border-white/20 bg-white/70 dark:border-slate-800 dark:bg-slate-900/70">
                            <div className="border-b border-slate-200/50 p-4 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-500">
                                        <BarChart3 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-medium text-slate-900 dark:text-white">
                                            Évolution des visites
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            Tendances des visiteurs et sessions
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={daily}>
                                        <defs>
                                            <linearGradient
                                                id="colorVisits"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#10b981"
                                                    stopOpacity={0.4}
                                                />
                                                <stop
                                                    offset="98%"
                                                    stopColor="#10b981"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>

                                        <CartesianGrid
                                            strokeDasharray="4 4"
                                            stroke="rgba(148,163,184,0.12)"
                                        />

                                        <XAxis
                                            dataKey="date"
                                            stroke="#94a3b8"
                                        />
                                        <YAxis stroke="#94a3b8" />

                                        <RechartsTooltip />

                                        <Area
                                            type="monotone"
                                            dataKey="visits"
                                            stroke="#10b981"
                                            strokeWidth={1}
                                            fill="url(#colorVisits)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Top pages et appareils */}
                        <div className="grid gap-5 lg:grid-cols-2">
                            {/* TOP PAGES */}
                            <Card className="rounded-lg border border-white/20 bg-white/70 dark:border-slate-800 dark:bg-slate-900/70">
                                <CardContent className="px-3 py-4">
                                    <div className="mb-6 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-base font-medium text-slate-900 dark:text-white">
                                                Pages populaires
                                            </h3>
                                            <p className="text-sm text-slate-500">
                                                Les pages les plus consultées
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {top_pages
                                            ?.slice(0, 5)
                                            .map((page, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 p-2.5 transition-all hover:bg-slate-100/70 dark:border-slate-800 dark:bg-slate-800/40"
                                                >
                                                    <div>
                                                        <p className="font-normal text-slate-900 dark:text-white">
                                                            {page.path}
                                                        </p>
                                                    </div>
                                                    <div className="rounded-lg bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                                        {page.views}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* DEVICES */}
                            <Card className="rounded-lg border border-slate-200/60 bg-white/80 transition-all hover:shadow-2xl dark:border-slate-800/60 dark:bg-slate-900/80">
                                <CardContent className="px-3 py-4">
                                    <div className="mb-6">
                                        <h3 className="text-base font-medium text-slate-900 dark:text-white">
                                            Répartition appareils
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Utilisation selon les appareils
                                        </p>
                                    </div>

                                    {(() => {
                                        // 1. Nettoyer et regrouper les appareils
                                        const cleanedDevices = devices
                                            .map((d) => ({
                                                ...d,
                                                // Renommer les valeurs non significatives en "Autre"
                                                device:
                                                    d.device === 'WebKit' ||
                                                    d.device === '0' ||
                                                    d.device === ''
                                                        ? 'Autre'
                                                        : d.device,
                                            }))
                                            // 2. Regrouper par nom d'appareil (car plusieurs "Autre" peuvent exister)
                                            .reduce(
                                                (acc, curr) => {
                                                    const existing = acc.find(
                                                        (item) =>
                                                            item.device ===
                                                            curr.device,
                                                    );

                                                    if (existing) {
                                                        existing.count +=
                                                            curr.count;
                                                    } else {
                                                        acc.push({
                                                            device: curr.device,
                                                            count: curr.count,
                                                        });
                                                    }

                                                    return acc;
                                                },
                                                [] as Array<{
                                                    device: string;
                                                    count: number;
                                                }>,
                                            )
                                            // 3. Exclure les entrées avec count <= 0
                                            .filter((d) => d.count > 0);

                                        const totalVisits =
                                            cleanedDevices.reduce(
                                                (sum, d) => sum + d.count,
                                                0,
                                            );
                                        const chartData = cleanedDevices.map(
                                            (d, i) => ({
                                                ...d,
                                                fill: COLORS.chart[
                                                    i % COLORS.chart.length
                                                ],
                                                percent:
                                                    totalVisits > 0
                                                        ? (d.count /
                                                              totalVisits) *
                                                          100
                                                        : 0,
                                            }),
                                        );

                                        if (cleanedDevices.length === 0) {
                                            return (
                                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                                        <Smartphone className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                                                    </div>
                                                    <h4 className="text-base font-semibold text-slate-700 dark:text-slate-300">
                                                        Aucune donnée d’appareil
                                                    </h4>
                                                    <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                                                        Aucune visite n’a encore
                                                        été enregistrée ou les
                                                        données ne sont pas
                                                        disponibles.
                                                    </p>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            router.reload()
                                                        }
                                                        className="mt-4 rounded-full border-slate-200 bg-white/80 text-slate-600 shadow-sm backdrop-blur-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300"
                                                    >
                                                        <RefreshCw className="mr-2 h-3.5 w-3.5" />
                                                        Rafraîchir
                                                    </Button>
                                                </div>
                                            );
                                        }

                                        return (
                                            <>
                                                <ResponsiveContainer
                                                    width="100%"
                                                    height={280}
                                                >
                                                    <PieChart>
                                                        <Pie
                                                            data={chartData}
                                                            dataKey="count"
                                                            nameKey="device"
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={70}
                                                            outerRadius={105}
                                                            paddingAngle={4}
                                                            stroke="none"
                                                            isAnimationActive
                                                            labelLine={false}
                                                            label={({
                                                                name,
                                                                percent,
                                                            }: any) => {
                                                                const p =
                                                                    percent ??
                                                                    0;

                                                                return `${name ?? ''} ${p.toFixed(1)}%`;
                                                            }}
                                                        />
                                                        <RechartsTooltip
                                                            content={({
                                                                active,
                                                                payload,
                                                            }) => {
                                                                if (
                                                                    active &&
                                                                    payload?.length
                                                                ) {
                                                                    const data =
                                                                        payload[0]
                                                                            .payload;

                                                                    return (
                                                                        <div className="rounded-lg border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/95">
                                                                            <p className="font-medium text-slate-800 dark:text-white">
                                                                                {
                                                                                    data.device
                                                                                }
                                                                            </p>
                                                                            <p className="text-sm text-emerald-600 dark:text-emerald-400">
                                                                                {
                                                                                    data.count
                                                                                }{' '}
                                                                                visites
                                                                            </p>
                                                                            <p className="text-xs text-slate-500">
                                                                                {data.percent?.toFixed(
                                                                                    1,
                                                                                ) ??
                                                                                    0}

                                                                                %
                                                                                du
                                                                                total
                                                                            </p>
                                                                        </div>
                                                                    );
                                                                }

                                                                return null;
                                                            }}
                                                        />
                                                    </PieChart>
                                                </ResponsiveContainer>

                                                {/* Légende avec tooltips shadcn */}
                                                <div className="mt-6 grid grid-cols-2 gap-3">
                                                    {cleanedDevices.map(
                                                        (device, idx) => {
                                                            const percent =
                                                                totalVisits > 0
                                                                    ? (device.count /
                                                                          totalVisits) *
                                                                      100
                                                                    : 0;

                                                            return (
                                                                <TooltipProvider
                                                                    key={idx}
                                                                >
                                                                    <Tooltip
                                                                        delayDuration={
                                                                            200
                                                                        }
                                                                    >
                                                                        <TooltipTrigger
                                                                            asChild
                                                                        >
                                                                            <div className="group flex cursor-help items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 transition-all hover:border-emerald-200 hover:bg-emerald-50/50 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-emerald-800/50 dark:hover:bg-emerald-950/20">
                                                                                <div className="text-emerald-500 transition-transform group-hover:scale-110">
                                                                                    {getDeviceIcon(
                                                                                        device.device,
                                                                                    )}
                                                                                </div>
                                                                                <div className="flex-1">
                                                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                                                        {
                                                                                            device.device
                                                                                        }
                                                                                    </p>
                                                                                    <div className="flex items-center justify-between">
                                                                                        <p className="text-xs text-slate-500">
                                                                                            {
                                                                                                device.count
                                                                                            }{' '}
                                                                                            visites
                                                                                        </p>
                                                                                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                                                            {percent.toFixed(
                                                                                                1,
                                                                                            )}

                                                                                            %
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent
                                                                            side="top"
                                                                            className="max-w-xs rounded-xl border-slate-200 bg-white/95 text-slate-700 shadow-lg backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200"
                                                                        >
                                                                            <p>
                                                                                <span className="font-semibold">
                                                                                    {
                                                                                        device.device
                                                                                    }
                                                                                </span>{' '}
                                                                                représente{' '}
                                                                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                                                                    {percent.toFixed(
                                                                                        1,
                                                                                    )}

                                                                                    %
                                                                                </span>{' '}
                                                                                des
                                                                                sessions.
                                                                            </p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            </>
                                        );
                                    })()}
                                </CardContent>
                            </Card>
                        </div>

                        {/* BROWSERS */}
                        <Card className="mt-8 rounded border border-white/20 bg-white/70 dark:border-slate-800 dark:bg-slate-900/70">
                            <CardContent className="px-3 py-4">
                                <div className="mb-6 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-base font-medium text-slate-900 dark:text-white">
                                            Navigateurs utilisés
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            Répartition des visiteurs
                                        </p>
                                    </div>
                                </div>

                                {/* Filtrer les navigateurs invalides (nom vide, "0", null) */}
                                {(() => {
                                    const validBrowsers = browsers.filter(
                                        (b) =>
                                            b.browser &&
                                            b.browser !== '0' &&
                                            b.browser.trim() !== '' &&
                                            typeof b.count === 'number' &&
                                            b.count > 0,
                                    );
                                    const totalVisits = validBrowsers.reduce(
                                        (sum, b) => sum + b.count,
                                        0,
                                    );

                                    if (validBrowsers.length === 0) {
                                        return (
                                            <div className="py-8 text-center text-slate-400">
                                                Aucune donnée de navigateur
                                                disponible
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="space-y-5">
                                            {validBrowsers.map(
                                                (browser, idx) => {
                                                    const percent =
                                                        totalVisits > 0
                                                            ? (browser.count /
                                                                  totalVisits) *
                                                              100
                                                            : 0;

                                                    return (
                                                        <div key={idx}>
                                                            <div className="mb-2 flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="text-emerald-500">
                                                                        {getBrowserIcon(
                                                                            browser.browser,
                                                                        )}
                                                                    </div>
                                                                    <span className="font-medium text-slate-900 dark:text-white">
                                                                        {
                                                                            browser.browser
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                                                    {
                                                                        browser.count
                                                                    }{' '}
                                                                    visites
                                                                </span>
                                                            </div>
                                                            <div className="h-3 overflow-hidden rounded bg-slate-100 dark:bg-slate-800">
                                                                <div
                                                                    className="h-full bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500"
                                                                    style={{
                                                                        width: `${percent}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    );
                                })()}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
