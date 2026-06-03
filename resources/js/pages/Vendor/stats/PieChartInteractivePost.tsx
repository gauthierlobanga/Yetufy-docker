/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { usePage } from '@inertiajs/react';
import * as React from 'react';
import { Label, Pie, PieChart, Sector } from 'recharts';
import type {
    PieSectorDataItem,
    PieSectorShapeProps,
} from 'recharts/types/polar/Pie';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartContainer,
    ChartStyle,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface PostStatsData {
    status: string;
    status_label: string;
    count: number;
    fill: string;
}

interface ChartPieInteractiveProps {
    postsStats?: PostStatsData[];
}

const statusColors: Record<string, string> = {
    published: 'var(--chart-1)',
    draft: 'var(--chart-2)',
    scheduled: 'var(--chart-3)',
    archived: 'var(--chart-4)',
    expired: 'var(--chart-5)',
};

const statusLabels: Record<string, string> = {
    published: 'Publiés',
    draft: 'Brouillons',
    scheduled: 'Programmés',
    archived: 'Archivés',
    expired: 'Expirés',
};

export function PieInteractive({
    postsStats: propPostsStats,
}: ChartPieInteractiveProps) {
    const id = 'pie-interactive';
    const { props } = usePage<{ postsStatusStats?: PostStatsData[] }>();

    // Utiliser directement les données des props
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const rawData = propPostsStats || props.postsStatusStats || [];

    const chartData = React.useMemo(() => {
        if (rawData.length === 0) {
            return [];
        }

        return rawData.map((item) => ({
            ...item,
            fill: statusColors[item.status] || `var(--chart-1)`,
            status_label: statusLabels[item.status] || item.status,
        }));
    }, [rawData]);

    const [activeStatus, setActiveStatus] = React.useState<string>(
        chartData.length > 0 ? chartData[0].status : '',
    );

    const chartConfig = React.useMemo(() => {
        const config: ChartConfig = {
            posts: { label: 'Articles' },
        };

        chartData.forEach((item) => {
            config[item.status] = {
                label: item.status_label,
                color: item.fill,
            };
        });

        return config;
    }, [chartData]);

    const activeIndex = React.useMemo(
        () => chartData.findIndex((item) => item.status === activeStatus),
        [activeStatus, chartData],
    );

    const totalPosts = React.useMemo(
        () => chartData.reduce((sum, item) => sum + item.count, 0),
        [chartData],
    );

    const renderPieShape = React.useCallback(
        ({ index, outerRadius = 0, ...props }: PieSectorShapeProps) => {
            if (index === activeIndex) {
                return (
                    <g>
                        <Sector {...props} outerRadius={outerRadius + 10} />
                        <Sector
                            {...props}
                            outerRadius={outerRadius + 25}
                            innerRadius={outerRadius + 12}
                        />
                    </g>
                );
            }

            return <Sector {...props} outerRadius={outerRadius} />;
        },
        [activeIndex],
    );

    if (chartData.length === 0) {
        return (
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>Répartition des articles</CardTitle>
                    <CardDescription>Aucune donnée disponible</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 justify-center pb-0">
                    <div className="flex h-64 items-center justify-center text-muted-foreground">
                        Aucun article trouvé
                    </div>
                </CardContent>
            </Card>
        );
    }

    const activeItem = chartData[activeIndex];

    return (
        <Card data-chart={id} className="flex flex-col">
            <ChartStyle id={id} config={chartConfig} />
            <CardHeader className="flex-row items-start space-y-0 pb-0">
                <div className="grid gap-1">
                    <CardTitle>Répartition des articles</CardTitle>
                    <CardDescription>
                        Total: {totalPosts} articles • {chartData.length}{' '}
                        statuts
                    </CardDescription>
                </div>
                <Select value={activeStatus} onValueChange={setActiveStatus}>
                    <SelectTrigger
                        className="ml-auto h-7 w-32.5 rounded-lg pl-2.5"
                        aria-label="Sélectionner un statut"
                    >
                        <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent align="end" className="rounded-xl">
                        {chartData.map((item) => (
                            <SelectItem
                                key={item.status}
                                value={item.status}
                                className="rounded-lg [&_span]:flex"
                            >
                                <div className="flex items-center gap-2 text-xs">
                                    <span
                                        className="flex h-3 w-3 shrink-0 rounded-xs"
                                        style={{ backgroundColor: item.fill }}
                                    />
                                    {item.status_label}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="flex flex-1 justify-center pb-0">
                <ChartContainer
                    id={id}
                    config={chartConfig}
                    className="mx-auto aspect-square w-full max-w-75"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="count"
                            nameKey="status"
                            innerRadius={60}
                            strokeWidth={5}
                            shape={renderPieShape}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (
                                        viewBox &&
                                        'cx' in viewBox &&
                                        'cy' in viewBox
                                    ) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {activeItem?.count.toLocaleString() ||
                                                        0}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground text-sm"
                                                >
                                                    {activeItem?.status_label ||
                                                        'Articles'}
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
