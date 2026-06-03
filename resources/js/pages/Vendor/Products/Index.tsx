import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, Globe, Layers, PlusCircle } from 'lucide-react';
import CategoriesList from '@/components/ecommerce/products/CategoriesList';
import RecentProducts from '@/components/ecommerce/products/RecentProducts';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { VendorSidebar } from '@/components/VendorSidebar';
import type { RecentProduct } from '@/types/ecommerce/products/products';
import type { Tenant } from '@/types/tenants/products/vendor/tenant';

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
    tenant: Tenant;
    recentProducts: RecentProduct[];
    categories: Category[];
}

export default function ProductsIndex({
    tenant,
    recentProducts,
    categories,
}: Props) {
    return (
        <SidebarProvider
            className="dark:bg-slate-900"
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <VendorSidebar tenant={tenant} />
            <SidebarInset>
                <SiteHeader />
                <Head title="Tous les produits" />

                {/* Contenu avec fond ardoise subtil */}
                <div className="min-h-screen bg-slate-50/80 dark:bg-slate-950/80">
                    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                        {/* En‑tête de la page */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8"
                        >
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Produits & Catégories
                            </h1>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Gérez votre catalogue, vos catégories et la
                                visibilité de votre boutique.
                            </p>
                        </motion.div>

                        {/* Barre d'actions rapides */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            className="mb-10 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80"
                        >
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                                <Globe className="h-4 w-4 text-emerald-500" />
                                Visibilité
                            </div>

                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950"
                            >
                                <a
                                    href={`${tenant.admin_url}/products/produits`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Voir les produits
                                </a>
                            </Button>

                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950"
                            >
                                <a
                                    href={`${tenant.admin_url}/products/product-categories`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Layers className="mr-2 h-4 w-4" />
                                    Gérer les catégories
                                </a>
                            </Button>

                            <div className="ml-auto flex gap-2">
                                <Button
                                    asChild
                                    size="lg"
                                    className="rounded-xl bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                                >
                                    <a
                                        href={`${tenant.admin_url}/products/produits/create`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Nouveau produit
                                    </a>
                                </Button>

                                <Button
                                    asChild
                                    size="sm"
                                    className="rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                >
                                    <a
                                        href={tenant.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Globe className="mr-2 h-4 w-4" />
                                        Voir la boutique
                                    </a>
                                </Button>
                            </div>
                        </motion.div>

                        {/* Section Produits récents */}
                        <section className="mb-14">
                            <RecentProducts
                                recentProducts={recentProducts}
                                adminUrl={tenant.admin_url}
                            />
                        </section>

                        {/* Section Catégories */}
                        <section>
                            <div className="mb-6 flex items-end justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold tracking-tight text-slate-800 dark:text-white">
                                        Catégories
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        Explorez et modifiez vos catégories de
                                        produits
                                    </p>
                                </div>
                                <Link
                                    href={`${tenant.admin_url}/products/product-categories`}
                                    className="group flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                                >
                                    Voir toutes les catégories
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </Link>
                            </div>
                            <CategoriesList
                                categories={categories}
                                adminUrl={tenant.admin_url}
                            />
                        </section>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
