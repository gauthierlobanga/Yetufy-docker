import { Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Package, PenLine, Trash2, PlusCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

interface RecentProduct {
    id: string;
    nom: string;
    slug: string;
    prix: number;
    stock: number;
    statut: string;
    image: string;
    edit_url: string;
}

interface Props {
    recentProducts: RecentProduct[];
    adminUrl: string;
}

export default function RecentProducts({ recentProducts, adminUrl }: Props) {
    const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

    const confirmDelete = () => {
        if (deleteProductId) {
            router.delete(route('tenant.product.delete', deleteProductId), {
                onSuccess: () => {
                    toast.success('Produit supprimé');
                    setDeleteProductId(null);
                },
                onError: () => {
                    toast.error('Erreur lors de la suppression');
                    setDeleteProductId(null);
                },
            });
        }
    };

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                        Produits récents
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Gérez vos derniers produits ajoutés
                    </p>
                </div>
                <Link
                    href={`${adminUrl}/products/produits`}
                    className="group flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                >
                    Voir tous les produits
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
            </div>

            {recentProducts.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-950"
                >
                    <div className="mb-4 rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/30">
                        <Package className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                        Aucun produit pour le moment
                    </h3>
                    <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                        Commencez par ajouter votre premier produit pour le voir
                        apparaître ici.
                    </p>
                    <Link
                        href={`${adminUrl}/products/produits/create`}
                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 dark:bg-emerald-500 dark:shadow-emerald-900/30"
                    >
                        <PlusCircle className="h-4 w-4" />
                        Ajouter un produit
                    </Link>
                </motion.div>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    {recentProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-700 dark:hover:shadow-emerald-900/20"
                        >
                            <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
                                <img
                                    src={
                                        product.image ||
                                        '/storage/images/placeholder-product.jpg'
                                    }
                                    alt={product.nom}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute top-2 left-2">
                                    <Badge
                                        className={
                                            product.statut === 'publie'
                                                ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                : 'border-slate-300 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                        }
                                    >
                                        {product.statut === 'publie'
                                            ? 'Publié'
                                            : 'Brouillon'}
                                    </Badge>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                    <a
                                        href={product.edit_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-lg hover:bg-emerald-50 hover:text-emerald-600"
                                        title="Modifier"
                                    >
                                        <PenLine className="h-4 w-4" />
                                    </a>
                                    <button
                                        onClick={() =>
                                            setDeleteProductId(product.id)
                                        }
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-lg hover:bg-red-50 hover:text-red-600"
                                        title="Supprimer"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-3">
                                <h3 className="mb-1 line-clamp-1 text-xs font-semibold text-slate-900 dark:text-white">
                                    {product.nom}
                                </h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                        {new Intl.NumberFormat('fr-CD', {
                                            style: 'currency',
                                            currency: 'CDF',
                                        }).format(product.prix)}
                                    </span>
                                    <span
                                        className={`text-[10px] font-medium ${
                                            product.stock > 0
                                                ? 'text-emerald-600'
                                                : 'text-red-600'
                                        }`}
                                    >
                                        {product.stock > 0
                                            ? `${product.stock} stk`
                                            : 'Rupture'}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {recentProducts.length > 12 && (
                <div className="mt-6 text-center">
                    <Link
                        href={`${adminUrl}/products/produits`}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        Voir tous les produits
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            )}

            <AlertDialog
                open={deleteProductId !== null}
                onOpenChange={() => setDeleteProductId(null)}
            >
                <AlertDialogContent className="sm:max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Supprimer le produit ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. Le produit sera
                            définitivement supprimé.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={confirmDelete}
                        >
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
