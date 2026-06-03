'use client';

import { PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';

const data = [
    {
        name: 'Workspaces',
        capacity: 20,
        current: 1,
        allowed: 5,
        fill: 'var(--chart-1)',
    },
    {
        name: 'Dashboards',
        capacity: 10,
        current: 2,
        allowed: 20,
        fill: 'var(--chart-2)',
    },
];

const chartConfig = {
    capacity: {
        label: 'Capacity',
        color: 'hsl(var(--primary))',
    },
} satisfies ChartConfig;

export default function Stats07() {
    return (
        <div className="flex items-center justify-center px-4 py-10 lg:py-20">
            <dl className="grid w-full max-w-lg grid-cols-1 gap-4 lg:grid-cols-2">
                {data.map((item) => (
                    <Card key={item.name} className="p-4 shadow-none">
                        <CardContent className="flex items-center space-x-4 p-0">
                            <div className="relative flex items-center justify-center">
                                <ChartContainer
                                    config={chartConfig}
                                    className="h-20 w-20"
                                >
                                    <RadialBarChart
                                        data={[item]}
                                        innerRadius={30}
                                        outerRadius={60}
                                        barSize={6}
                                        startAngle={90}
                                        endAngle={-270}
                                    >
                                        <PolarAngleAxis
                                            type="number"
                                            domain={[0, 100]}
                                            angleAxisId={0}
                                            tick={false}
                                            axisLine={false}
                                        />
                                        <RadialBar
                                            dataKey="capacity"
                                            background
                                            cornerRadius={10}
                                            fill="var(--primary)"
                                            angleAxisId={0}
                                        />
                                    </RadialBarChart>
                                </ChartContainer>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-base font-medium text-foreground">
                                        {item.capacity}%
                                    </span>
                                </div>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-foreground">
                                    {item.name}
                                </dt>
                                <dd className="text-sm text-muted-foreground">
                                    {item.current} of {item.allowed} used
                                </dd>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </dl>
        </div>
    );
}
