// resources/js/components/ecommerce/products/TrendingProducts.tsx
import { Link } from '@inertiajs/react';
import { ChevronRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types/ecommerce/products';
import ProductCard from './ProductCard';

interface TrendingProductsProps {
    products: Product[];
}

export default function TrendingProducts({ products }: TrendingProductsProps) {
    return (
        <section className="relative overflow-hidden py-16 lg:py-24">
            {/* Dégradé de fond clair (clair / sombre agréable) */}
            <div className="absolute inset-0 bg-linear-to-b from-emerald-50/40 via-white to-emerald-50/20 dark:from-emerald-950/20 dark:via-gray-950 dark:to-emerald-950/10" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <header className="mb-10 flex items-end justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <TrendingUp className="h-3.5 w-3.5" />
                                Populaires
                            </span>
                        </div>
                        <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            Tendances actuelles
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            Les produits les plus populaires du moment
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                        asChild
                    >
                        <Link
                            href={route('tenant.product.index', {
                                sort: 'popular',
                            })}
                        >
                            Voir plus
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </header>

                {products.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="flex min-h-50 items-center justify-center rounded-xl border border-dashed border-border bg-card/50 text-muted-foreground">
                        <p className="text-sm">
                            Aucune tendance pour le moment.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
