/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/Pages/Vendor/Statistics/Partials/ChartRevenueOverTime.tsx

import { TrendingUp, Wallet, ShoppingCart, Activity } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    TooltipProps,
    XAxis,
    YAxis,
} from 'recharts';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface SalesPoint {
    date: string;
    revenue: number;
    orders: number;
}

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

export function ChartRevenueOverTime({ data }: { data: SalesPoint[] }) {
    const [range, setRange] = useState('90d');

    const filtered = useMemo(() => {
        const now = new Date();

        const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;

        return data.filter((d) => {
            const dDate = new Date(d.date);

            return dDate >= new Date(now.getTime() - days * 86400000);
        });
    }, [data, range]);

    const totalRevenue = filtered.reduce((sum, item) => sum + item.revenue, 0);

    const totalOrders = filtered.reduce((sum, item) => sum + item.orders, 0);

    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const growth =
        filtered.length >= 2
            ? (
                  ((filtered[filtered.length - 1]?.revenue -
                      filtered[0]?.revenue) /
                      Math.max(filtered[0]?.revenue, 1)) *
                  100
              ).toFixed(1)
            : '0';

    return (
        <Card className="group relative overflow-hidden rounded-lg border border-slate-200/60 bg-white/80 backdrop-blur-xl transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900/70">
            {/* Background premium */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-0 right-0 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />

                <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-teal-500/10 blur-3xl" />

                <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.02),transparent)] dark:bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.03),transparent)]" />
            </div>

            <CardHeader className="relative z-10 space-y-6 border-b border-slate-200/60 p-6 dark:border-slate-800/60">
                {/* Top */}
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            <Activity className="h-3.5 w-3.5" />
                            Analytics temps réel
                        </div>

                        <div>
                            <CardTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                Chiffre d'affaires
                            </CardTitle>

                            <CardDescription className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Évolution des revenus et commandes sur la
                                période sélectionnée.
                            </CardDescription>
                        </div>

                        <div className="flex items-end gap-3">
                            <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                                {formatCurrency(totalRevenue)}
                            </div>

                            <div className="mb-1 inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                <TrendingUp className="h-3.5 w-3.5" />+{growth}%
                            </div>
                        </div>
                    </div>

                    <ToggleGroup
                        type="single"
                        value={range}
                        onValueChange={(value) => {
                            if (value) {
                                setRange(value);
                            }
                        }}
                        className="rounded-2xl border border-slate-200/70 bg-slate-100/80 p-1 shadow-inner dark:border-slate-700/70 dark:bg-slate-800/70"
                    >
                        <ToggleGroupItem
                            value="7d"
                            className="rounded-xl px-4 text-xs font-semibold data-[state=on]:bg-emerald-500 data-[state=on]:text-white"
                        >
                            7 jours
                        </ToggleGroupItem>

                        <ToggleGroupItem
                            value="30d"
                            className="rounded-xl px-4 text-xs font-semibold data-[state=on]:bg-emerald-500 data-[state=on]:text-white"
                        >
                            30 jours
                        </ToggleGroupItem>

                        <ToggleGroupItem
                            value="90d"
                            className="rounded-xl px-4 text-xs font-semibold data-[state=on]:bg-emerald-500 data-[state=on]:text-white"
                        >
                            3 mois
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-sm backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/40">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Revenus
                            </div>

                            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                                <Wallet className="h-4 w-4" />
                            </div>
                        </div>

                        <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
                            {formatCompactCurrency(totalRevenue)}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-sm backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/40">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Commandes
                            </div>

                            <div className="rounded-xl bg-cyan-500/10 p-2 text-cyan-600 dark:text-cyan-400">
                                <ShoppingCart className="h-4 w-4" />
                            </div>
                        </div>

                        <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
                            {totalOrders}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-sm backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/40">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Panier moyen
                            </div>

                            <div className="rounded-xl bg-violet-500/10 p-2 text-violet-600 dark:text-violet-400">
                                <TrendingUp className="h-4 w-4" />
                            </div>
                        </div>

                        <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
                            {formatCompactCurrency(averageOrderValue)}
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="relative z-10 px-2 pt-6 pb-4 sm:px-6">
                <ChartContainer
                    config={{
                        revenue: {
                            label: 'Revenus',
                            color: '#10b981',
                        },
                    }}
                    className="h-95 w-full"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={filtered}
                            margin={{
                                top: 10,
                                right: 10,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <defs>
                                <linearGradient
                                    id="fillRevenue"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="#10b981"
                                        stopOpacity={0.45}
                                    />

                                    <stop
                                        offset="50%"
                                        stopColor="#10b981"
                                        stopOpacity={0.15}
                                    />

                                    <stop
                                        offset="95%"
                                        stopColor="#10b981"
                                        stopOpacity={0}
                                    />
                                </linearGradient>

                                <filter
                                    id="shadow"
                                    x="-50%"
                                    y="-50%"
                                    width="200%"
                                    height="200%"
                                >
                                    <feDropShadow
                                        dx="0"
                                        dy="8"
                                        stdDeviation="10"
                                        floodColor="#10b981"
                                        floodOpacity="0.25"
                                    />
                                </filter>
                            </defs>

                            <CartesianGrid
                                vertical={false}
                                strokeDasharray="3 3"
                                stroke="rgba(148,163,184,0.18)"
                            />

                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={12}
                                minTickGap={24}
                                tick={{
                                    fill: '#94a3b8',
                                    fontSize: 12,
                                    fontWeight: 500,
                                }}
                                tickFormatter={(value) =>
                                    new Date(value).toLocaleDateString(
                                        'fr-FR',
                                        {
                                            day: '2-digit',
                                            month: 'short',
                                        },
                                    )
                                }
                            />

                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                width={80}
                                tick={{
                                    fill: '#94a3b8',
                                    fontSize: 12,
                                }}
                                tickFormatter={(value) =>
                                    formatCompactCurrency(value)
                                }
                            />

                            <ChartTooltip
                                cursor={{
                                    stroke: '#10b981',
                                    strokeWidth: 1,
                                    strokeDasharray: '4 4',
                                }}
                                content={
                                    <ChartTooltipContent
                                        className="rounded-2xl border border-slate-200/70 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/95"
                                        formatter={(value) => [
                                            formatCurrency(Number(value)),
                                            'Revenus',
                                        ]}
                                        labelFormatter={(label) =>
                                            new Date(label).toLocaleDateString(
                                                'fr-FR',
                                                {
                                                    weekday: 'long',
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric',
                                                },
                                            )
                                        }
                                    />
                                }
                            />

                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#10b981"
                                strokeWidth={3}
                                fill="url(#fillRevenue)"
                                filter="url(#shadow)"
                                activeDot={{
                                    r: 6,
                                    strokeWidth: 3,
                                    fill: '#10b981',
                                    stroke: '#ffffff',
                                }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
