/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { usePage } from '@inertiajs/react';
import { TrendingUp, Hash } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    XAxis,
    YAxis,
} from 'recharts';

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
import { Skeleton } from '@/components/ui/skeleton';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface TopTag {
    id: number;
    name: string;
    slug: string;
    posts_count: number;
}

interface ChartTopTagsProps {
    topTags?: TopTag[];
}

export function ChartTopTags({ topTags: propTopTags }: ChartTopTagsProps) {
    const { props } = usePage<{ topTags?: TopTag[] }>();
    const topTags = propTopTags || props.topTags;
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<'count' | 'name'>('count');

    useEffect(() => {
        if (topTags && topTags.length > 0) {
            setLoading(false);
        } else {
            const timer = setTimeout(() => setLoading(false), 1000);

            return () => clearTimeout(timer);
        }
    }, [topTags]);

    // Préparer les données pour le graphique
    const chartData = useMemo(() => {
        if (!topTags || topTags.length === 0) {
            return [];
        }

        const sortedTags = [...topTags].sort((a, b) => {
            if (sortBy === 'count') {
                return b.posts_count - a.posts_count;
            } else {
                return a.name.localeCompare(b.name);
            }
        });

        return sortedTags.slice(0, 15).map((tag) => ({
            name:
                tag.name.length > 15
                    ? tag.name.substring(0, 15) + '...'
                    : tag.name,
            fullName: tag.name,
            count: tag.posts_count,
            id: tag.id,
        }));
    }, [topTags, sortBy]);

    const chartConfig = {
        count: {
            label: "Nombre d'articles",
            color: 'var(--chart-1)',
        },
    } satisfies ChartConfig;

    const totalTags = useMemo(() => {
        if (!topTags) {
            return 0;
        }

        return topTags.reduce((sum, tag) => sum + tag.posts_count, 0);
    }, [topTags]);

    const averageTags = useMemo(() => {
        if (!topTags || topTags.length === 0) {
            return 0;
        }

        return Math.round(totalTags / topTags.length);
    }, [totalTags, topTags]);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                    <div className="flex h-100 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!topTags || topTags.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Tags populaires</CardTitle>
                    <CardDescription>Aucun tag trouvé</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex h-100 items-center justify-center text-muted-foreground">
                        <div className="text-center">
                            <Hash className="mx-auto mb-4 h-12 w-12 opacity-50" />
                            <p>Aucun tag n'a été utilisé</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Tags populaires</CardTitle>
                        <CardDescription>
                            Top {Math.min(15, topTags.length)} tags les plus
                            utilisés
                        </CardDescription>
                    </div>
                    <ToggleGroup
                        type="single"
                        value={sortBy}
                        onValueChange={(value) =>
                            value && setSortBy(value as 'count' | 'name')
                        }
                        variant="outline"
                        className="hidden sm:flex"
                    >
                        <ToggleGroupItem value="count" className="px-3 text-xs">
                            Par popularité
                        </ToggleGroupItem>
                        <ToggleGroupItem value="name" className="px-3 text-xs">
                            Par ordre alphabétique
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-125 w-full">
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            left: 100,
                            right: 40,
                            top: 20,
                            bottom: 20,
                        }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            width={120}
                            tickFormatter={(value) => value}
                        />
                        <XAxis
                            dataKey="count"
                            type="number"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) =>
                                value?.toLocaleString() || '0'
                            }
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
                                                    ID: #{data?.id}
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
                                            `${numericValue.toLocaleString()} article${numericValue > 1 ? 's' : ''}`,
                                            '',
                                        ];
                                    }}
                                />
                            }
                        />
                        <Bar
                            dataKey="count"
                            fill="var(--color-count)"
                            radius={[0, 4, 4, 0]}
                            barSize={24}
                        >
                            <LabelList
                                dataKey="count"
                                position="right"
                                offset={8}
                                className="fill-foreground"
                                fontSize={11}
                                // CORRECTION: Utiliser content au lieu de formatter
                                content={(props) => {
                                    const { x, y, width, value } = props;
                                    const numericValue =
                                        typeof value === 'number' ? value : 0;

                                    return (
                                        <text
                                            x={Number(x) + Number(width) + 8}
                                            y={Number(y) + 12}
                                            fill="currentColor"
                                            fontSize={11}
                                            className="fill-foreground"
                                        >
                                            {numericValue.toLocaleString()}
                                        </text>
                                    );
                                }}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Moyenne: {averageTags.toLocaleString()} articles par tag
                    <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Total de {totalTags} articles tagués avec {topTags.length}{' '}
                    tags différents
                </div>
            </CardFooter>
        </Card>
    );
}
