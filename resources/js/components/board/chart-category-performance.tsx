'use client';

import { Eye, Heart, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
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
import type { ChartConfig } from '@/components/ui/chart';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface CategoryPerf {
    nom: string;
    posts_count: number;
    total_views: number;
    total_likes: number;
    total_comments: number;
}

type MetricType = 'vues' | 'likes' | 'commentaires';

export function ChartCategoryPerformance({ data }: { data: CategoryPerf[] }) {
    const [activeMetric, setActiveMetric] = useState<MetricType>('vues');

    const chartData = data.slice(0, 10).map((cat) => ({
        category:
            cat.nom.length > 15 ? cat.nom.substring(0, 15) + '...' : cat.nom,
        vues: cat.total_views,
        likes: cat.total_likes,
        commentaires: cat.total_comments,
        fullName: cat.nom,
    }));

    const metricLabels: Record<MetricType, string> = {
        vues: 'Vues',
        likes: 'Likes',
        commentaires: 'Commentaires',
    };

    const metricColors: Record<MetricType, string> = {
        vues: 'var(--chart-1)',
        likes: 'var(--chart-2)',
        commentaires: 'var(--chart-3)',
    };

    const chartConfig = {
        [activeMetric]: {
            label: metricLabels[activeMetric],
            color: metricColors[activeMetric],
        },
    } satisfies ChartConfig;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Performance des catégories</CardTitle>
                        <CardDescription>
                            Top 10 catégories par activité
                        </CardDescription>
                    </div>
                    <ToggleGroup
                        type="single"
                        value={activeMetric}
                        onValueChange={(value) =>
                            value && setActiveMetric(value as MetricType)
                        }
                        variant="outline"
                        className="hidden sm:flex"
                    >
                        <ToggleGroupItem value="vues" className="px-3 text-xs">
                            <Eye className="mr-1 h-3 w-3" />
                            Vues
                        </ToggleGroupItem>
                        <ToggleGroupItem value="likes" className="px-3 text-xs">
                            <Heart className="mr-1 h-3 w-3" />
                            Likes
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value="commentaires"
                            className="px-3 text-xs"
                        >
                            <MessageCircle className="mr-1 h-3 w-3" />
                            Commentaires
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-100 w-full">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{
                            left: 120,
                            right: 30,
                            top: 10,
                            bottom: 10,
                        }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="category"
                            type="category"
                            width={120}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                        />
                        <XAxis
                            type="number"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => value.toLocaleString()}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(label, payload) => {
                                        const data = payload[0]?.payload;

                                        return (
                                            <div className="space-y-1">
                                                <p className="font-medium">
                                                    {data?.fullName || label}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {data?.posts_count || 0}{' '}
                                                    article(s)
                                                </p>
                                            </div>
                                        );
                                    }}
                                    formatter={(value) => {
                                        const numericValue =
                                            typeof value === 'number'
                                                ? value
                                                : 0;

                                        return [
                                            `${numericValue.toLocaleString()} ${metricLabels[activeMetric].toLowerCase()}`,
                                            '',
                                        ];
                                    }}
                                />
                            }
                        />
                        <Bar
                            dataKey={activeMetric}
                            fill={metricColors[activeMetric]}
                            radius={[0, 4, 4, 0]}
                            barSize={20}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
