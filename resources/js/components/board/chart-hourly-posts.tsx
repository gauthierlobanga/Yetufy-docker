// resources/js/components/chart-hourly-posts.tsx
'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
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

interface HourlyPost {
    hour: number;
    count: number;
}

export function ChartHourlyPosts({ data }: { data: HourlyPost[] }) {
    const chartConfig = {
        count: { label: 'Articles', color: 'var(--chart-1)' },
    };

    const formattedData = data.map((item) => ({
        hour: `${item.hour}h`,
        count: item.count,
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Heures de publication</CardTitle>
                <CardDescription>Quand publient vos auteurs ?</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-75 w-full">
                    <BarChart data={formattedData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="hour"
                            tickLine={false}
                            axisLine={false}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                            dataKey="count"
                            fill="var(--color-count)"
                            radius={4}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
