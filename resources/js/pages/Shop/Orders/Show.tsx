/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/pages/Shop/Orders/Show.tsx
import type { PageProps } from '@inertiajs/core';
import { Link, usePage, Head } from '@inertiajs/react';
import {
    ArrowLeft,
    Package,
    CreditCard,
    MapPin,
    Receipt,
    RotateCcw,
    ChevronRight,
    ShoppingBag,
    Truck,
    CheckCircle,
    Clock,
} from 'lucide-react';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import tenant from '@/routes/tenant';

// ---------- Types ----------
interface OrderLine {
    id: string;
    quantite: number;
    prix_total: number | string;
    produit?: {
        nom?: string;
        slug?: string;
    } | null;
}

interface Order {
    id: string;
    numero_commande: string;
    statut: string;
    total: number | string;
    sous_total?: number | string;
    taxe?: number | string;
    frais_livraison?: number | string;
    mode_paiement?: string | null;
    date_commande?: string | null;
    lignes: OrderLine[];
    adresse_facturation?: {
        adresse_complete?: string;
    } | null;
    adresse_livraison?: {
        adresse_complete?: string;
    } | null;
}

interface Props extends PageProps {
    order: Order;
}

// Statuts avec icônes
const statusInfo: Record<string, { label: string; icon: any; color: string }> =
    {
        en_attente: {
            label: 'En attente',
            icon: Clock,
            color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        },
        confirmee: {
            label: 'Confirmée',
            icon: CheckCircle,
            color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        },
        en_preparation: {
            label: 'En préparation',
            icon: Package,
            color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        },
        expédiée: {
            label: 'Expédiée',
            icon: Truck,
            color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
        },
        livree: {
            label: 'Livrée',
            icon: CheckCircle,
            color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        },
        annulee: {
            label: 'Annulée',
            icon: RotateCcw,
            color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        },
        remboursee: {
            label: 'Remboursée',
            icon: Receipt,
            color: 'bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-400',
        },
    };

export default function ShopOrderShowPage() {
    const { order } = usePage<Props>().props;
    const status = statusInfo[order.statut] ?? statusInfo.en_attente;
    const StatusIcon = status.icon;

    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <Head title={`Commande ${order.numero_commande}`} />
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                    <div className="flex flex-1 flex-col gap-6 p-4 pt-0 md:p-6 md:pt-0">
                        {/* Retour */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-fit rounded-xl"
                            asChild
                        >
                            <Link href={tenant.orders.index().url}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Retour aux commandes
                            </Link>
                        </Button>

                        {/* En-tête commande */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {order.numero_commande}
                                </h1>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {order.date_commande
                                        ? `Commandée le ${new Date(order.date_commande).toLocaleDateString('fr-FR')}`
                                        : 'Date non disponible'}
                                </p>
                            </div>
                            <Badge
                                className={cn(
                                    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium capitalize',
                                    status.color,
                                )}
                            >
                                <StatusIcon className="h-4 w-4" />
                                {status.label}
                            </Badge>
                        </div>

                        {/* Contenu principal */}
                        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                            {/* Articles commandés */}
                            <Card className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                                        <ShoppingBag className="h-5 w-5 text-emerald-500" />
                                        Articles commandés
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {order.lignes.map((line) => (
                                        <div
                                            key={line.id}
                                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-800/50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                                                    <Package className="h-5 w-5 text-slate-500" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white">
                                                        {line.produit?.nom ??
                                                            'Produit indisponible'}
                                                    </p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                                        Quantité :{' '}
                                                        {line.quantite}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                {typeof line.prix_total ===
                                                'number'
                                                    ? line.prix_total.toFixed(2)
                                                    : line.prix_total}{' '}
                                                €
                                            </p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Résumé + adresses + actions */}
                            <div className="space-y-6">
                                {/* Résumé */}
                                <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                                            Résumé
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500 dark:text-slate-400">
                                                Sous-total
                                            </span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {order.sous_total ??
                                                    order.total}{' '}
                                                €
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500 dark:text-slate-400">
                                                Livraison
                                            </span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {order.frais_livraison ?? 0} €
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500 dark:text-slate-400">
                                                Taxes
                                            </span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {order.taxe ?? 0} €
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-slate-200 pt-3 dark:border-slate-800">
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                Total
                                            </span>
                                            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                                {order.total} €
                                            </span>
                                        </div>
                                        {order.mode_paiement && (
                                            <div className="flex items-center gap-2 pt-2">
                                                <CreditCard className="h-4 w-4 text-slate-400" />
                                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                                    Payé par{' '}
                                                    {order.mode_paiement}
                                                </span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Adresses */}
                                <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                                            <MapPin className="h-5 w-5 text-emerald-500" />
                                            Adresses
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 text-sm">
                                        <div>
                                            <p className="mb-1 font-medium text-slate-700 dark:text-slate-300">
                                                Facturation
                                            </p>
                                            <p className="text-slate-500 dark:text-slate-400">
                                                {order.adresse_facturation
                                                    ?.adresse_complete ??
                                                    'Non renseignée'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="mb-1 font-medium text-slate-700 dark:text-slate-300">
                                                Livraison
                                            </p>
                                            <p className="text-slate-500 dark:text-slate-400">
                                                {order.adresse_livraison
                                                    ?.adresse_complete ??
                                                    'Non renseignée'}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20"
                                        asChild
                                    >
                                        <Link
                                            href={
                                                tenant.orders.cancel(order.id)
                                                    .url
                                            }
                                            method="post"
                                            as="button"
                                        >
                                            <RotateCcw className="mr-2 h-4 w-4" />
                                            Annuler la commande
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl"
                                        asChild
                                    >
                                        <Link
                                            href={
                                                tenant.orders.invoice(order.id)
                                                    .url
                                            }
                                        >
                                            <Receipt className="mr-2 h-4 w-4" />
                                            Demander la facture
                                        </Link>
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="rounded-xl bg-linear-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-700 hover:to-emerald-600"
                                        asChild
                                    >
                                        <Link
                                            href={
                                                tenant.return.create(order.id)
                                                    .url
                                            }
                                        >
                                            <RotateCcw className="mr-2 h-4 w-4" />
                                            Demander un retour
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
