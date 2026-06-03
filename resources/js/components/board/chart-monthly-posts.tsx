// resources/js/components/chart-monthly-posts.tsx
'use client';

import { Line, LineChart, CartesianGrid, XAxis } from 'recharts';
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

interface MonthlyPost {
    month_name: string;
    count: number;
}

export function ChartMonthlyPosts({ data }: { data: MonthlyPost[] }) {
    const chartConfig = {
        count: { label: 'Articles', color: 'var(--chart-1)' },
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Publications mensuelles</CardTitle>
                <CardDescription>{new Date().getFullYear()}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-75 w-full">
                    <LineChart data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month_name"
                            tickLine={false}
                            axisLine={false}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                            dataKey="count"
                            stroke="var(--color-count)"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
