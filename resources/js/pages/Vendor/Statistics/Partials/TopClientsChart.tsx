/* eslint-disable react-hooks/static-components */

// resources/js/Pages/Vendor/Statistics/Partials/TopClientsChart.tsx

import { Crown, Sparkles, TrendingUp, Users } from 'lucide-react';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';

import { Badge } from '@/components/ui/badge';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';

interface TopClient {
    id: number | string;
    name: string;
    avatar_url?: string | null;
    total_spent: number;
    orders_count: number;
}

interface Props {
    data: TopClient[];
}

const GRADIENT_COLORS = [
    ['#10b981', '#34d399'],
    ['#3b82f6', '#60a5fa'],
    ['#8b5cf6', '#a78bfa'],
    ['#f59e0b', '#fbbf24'],
    ['#06b6d4', '#22d3ee'],
];

const safeNumber = (v: any) => Number(v ?? 0) || 0;

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('fr-CD', {
        style: 'currency',
        currency: 'CDF',
        maximumFractionDigits: 0,
    }).format(value);

const formatCompactCurrency = (value: number) =>
    new Intl.NumberFormat('fr-CD', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(value);

export function TopClientsChart({ data }: Props) {
    if (!data || data.length === 0) {
        return (
            <Card className="rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/80">
                <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white">
                        Meilleurs clients
                    </CardTitle>

                    <CardDescription className="text-slate-500 dark:text-slate-400">
                        Aucune donnée disponible
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const sorted = [...data]
        .map((client) => ({
            ...client,
            total_spent: safeNumber(client.total_spent),
            orders_count: safeNumber(client.orders_count),
        }))
        .sort((a, b) => b.total_spent - a.total_spent)
        .slice(0, 8);

    const totalRevenue = sorted.reduce(
        (sum, client) => sum + client.total_spent,
        0,
    );

    const totalOrders = sorted.reduce(
        (sum, client) => sum + client.orders_count,
        0,
    );

    const bestClient = sorted[0];

    const chartData = sorted
        .map((client, idx) => ({
            name:
                client.name.length > 16
                    ? `${client.name.slice(0, 16)}…`
                    : client.name,

            fullName: client.name,

            value: client.total_spent,

            orders: client.orders_count,

            gradientId: `gradient-client-${idx}`,

            gradientColors: GRADIENT_COLORS[idx % GRADIENT_COLORS.length],
        }))
        .reverse();

    const CustomTooltip = ({ active, payload }: any) => {
        if (!active || !payload?.length) {
            return null;
        }

        const d = payload[0].payload;

        return (
            <div className="min-w-55 rounded-lg border border-slate-200/80 bg-white/95 p-4 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/95">
                <div className="space-y-2">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {d.fullName}
                    </p>

                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            Revenus
                        </span>

                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(d.value)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            Commandes
                        </span>

                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {d.orders}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Card className="group relative overflow-hidden rounded-lg border border-slate-200/70 bg-white/80 backdrop-blur-2xl transition-all duration-300 hover:border-emerald-300/40 dark:border-slate-800/70 dark:bg-slate-900/80 dark:shadow-black/20">
            {/* Glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_35%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Header */}
            <CardHeader className="relative z-10 space-y-5 border-b border-slate-200/60 pb-5 dark:border-slate-800/60">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-3">
                        <Badge className="w-fit rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-400">
                            <Sparkles className="mr-1 h-3.5 w-3.5" />
                            Top clients
                        </Badge>

                        <div>
                            <CardTitle className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                                Meilleurs clients
                            </CardTitle>

                            <CardDescription className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Clients générant le plus de revenus
                            </CardDescription>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-3">
                        <Badge className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                            <TrendingUp className="mr-1 h-3.5 w-3.5" />
                            {formatCompactCurrency(totalRevenue)}
                        </Badge>

                        <Badge className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-700 dark:text-cyan-400">
                            <Users className="mr-1 h-3.5 w-3.5" />
                            {totalOrders} commandes
                        </Badge>
                    </div>
                </div>

                {/* Best client */}
                <div className="flex items-center gap-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 backdrop-blur-xl">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15">
                        <Crown className="h-5 w-5 text-amber-500" />
                    </div>

                    <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                            {bestClient?.name}
                        </div>

                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            Meilleur client du classement
                        </div>
                    </div>
                </div>
            </CardHeader>

            {/* Chart */}
            <CardContent className="relative z-10 h-68 p-6">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{
                            top: 10,
                            right: 10,
                            left: 20,
                            bottom: 10,
                        }}
                        barCategoryGap={10}
                    >
                        <defs>
                            {chartData.map((entry) => (
                                <linearGradient
                                    key={entry.gradientId}
                                    id={entry.gradientId}
                                    x1="0"
                                    y1="0"
                                    x2="1"
                                    y2="0"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor={entry.gradientColors[0]}
                                        stopOpacity={0.9}
                                    />

                                    <stop
                                        offset="100%"
                                        stopColor={entry.gradientColors[1]}
                                        stopOpacity={1}
                                    />
                                </linearGradient>
                            ))}
                        </defs>

                        <CartesianGrid
                            horizontal={false}
                            stroke="rgba(148,163,184,0.12)"
                        />

                        <XAxis
                            type="number"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: '#94a3b8',
                                fontSize: 11,
                            }}
                            tickFormatter={formatCompactCurrency}
                        />

                        <YAxis
                            dataKey="name"
                            type="category"
                            width={120}
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: '#cbd5e1',
                                fontSize: 11,
                            }}
                        />

                        <Tooltip
                            cursor={{
                                fill: 'rgba(148,163,184,0.06)',
                                radius: 12,
                            }}
                            content={<CustomTooltip />}
                        />

                        <Bar
                            dataKey="value"
                            radius={[0, 12, 12, 0]}
                            barSize={22}
                        >
                            {chartData.map((entry, idx) => (
                                <Cell
                                    key={idx}
                                    fill={`url(#${entry.gradientId})`}
                                    className="transition-opacity duration-300 hover:opacity-80"
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
