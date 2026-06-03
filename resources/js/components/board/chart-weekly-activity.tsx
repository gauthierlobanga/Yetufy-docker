// resources/js/components/chart-weekly-activity.tsx
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

interface WeeklyActivity {
    day: string;
    count: number;
}

export function ChartWeeklyActivity({ data }: { data: WeeklyActivity[] }) {
    const chartConfig = {
        count: { label: 'Articles', color: 'var(--chart-1)' },
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Activité hebdomadaire</CardTitle>
                <CardDescription>
                    Publications par jour de la semaine
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-75 w-full">
                    <BarChart data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="day"
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
