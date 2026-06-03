// resources/js/components/ecommerce/products/FeaturedProducts.tsx
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { PackageSearch, Loader2 } from 'lucide-react';
import { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types/ecommerce/products';
import ProductCardCompact from './ProductCardCompact';

interface FeaturedProductsProps {
    products?: Product[]; // facultatif pour éviter l'erreur
    loadMore?: () => void;
    hasMore?: boolean;
}

export default function FeaturedProducts({
    products = [], // valeur par défaut
    loadMore,
    hasMore = false,
}: FeaturedProductsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);

    const handleIntersect = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries;

            if (entry.isIntersecting && hasMore && !isLoading && loadMore) {
                setIsLoading(true);
                loadMore();
                setTimeout(() => setIsLoading(false), 500);
            }
        },
        [hasMore, isLoading, loadMore],
    );

    useEffect(() => {
        const sentinel = sentinelRef.current;

        if (!sentinel || !hasMore) {
            return;
        }

        const observer = new IntersectionObserver(handleIntersect, {
            rootMargin: '200px',
        });
        observer.observe(sentinel);

        return () => observer.disconnect();
    }, [handleIntersect, hasMore]);

    return (
        <section className="py-12 lg:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <header className="mb-8 text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <PackageSearch className="h-4 w-4" /> Sélection
                    </span>
                    <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Nos produits phares
                    </h2>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                        Découvrez notre sélection de produits d'exception
                    </p>
                </header>

                {products.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex min-h-75 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center backdrop-blur dark:border-slate-800 dark:bg-slate-900/30"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 4,
                                ease: 'easeInOut',
                            }}
                            className="mb-4 rounded-full bg-emerald-100 p-4 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                        >
                            <PackageSearch className="h-10 w-10" />
                        </motion.div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                            Aucun produit mis en avant
                        </h3>
                        <p className="mt-2 max-w-md text-slate-500 dark:text-slate-400">
                            Nos produits phares seront bientôt disponibles.
                            Explorez notre catalogue complet pour ne rien
                            manquer.
                        </p>
                        <Button asChild className="mt-6 rounded-full">
                            <Link href={route('tenant.product.index')}>
                                Découvrir tous les produits
                            </Link>
                        </Button>
                    </motion.div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {products.map((product) => (
                                <ProductCardCompact
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>

                        {hasMore && (
                            <div
                                ref={sentinelRef}
                                className="mt-8 flex justify-center"
                            >
                                {isLoading && (
                                    <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
