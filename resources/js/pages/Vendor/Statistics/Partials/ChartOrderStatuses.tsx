// resources/js/Pages/Vendor/Statistics/Partials/ChartOrderStatuses.tsx

import { ShoppingBag } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
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

interface StatusItem {
    name: string;
    value: number;
    color: string;
}

export function ChartOrderStatuses({ data }: { data: StatusItem[] }) {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <Card className="group relative overflow-hidden rounded-lg border border-slate-200/70 bg-white/80 backdrop-blur-xl transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-950/70">
            {/* Glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.10),transparent_30%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Header */}
            <CardHeader className="relative z-10 flex flex-row items-start justify-between space-y-0 border-b border-slate-200/70 pb-5 dark:border-slate-800/70">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 shadow-inner shadow-emerald-500/10 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                            <ShoppingBag className="h-5 w-5" />
                        </div>

                        <div>
                            <CardTitle className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                                Statuts des commandes
                            </CardTitle>

                            <CardDescription className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Répartition globale des commandes
                            </CardDescription>
                        </div>
                    </div>
                </div>

                <Badge className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 backdrop-blur-md dark:text-emerald-400">
                    {total} total
                </Badge>
            </CardHeader>

            <CardContent className="relative z-10 flex flex-col gap-6 p-6">
                {/* Chart */}
                <div className="relative mx-auto flex h-70 w-full max-w-[320px] items-center justify-center">
                    {/* Center Glow */}
                    <div className="absolute h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />

                    {/* Center label */}
                    <div className="pointer-events-none absolute z-10 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                            {total}
                        </span>

                        <span className="text-xs font-medium tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
                            Commandes
                        </span>
                    </div>

                    <ChartContainer config={{}} className="h-full w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <ChartTooltip
                                    cursor={false}
                                    content={
                                        <ChartTooltipContent className="rounded-2xl border border-slate-200/70 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/95" />
                                    }
                                />

                                <Pie
                                    data={data}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={78}
                                    outerRadius={105}
                                    paddingAngle={4}
                                    strokeWidth={5}
                                    stroke="transparent"
                                    cornerRadius={12}
                                >
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                            className="transition-opacity duration-300 hover:opacity-80"
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>

                {/* Legend */}
                <div className="grid gap-3 sm:grid-cols-2">
                    {data.map((item, index) => {
                        const percentage =
                            total > 0
                                ? ((item.value / total) * 100).toFixed(1)
                                : '0';

                        return (
                            <div
                                key={index}
                                className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 transition-all duration-300 hover:border-emerald-500/20 hover:bg-white dark:border-slate-800/70 dark:bg-slate-900/60 dark:hover:bg-slate-900"
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className="h-3 w-3 rounded-full shadow-sm"
                                        style={{
                                            backgroundColor: item.color,
                                        }}
                                    />

                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                            {item.name}
                                        </span>

                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            {percentage}%
                                        </span>
                                    </div>
                                </div>

                                <div className="text-sm font-bold text-slate-900 dark:text-white">
                                    {item.value}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
