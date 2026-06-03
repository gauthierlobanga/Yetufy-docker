/* eslint-disable react-hooks/static-components */
// resources/js/Pages/Vendor/Statistics/Partials/StockChart.tsx

import { PackageCheck, AlertTriangle, Boxes } from 'lucide-react';
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

interface Props {
    data: { name: string; quantity: number; fill: string }[];
}

export function StockChart({ data }: Props) {
    const totalStock = data.reduce((sum, item) => sum + item.quantity, 0);

    const lowStock = data.filter((item) => item.quantity <= 10).length;

    const chartData = [...data]
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 8);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload;

            return (
                <div className="rounded-2xl border border-slate-200/70 bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/95">
                    <div className="mb-2 flex items-center gap-2">
                        <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: d.fill }}
                        />

                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {d.name}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-500 dark:text-slate-400">
                            Quantité :
                        </span>

                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {d.quantity} unités
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
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.10),transparent_35%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Header */}
            <CardHeader className="relative z-10 border-b border-slate-200/70 pb-5 dark:border-slate-800/70">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-600 shadow-inner shadow-cyan-500/10 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-400">
                                <Boxes className="h-5 w-5" />
                            </div>

                            <div>
                                <CardTitle className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                                    État des stocks
                                </CardTitle>

                                <CardDescription className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Analyse des quantités disponibles
                                </CardDescription>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Badge className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                            <PackageCheck className="mr-1 h-3.5 w-3.5" />
                            {totalStock} unités
                        </Badge>

                        <Badge className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                            <AlertTriangle className="mr-1 h-3.5 w-3.5" />
                            {lowStock} stock faible
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            {/* Chart */}
            <CardContent className="relative z-10 h-97.5 p-6">
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
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(148,163,184,0.12)"
                            horizontal={false}
                        />

                        <XAxis
                            type="number"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fontSize: 11,
                                fill: '#94a3b8',
                            }}
                        />

                        <YAxis
                            dataKey="name"
                            type="category"
                            width={120}
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fontSize: 11,
                                fill: '#cbd5e1',
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
                            dataKey="quantity"
                            radius={[0, 12, 12, 0]}
                            barSize={22}
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={index}
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
