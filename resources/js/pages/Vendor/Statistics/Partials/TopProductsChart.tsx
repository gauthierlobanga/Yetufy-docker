/* eslint-disable react-hooks/static-components */
// resources/js/Pages/Vendor/Statistics/Partials/TopProductsChart.tsx

import { TrendingUp, Package2 } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    ReferenceLine,
} from 'recharts';

import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';

interface TopProduct {
    id: number | string;
    title: string;
    views_count: number;
    slug?: string;
}

interface Props {
    data: TopProduct[];
}

const COLORS = [
    '#10b981',
    '#06b6d4',
    '#3b82f6',
    '#8b5cf6',
    '#14b8a6',
    '#f59e0b',
    '#ec4899',
    '#6366f1',
    '#0ea5e9',
    '#22c55e',
];

export function TopProductsChart({ data }: Props) {
    if (!data || data.length === 0) {
        return (
            <Card className="overflow-hidden rounded-lg border border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/70">
                <CardHeader className="border-b border-slate-200/70 dark:border-slate-800/70">
                    <CardTitle className="text-slate-900 dark:text-white">
                        Produits les plus vendus
                    </CardTitle>

                    <CardDescription className="text-slate-500 dark:text-slate-400">
                        Aucune donnée disponible
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const sorted = [...data]
        .sort((a, b) => b.views_count - a.views_count)
        .slice(0, 10);

    const average = Math.round(
        sorted.reduce((sum, p) => sum + p.views_count, 0) / sorted.length,
    );

    const totalViews = sorted.reduce(
        (sum, product) => sum + product.views_count,
        0,
    );

    const chartData = sorted.map((product, idx) => ({
        name:
            product.title.length > 18
                ? `${product.title.substring(0, 18)}…`
                : product.title,
        fullName: product.title,
        value: product.views_count,
        fill: COLORS[idx % COLORS.length],
    }));

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload;

            return (
                <div className="rounded-lg border border-slate-200/70 bg-white/95 p-4 backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/95">
                    <p className="mb-1 text-sm font-semibold text-slate-900 dark:text-white">
                        {d.fullName}
                    </p>

                    <div className="flex items-center gap-2">
                        <div
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: d.fill }}
                        />

                        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                            {d.value} ventes
                        </span>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <Card className="group relative overflow-hidden rounded-lg border border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/70">
            {/* Glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.10),transparent_35%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Header */}
            <CardHeader className="relative z-10 border-b border-slate-200/70 pb-5 dark:border-slate-800/70">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-600 shadow-inner shadow-cyan-500/10 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-400">
                                <Package2 className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                                    Produits les plus vendus
                                </CardTitle>

                                <CardDescription className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Top 10 par quantités vendues
                                </CardDescription>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Badge className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                            {totalViews} ventes
                        </Badge>

                        <Badge className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                            <TrendingUp className="mr-1 h-3.5 w-3.5" />
                            Moyenne : {average}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            {/* Chart */}
            <CardContent className="relative z-10 h-107.5 p-6">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{
                            top: 20,
                            right: 10,
                            left: -10,
                            bottom: 40,
                        }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(148,163,184,0.12)"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="name"
                            tick={{
                                fontSize: 11,
                                fill: '#94a3b8',
                            }}
                            axisLine={false}
                            tickLine={false}
                            angle={-18}
                            textAnchor="end"
                            height={70}
                        />

                        <YAxis
                            tick={{
                                fontSize: 11,
                                fill: '#94a3b8',
                            }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <Tooltip
                            cursor={{
                                fill: 'rgba(148,163,184,0.06)',
                                radius: 12,
                            }}
                            content={<CustomTooltip />}
                        />

                        <ReferenceLine
                            y={average}
                            stroke="#f59e0b"
                            strokeDasharray="4 4"
                            strokeOpacity={0.7}
                            label={{
                                value: 'Moyenne',
                                fill: '#f59e0b',
                                fontSize: 11,
                                position: 'right',
                            }}
                        />

                        <Bar
                            dataKey="value"
                            radius={[12, 12, 0, 0]}
                            barSize={32}
                        >
                            {chartData.map((entry, idx) => (
                                <Cell
                                    key={idx}
                                    fill={entry.fill}
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
