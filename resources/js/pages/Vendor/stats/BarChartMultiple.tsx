// resources/js/Pages/Vendor/Statistics/Partials/FreightChart.tsx
import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, LabelList } from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';

interface Props {
    data: { name: string; count: number; fill: string }[];
}

export function FreightChart({ data }: Props) {
    if (!data || data.length === 0) {
        return (
            <Card className="border-slate-200 shadow-sm dark:border-slate-800">
                <CardHeader>
                    <CardTitle className="text-slate-800 dark:text-white">
                        État du fret
                    </CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400">
                        Aucune donnée disponible
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    // Transformer les données pour utiliser les couleurs dynamiques dans chartConfig
    const chartConfig = data.reduce((config, item, index) => {
        const key = `status${index}`;
        config[key] = {
            label: item.name,
            color: item.fill,
        };

        return config;
    }, {} as ChartConfig);

    const chartData = data.map((item, index) => ({
        name: item.name,
        count: item.count,
        fill: item.fill,
        configKey: `status${index}`,
    }));

    const totalItems = data.reduce((sum, item) => sum + item.count, 0);

    return (
        <Card className="border-slate-200 shadow-sm dark:border-slate-800">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white">
                    État du fret
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">
                    Répartition des commandes par statut de livraison
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tick={{ fontSize: 12, fill: '#64748b' }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    indicator="dot"
                                    formatter={(value: any) => [
                                        `${value} commandes`,
                                        '',
                                    ]}
                                />
                            }
                        />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={50}>
                            {chartData.map((entry, index) => (
                                <rect key={index} fill={entry.fill} />
                            ))}
                            <LabelList
                                dataKey="count"
                                position="top"
                                offset={8}
                                className="fill-slate-700 dark:fill-slate-300"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
                <div className="flex gap-2 leading-none font-medium text-slate-700 dark:text-slate-300">
                    Total : {totalItems} commandes{' '}
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="leading-none text-slate-500 dark:text-slate-400">
                    Suivi en temps réel des expéditions
                </div>
            </CardFooter>
        </Card>
    );
}
