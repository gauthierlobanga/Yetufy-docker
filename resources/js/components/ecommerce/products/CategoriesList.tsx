import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Store, Tag, ArrowRight, Sparkles, Package } from 'lucide-react';
import { useState } from 'react';

interface Category {
    id: string;
    nom: string;
    slug: string;
    description: string;
    color: string;
    image: string;
    products_count: number;
    url: string;
}

interface Props {
    categories: Category[];
    adminUrl: string;
}

export default function CategoriesList({ categories, adminUrl }: Props) {
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    // État vide moderne
    if (categories.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex min-h-75 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/80 px-6 py-16 text-center backdrop-blur-sm dark:border-slate-700 dark:bg-slate-950/80"
            >
                <div className="mb-4 rounded-full bg-emerald-100 p-4 dark:bg-emerald-900/30">
                    <Store className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                    Aucune catégorie pour le moment
                </h2>
                <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                    Organisez vos produits en créant votre première catégorie.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Link
                        href={`${adminUrl}/products/product-categories/create`}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-700 dark:shadow-emerald-900/30"
                    >
                        <Sparkles className="h-4 w-4" />
                        Créer une catégorie
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                        href={`${adminUrl}/products/produits`}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                        <Package className="h-4 w-4" />
                        Voir les produits
                    </Link>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {categories.map((category, index) => (
                <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.03, duration: 0.3 }}
                    onMouseEnter={() => setHoveredCategory(category.slug)}
                    onMouseLeave={() => setHoveredCategory(null)}
                >
                    <Link
                        href={category.url}
                        className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors hover:border-emerald-200 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-700"
                    >
                        {/* Image (carrée) */}
                        <div className="relative aspect-square overflow-hidden">
                            <img
                                src={
                                    category.image ||
                                    '/storage/images/placeholder-category.jpg'
                                }
                                alt={category.nom}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                            {/* Badge nombre de produits */}
                            <div className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-900 backdrop-blur-sm dark:bg-gray-900/90 dark:text-white">
                                {category.products_count ?? 0} produit
                                {(category.products_count ?? 0) > 1 ? 's' : ''}
                            </div>
                        </div>

                        {/* Contenu textuel */}
                        <div className="p-4">
                            <h3 className="text-sm font-semibold text-slate-800 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                                {category.nom}
                            </h3>
                            {category.description && (
                                <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                                    {category.description}
                                </p>
                            )}
                        </div>

                        {/* Overlay de survol */}
                        <div
                            className={`absolute inset-0 flex items-center justify-center bg-emerald-500/10 backdrop-blur-[1px] transition-opacity duration-300 ${
                                hoveredCategory === category.slug
                                    ? 'opacity-100'
                                    : 'opacity-0'
                            }`}
                        >
                            <span className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm dark:bg-gray-900 dark:text-emerald-400">
                                <Tag className="h-4 w-4" />
                                Explorer
                            </span>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
