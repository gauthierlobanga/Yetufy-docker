import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Search, X } from 'lucide-react';
import { useState } from 'react';
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

export default function ProductShowTab({
    categories,
    productsByCategory,
}: CategoryTabsProps) {
    const [activeTab, setActiveTab] = useState(categories[0]?.slug || '');

    const activeCategory = categories.find((cat) => cat.slug === activeTab);
    const activeProducts = productsByCategory[activeTab]?.products || [];

    function clearAllFilters(): void {
        throw new Error('Function not implemented.');
    }

    return (
        <section className="py-12 lg:py-16">
            {/* Conteneur élargi pour 6 colonnes */}
            <div className="mx-auto max-w-480 px-4 sm:px-6 lg:px-8">
                <div className="mb-8 text-center">
                    <h2 className="font-heading text-2xl font-bold md:text-3xl">
                        Acheter par catégorie
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Explorez nos collections soigneusement sélectionnées
                    </p>
                </div>

                {/* Onglets - barre de catégories (ULTRA MODERNE) */}
                <div className="relative mb-10">
                    <div className="no-scrollbar flex w-full justify-center overflow-x-auto">
                        <div className="flex gap-2 rounded-full border bg-white/60 p-1 backdrop-blur dark:bg-white/5">
                            {categories.map((category) => {
                                const isActive = activeTab === category.slug;

                                return (
                                    <button
                                        key={category.id}
                                        onClick={() =>
                                            setActiveTab(category.slug)
                                        }
                                        className="relative cursor-pointer px-4 py-2 text-sm font-medium transition-all"
                                    >
                                        {/* Background animé actif */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 rounded-xs bg-linear-to-r from-orange-500 to-red-500 shadow-md"
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 300,
                                                    damping: 30,
                                                }}
                                            />
                                        )}

                                        {/* Contenu */}
                                        <span
                                            className={`relative z-10 whitespace-nowrap transition-colors ${
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

                {/* Grille produits */}
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
                                {/* Grille à 6 colonnes sur écrans 2xl, 5 sur xl, 4 sur lg, etc. */}
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                    {activeProducts
                                        .slice(0, 12)
                                        .map((product) => (
                                            <ProductCardCompact
                                                key={product.id}
                                                product={product}
                                            />
                                        ))}
                                </div>

                                {/* Bouton "Voir toute la collection" */}
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
                            <>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.4,
                                        ease: 'easeOut',
                                    }}
                                    className="flex flex-col items-center justify-center py-16 text-center"
                                >
                                    {/* Illustration premium */}
                                    <div className="relative mb-8">
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{
                                                delay: 0.1,
                                                duration: 0.4,
                                            }}
                                            className="text-muted-foreground/60"
                                        >
                                            <svg
                                                width="160"
                                                height="160"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="mx-auto"
                                            >
                                                <path
                                                    d="M21 16V8C20.9996 7.6493 20.9071 7.30481 20.7315 7.00117C20.556 6.69754 20.3037 6.44537 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44537 3.44398 6.69754 3.26846 7.00117C3.09294 7.30481 3.00036 7.6493 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M12 11L12 16M12 7V8"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                />
                                                <circle
                                                    cx="12"
                                                    cy="18"
                                                    r="1"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        </motion.div>
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                delay: 0.3,
                                                type: 'spring',
                                                stiffness: 200,
                                            }}
                                            className="absolute -right-2 -bottom-2 rounded-full bg-primary/10 p-3 text-primary"
                                        >
                                            <Search className="h-6 w-6" />
                                        </motion.div>
                                    </div>

                                    {/* Message principal */}
                                    <motion.h3
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="mb-2 font-heading text-2xl font-semibold"
                                    >
                                        Aucun produit trouvé
                                    </motion.h3>

                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="mb-6 max-w-md text-muted-foreground"
                                    >
                                        Nous n'avons pas trouvé de produit
                                        correspondant dans cette catégorie pour
                                        le moment..
                                    </motion.p>

                                    {/* Actions */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="flex flex-wrap items-center justify-center gap-3"
                                    >
                                        <Button
                                            onClick={clearAllFilters}
                                            size="lg"
                                            className="h-10 w-full cursor-pointer gap-2 rounded-full bg-primary/95 text-base font-semibold hover:bg-primary"
                                        >
                                            <X className="h-4 w-4" />
                                            Effacer tous les filtres
                                        </Button>
                                        <Button
                                            className="h-10 w-full cursor-pointer rounded-full bg-primary/95 text-base font-semibold hover:bg-primary"
                                            variant="outline"
                                            size="lg"
                                            asChild
                                        >
                                            <Link
                                                href={route(
                                                    'tenant.product.category.index',
                                                )}
                                            >
                                                Parcourir les catégories
                                                <ChevronRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </motion.div>

                                    {/* Suggestion de contact (optionnel) */}
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="mt-6 text-sm text-muted-foreground"
                                    >
                                        Besoin d'aide ?{' '}
                                        <Link
                                            href={route('tenant.page.contact')}
                                            className="font-medium text-primary hover:underline"
                                        >
                                            Contactez notre support
                                        </Link>
                                    </motion.p>
                                </motion.div>
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
