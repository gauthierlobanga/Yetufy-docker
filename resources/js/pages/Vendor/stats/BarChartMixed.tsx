'use client';

import { usePage } from '@inertiajs/react';
import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

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

interface CategoryStats {
    id: number;
    nom: string;
    slug: string;
    color: string | null;
    posts_count: number;
}

interface ChartBarMixedProps {
    categoriesData?: CategoryStats[];
}

export function ChartBarMixed({
    categoriesData: propCategoriesData,
}: ChartBarMixedProps) {
    // Récupérer les données depuis les props Inertia
    const { props } = usePage<{ categoriesStats?: CategoryStats[] }>();
    const categoriesStats = props.categoriesStats;

    // Utiliser directement les données des props
    const chartData = propCategoriesData || categoriesStats || [];

    if (!chartData || chartData.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Articles par catégorie</CardTitle>
                    <CardDescription>Aucune catégorie trouvée</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex h-64 items-center justify-center text-muted-foreground">
                        Aucune catégorie avec des articles
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Générer la configuration du graphique dynamiquement
    const chartConfig = chartData.reduce(
        (config, category, index) => {
            const colors = [
                'var(--chart-1)',
                'var(--chart-2)',
                'var(--chart-3)',
                'var(--chart-4)',
                'var(--chart-5)',
                'hsl(var(--primary))',
                'hsl(var(--secondary))',
                'hsl(var(--accent))',
            ];

            config[category.nom] = {
                label: category.nom,
                color: category.color || colors[index % colors.length],
            };

            return config;
        },
        {
            posts: {
                label: "Nombre d'articles",
            },
        } as ChartConfig,
    );

    // Préparer les données pour le graphique
    const barData = chartData.map((category) => ({
        category: category.nom,
        posts: category.posts_count,
        fill: category.color || undefined,
    }));

    const totalPosts = chartData.reduce((sum, cat) => sum + cat.posts_count, 0);
    const categoriesWithPosts = chartData.filter(
        (cat) => cat.posts_count > 0,
    ).length;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Articles par catégorie</CardTitle>
                <CardDescription>
                    {totalPosts} articles répartis dans {categoriesWithPosts}{' '}
                    catégories
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={barData}
                        layout="vertical"
                        margin={{
                            left: 0,
                        }}
                    >
                        <YAxis
                            dataKey="category"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => {
                                const config =
                                    chartConfig[
                                        value as keyof typeof chartConfig
                                    ];

                                return config?.label || value;
                            }}
                        />
                        <XAxis dataKey="posts" type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    hideLabel
                                    formatter={(value, name) => {
                                        return [
                                            `${value} article${value !== 1 ? 's' : ''}`,
                                            name,
                                        ];
                                    }}
                                />
                            }
                        />
                        <Bar
                            dataKey="posts"
                            radius={5}
                            className="fill-primary"
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    {categoriesWithPosts} catégories actives{' '}
                    <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Nombre d'articles par catégorie (total: {totalPosts}{' '}
                    articles)
                </div>
            </CardFooter>
        </Card>
    );
}
