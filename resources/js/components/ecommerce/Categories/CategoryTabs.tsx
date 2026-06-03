/* eslint-disable react-hooks/set-state-in-effect */
// resources/js/components/home/CategoryTabs.tsx
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Package } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ProductCardCompact from '@/components/ecommerce/products/ProductCardCompact';
import { Button } from '@/components/ui/button';
import type { Category, Product } from '@/types/ecommerce/products';

interface CategoryTabsProps {
    categories: Category[];
    productsByCategory: Record<
        string,
        { category: Category; products: Product[] }
    >;
}

export default function CategoryTabs({
    categories,
    productsByCategory,
}: CategoryTabsProps) {
    // Filtrer les catégories qui ont des produits
    const filteredCategories = useMemo(
        () =>
            categories.filter(
                (cat) =>
                    (productsByCategory[cat.slug]?.products ?? []).length > 0,
            ),
        [categories, productsByCategory],
    );

    // Gérer la sélection de l'onglet actif
    const [activeTab, setActiveTab] = useState<string>(
        () => filteredCategories[0]?.slug ?? '',
    );

    // S'assurer que l'onglet actif fait toujours partie des catégories filtrées
    useEffect(() => {
        if (
            !filteredCategories.some((c) => c.slug === activeTab) &&
            filteredCategories.length > 0
        ) {
            setActiveTab(filteredCategories[0].slug);
        }
    }, [filteredCategories, activeTab]);

    const activeCategory = useMemo(
        () => categories.find((cat) => cat.slug === activeTab),
        [activeTab, categories],
    );

    const activeProducts = useMemo(
        () => productsByCategory[activeTab]?.products ?? [],
        [activeTab, productsByCategory],
    );

    // Si aucune catégorie n'a de produits, ne rien afficher (ou un message global)
    if (filteredCategories.length === 0) {
        return (
            <section className="py-12 lg:py-16">
                <div className="mx-auto max-w-4xl px-4 text-center">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-xl font-semibold">
                        Aucune catégorie disponible
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Revenez bientôt, de nouveaux produits arrivent !
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-linear-to-b from-emerald-50/40 via-white to-emerald-50/20 py-12 lg:py-16 dark:from-emerald-950/20 dark:via-gray-950 dark:to-emerald-950/10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 text-center">
                    <h2 className="font-heading text-2xl font-bold md:text-3xl">
                        Acheter par catégorie
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Explorez nos collections soigneusement sélectionnées
                    </p>
                </div>

                {/* Onglets modernes */}
                <div className="relative mb-10">
                    <div className="no-scrollbar flex w-full justify-center overflow-x-auto">
                        <div className="flex gap-2 rounded-full border-b bg-white/60 p-1 backdrop-blur dark:bg-white/5">
                            {filteredCategories.map((category) => {
                                const isActive = activeTab === category.slug;

                                return (
                                    <button
                                        key={category.id}
                                        onClick={() =>
                                            setActiveTab(category.slug)
                                        }
                                        className="relative cursor-pointer px-4 py-2 text-sm font-medium transition-all"
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 rounded-full bg-linear-to-r from-emerald-700 to-emerald-500"
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 300,
                                                    damping: 30,
                                                }}
                                            />
                                        )}

                                        <span
                                            className={`relative z-10 whitespace-nowrap ${
                                                isActive
                                                    ? 'text-white'
                                                    : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            {category.nom}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Produits ou état vide */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeProducts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 gap-2 bg-linear-to-b from-emerald-50/40 via-white to-emerald-50/20 sm:grid-cols-3 sm:gap-3 md:grid-cols-5 dark:from-emerald-950/20 dark:via-gray-950 dark:to-emerald-950/10">
                                    {activeProducts
                                        .slice(0, 12) // max 12 produits = 3 lignes de 4
                                        .map((product) => (
                                            <ProductCardCompact
                                                key={product.id}
                                                product={product}
                                            />
                                        ))}
                                </div>

                                {activeProducts.length > 12 && (
                                    <div className="mt-8 text-center">
                                        <Button variant="outline" asChild>
                                            <Link
                                                href={
                                                    activeCategory?.url ||
                                                    route(
                                                        'tenant.product.index',
                                                    )
                                                }
                                            >
                                                Voir toute la collection
                                                <ChevronRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="flex min-h-62.5 flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-white/40 p-8 backdrop-blur-sm dark:bg-black/20"
                            >
                                <motion.div
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        rotate: [0, 1, -1, 0],
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 4,
                                        ease: 'easeInOut',
                                    }}
                                    className="mb-4 rounded-full bg-primary/10 p-4"
                                >
                                    <Package className="h-10 w-10 text-primary" />
                                </motion.div>

                                <h3 className="text-xl font-semibold">
                                    Aucun produit trouvé
                                </h3>
                                <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
                                    Aucun produit n’est disponible dans cette
                                    catégorie. Découvrez nos autres collections
                                    ou revenez bientôt.
                                </p>

                                <Button
                                    variant="outline"
                                    className="mt-6"
                                    asChild
                                >
                                    <Link href={route('tenant.product.index')}>
                                        Voir tous les produits
                                    </Link>
                                </Button>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
