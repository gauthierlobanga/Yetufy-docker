/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { usePage } from '@inertiajs/react';
import { TrendingUp, Eye, Heart, MessageCircle } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    XAxis,
    YAxis,
} from 'recharts';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

interface TopPost {
    id: number;
    title: string;
    slug: string;
    views_count: number;
    likes_count: number;
    comments_count: number;
    user: {
        id: number;
        name: string;
        email: string;
        avatar_url: string | null;
    };
    published_at: string | null;
}

interface ChartBarLabelProps {
    topPosts?: TopPost[];
}

type MetricType = 'views_count' | 'likes_count' | 'comments_count';

const metricLabels: Record<MetricType, string> = {
    views_count: 'Vues',
    likes_count: 'Likes',
    comments_count: 'Commentaires',
};

const metricColors: Record<MetricType, string> = {
    views_count: 'var(--chart-1)',
    likes_count: 'var(--chart-2)',
    comments_count: 'var(--chart-3)',
};

const metricKeys: Record<MetricType, keyof TopPost> = {
    views_count: 'views_count',
    likes_count: 'likes_count',
    comments_count: 'comments_count',
};

export function ChartBarLabel({ topPosts: propTopPosts }: ChartBarLabelProps) {
    const { props } = usePage<{ topPosts?: TopPost[] }>();
    const topPosts = propTopPosts || props.topPosts;
    const [activeMetric, setActiveMetric] = useState<MetricType>('views_count');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (topPosts && topPosts.length > 0) {
            setLoading(false);
        } else {
            const timer = setTimeout(() => setLoading(false), 1000);

            return () => clearTimeout(timer);
        }
    }, [topPosts]);

    // Préparer les données pour le graphique
    const chartData = useMemo(() => {
        if (!topPosts || topPosts.length === 0) {
            return [];
        }

        return topPosts.slice(0, 10).map((post) => ({
            title:
                post.title.length > 20
                    ? post.title.substring(0, 20) + '...'
                    : post.title,
            fullTitle: post.title,
            value: post[metricKeys[activeMetric]] as number,
            author: post.user?.name || 'Anonyme',
            authorAvatar: post.user?.avatar_url || null,
            id: post.id,
            slug: post.slug,
        }));
    }, [topPosts, activeMetric]);

    const chartConfig = {
        value: {
            label: metricLabels[activeMetric],
            color: metricColors[activeMetric],
        },
    } satisfies ChartConfig;

    // CORRECTION: Type assertion pour garantir que c'est un nombre
    const totalMetric = useMemo(() => {
        if (!topPosts) {
            return 0;
        }

        return topPosts.reduce((sum, post) => {
            const value = post[metricKeys[activeMetric]];
            // S'assurer que value est un nombre
            const numericValue = typeof value === 'number' ? value : 0;

            return sum + numericValue;
        }, 0);
    }, [topPosts, activeMetric]);

    const averageMetric = useMemo(() => {
        if (!topPosts || topPosts.length === 0) {
            return 0;
        }

        return Math.round(totalMetric / topPosts.length);
    }, [totalMetric, topPosts]);

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

    if (!topPosts || topPosts.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Top des articles</CardTitle>
                    <CardDescription>Aucun article trouvé</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex h-100 items-center justify-center text-muted-foreground">
                        Aucune donnée disponible
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
                        <CardTitle>
                            Top {Math.min(10, topPosts.length)} des meilleurs
                            articles
                        </CardTitle>
                        <CardDescription>
                            Classement par{' '}
                            {metricLabels[activeMetric].toLowerCase()} - Total:{' '}
                            {totalMetric.toLocaleString()}{' '}
                            {metricLabels[activeMetric].toLowerCase()}
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
                        <ToggleGroupItem
                            value="views_count"
                            className="px-3 text-xs"
                        >
                            <Eye className="mr-1 h-3 w-3" />
                            Vues
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value="likes_count"
                            className="px-3 text-xs"
                        >
                            <Heart className="mr-1 h-3 w-3" />
                            Likes
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value="comments_count"
                            className="px-3 text-xs"
                        >
                            <MessageCircle className="mr-1 h-3 w-3" />
                            Commentaires
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
                            dataKey="title"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            width={120}
                            tickFormatter={(value) => value}
                        />
                        <XAxis
                            dataKey="value"
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
                                                    {data?.fullTitle || label}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    {data?.authorAvatar && (
                                                        <Avatar className="h-4 w-4">
                                                            <AvatarImage
                                                                src={
                                                                    data.authorAvatar
                                                                }
                                                            />
                                                            <AvatarFallback>
                                                                {data?.author?.charAt(
                                                                    0,
                                                                ) || '?'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    )}
                                                    <span>
                                                        Par{' '}
                                                        {data?.author ||
                                                            'Anonyme'}
                                                    </span>
                                                </div>
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
                            dataKey="value"
                            fill={metricColors[activeMetric]}
                            radius={[0, 4, 4, 0]}
                            barSize={24}
                        >
                            <LabelList
                                dataKey="value"
                                position="right"
                                offset={8}
                                className="fill-foreground"
                                fontSize={11}
                                formatter={(value) => {
                                    const numValue =
                                        typeof value === 'number' ? value : 0;

                                    return numValue.toLocaleString();
                                }}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Moyenne: {averageMetric.toLocaleString()}{' '}
                    {metricLabels[activeMetric].toLowerCase()} par article
                    <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Top {Math.min(10, topPosts.length)} articles les plus{' '}
                    {metricLabels[activeMetric].toLowerCase()}s
                </div>
            </CardFooter>
        </Card>
    );
}
