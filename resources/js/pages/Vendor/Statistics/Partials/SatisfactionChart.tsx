/* eslint-disable react-hooks/static-components */
// resources/js/Pages/Vendor/Statistics/Partials/SatisfactionChart.tsx

import { Star, MessageCircleMore, TrendingUp } from 'lucide-react';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';

interface Props {
    data: { name: string; value: number; color: string }[];
    totalReviews: number;
    averageRating: number;
}

export function SatisfactionChart({
    data,
    totalReviews,
    averageRating,
}: Props) {
    const totalVotes = data.reduce((sum, item) => sum + item.value, 0);

    const satisfactionRate =
        totalVotes > 0 ? Math.round((averageRating / 5) * 100) : 0;

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload;

            const percentage =
                totalVotes > 0 ? ((d.value / totalVotes) * 100).toFixed(1) : 0;

            return (
                <div className="rounded-lg border border-slate-200/70 bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/95">
                    <div className="mb-2 flex items-center gap-2">
                        <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: d.color }}
                        />

                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {d.name}
                        </span>
                    </div>

                    <div className="space-y-1 text-sm">
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-slate-500 dark:text-slate-400">
                                Avis
                            </span>

                            <span className="font-bold text-slate-900 dark:text-white">
                                {d.value}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <span className="text-slate-500 dark:text-slate-400">
                                Pourcentage
                            </span>

                            <span className="font-bold text-amber-500">
                                {percentage}%
                            </span>
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <Card className="group relative overflow-hidden rounded-lg border border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/70">
            {/* Glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.10),transparent_35%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Header */}
            <CardHeader className="relative z-10 border-b border-slate-200/70 pb-5 dark:border-slate-800/70">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-500 shadow-inner shadow-amber-500/10 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-400">
                                <Star className="h-5 w-5 fill-current" />
                            </div>

                            <div>
                                <CardTitle className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                                    Satisfaction client
                                </CardTitle>

                                <CardDescription className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Répartition des évaluations clients
                                </CardDescription>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Badge className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                            <TrendingUp className="mr-1 h-3.5 w-3.5" />
                            {satisfactionRate}% satisfaction
                        </Badge>

                        <Badge className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-700 dark:text-cyan-400">
                            <MessageCircleMore className="mr-1 h-3.5 w-3.5" />
                            {totalReviews} avis
                        </Badge>
                    </div>
                </div>

                {/* Score */}
                <div className="mt-5 flex items-end gap-3 rounded-lg border border-slate-200/70 bg-slate-50/70 p-4 dark:border-slate-800/70 dark:bg-slate-900/50">
                    <div className="flex items-end gap-1">
                        <span className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                            {averageRating.toFixed(1)}
                        </span>

                        <span className="mb-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                            /5
                        </span>
                    </div>

                    <div className="mb-1 ml-auto flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`h-4 w-4 ${
                                    star <= Math.round(averageRating)
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-slate-300 dark:text-slate-700'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </CardHeader>

            {/* Chart */}
            <CardContent className="relative z-10 flex flex-col gap-6 p-6">
                <div className="relative mx-auto h-65 w-full max-w-75">
                    {/* Center Glow */}
                    <div className="absolute top-1/2 left-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl" />

                    {/* Center Content */}
                    <div className="pointer-events-none absolute top-1/2 left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center">
                        <span className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                            {averageRating.toFixed(1)}
                        </span>

                        <span className="text-xs tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
                            Note
                        </span>
                    </div>

                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={105}
                                innerRadius={70}
                                paddingAngle={4}
                                stroke="transparent"
                                strokeWidth={2}
                                labelLine={false}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={index}
                                        fill={entry.color}
                                        className="transition-opacity duration-300 hover:opacity-80"
                                    />
                                ))}
                            </Pie>

                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="grid gap-3 sm:grid-cols-2">
                    {data.map((item, index) => {
                        const percentage =
                            totalVotes > 0
                                ? ((item.value / totalVotes) * 100).toFixed(1)
                                : '0';

                        return (
                            <div
                                key={index}
                                className="flex items-center justify-between rounded-lg border border-slate-200/70 bg-slate-50/70 px-4 py-3 transition-all duration-300 hover:border-amber-500/20 hover:bg-white dark:border-slate-800/70 dark:bg-slate-900/60 dark:hover:bg-slate-900"
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className="h-3 w-3 rounded-full"
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
