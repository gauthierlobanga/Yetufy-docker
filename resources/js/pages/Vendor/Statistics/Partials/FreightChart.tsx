/* eslint-disable react-hooks/static-components */
// resources/js/Pages/Vendor/Statistics/Partials/FreightChart.tsx
import { Truck } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface Props {
    data: { name: string; count: number; fill: string }[];
}

export function FreightChart({ data }: Props) {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    // Ajoute ce CustomTooltip avant le return principal du composant

    const CustomTooltip = ({ active, payload }: any) => {
        if (!active || !payload?.length) {
            return null;
        }

        const d = payload[0]?.payload;

        return (
            <div className="min-w-52 rounded-2xl border border-slate-200/70 bg-white/95 p-4 shadow-2xl backdrop-blur-xl transition-colors dark:border-slate-700/70 dark:bg-slate-900/95">
                <div className="mb-3 flex items-center gap-2">
                    <div
                        className="h-3 w-3 rounded-full shadow-sm"
                        style={{
                            backgroundColor: d?.fill,
                        }}
                    />

                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {d?.name}
                    </p>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                        Volume
                    </span>

                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {d?.count ?? 0} commandes
                    </span>
                </div>
            </div>
        );
    };

    return (
        <Card className="overflow-hidden border border-slate-200/70 bg-white/90 backdrop-blur-xl transition-all dark:border-slate-800/80 dark:bg-slate-950/60">
            {/* Header */}
            <CardHeader className="border-b border-slate-200/60 bg-linear-to-r from-slate-50 to-white pb-4 dark:border-slate-800/70 dark:from-slate-900 dark:to-slate-950">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <CardTitle className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                            État du fret
                        </CardTitle>

                        <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                            Répartition des expéditions et livraisons
                        </CardDescription>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-200/70 bg-emerald-50 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/30">
                        <Truck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-slate-200/70 bg-white/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60">
                        <p className="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                            Total commandes
                        </p>

                        <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                            {total}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/80 px-4 py-3 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                        <p className="text-xs font-medium tracking-wide text-emerald-700 uppercase dark:text-emerald-400">
                            Statuts actifs
                        </p>

                        <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                            {data.length}
                        </p>
                    </div>
                </div>
            </CardHeader>

            {/* Chart */}
            <CardContent className="pt-6">
                <div className="h-85 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{
                                top: 10,
                                right: 10,
                                left: -10,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid
                                vertical={false}
                                strokeDasharray="4 4"
                                stroke="rgb(148 163 184 / 0.15)"
                            />

                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tickMargin={12}
                                tick={{
                                    fontSize: 12,
                                    fill: '#94a3b8',
                                }}
                            />

                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tickMargin={10}
                                tick={{
                                    fontSize: 12,
                                    fill: '#94a3b8',
                                }}
                            />

                            <Tooltip
                                cursor={{
                                    fill: 'rgba(148,163,184,0.08)',
                                    radius: 12,
                                }}
                                content={<CustomTooltip />}
                            />

                            <Bar
                                dataKey="count"
                                radius={[12, 12, 0, 0]}
                                barSize={44}
                                shape={(props: any) => {
                                    const { x, y, width, height, payload } =
                                        props;

                                    return (
                                        <g>
                                            <rect
                                                x={x}
                                                y={y}
                                                width={width}
                                                height={height}
                                                rx={12}
                                                ry={12}
                                                fill={payload.fill}
                                                className="transition-opacity duration-300 hover:opacity-80"
                                            />
                                        </g>
                                    );
                                }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Footer indicators */}
                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-200/60 pt-5 dark:border-slate-800/70">
                    {data.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 rounded-full border border-slate-200/70 bg-slate-50/80 px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300"
                        >
                            <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{
                                    backgroundColor: item.fill,
                                }}
                            />

                            <span>{item.name}</span>

                            <span className="text-slate-400 dark:text-slate-500">
                                ({item.count})
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
