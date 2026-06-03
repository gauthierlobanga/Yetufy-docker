// resources/js/pages/Shop/Orders/Index.tsx
import type { PageProps } from '@inertiajs/core';
import { Link, usePage, Head } from '@inertiajs/react';
import {
    ArrowRight,
    ShoppingBag,
    Clock,
    CheckCircle,
    Truck,
    XCircle,
    AlertCircle,
    Package,
    ChevronRight,
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
interface Order {
    id: string;
    numero_commande: string;
    statut: string;
    total: number | string;
    date_commande?: string | null;
    created_at: string;
}

interface Props extends PageProps {
    orders: {
        data: Order[];
        total: number;
    };
}

// Statuts colorés
const statusConfig: Record<
    string,
    { label: string; icon: any; className: string }
> = {
    en_attente: {
        label: 'En attente',
        icon: Clock,
        className:
            'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    },
    confirmee: {
        label: 'Confirmée',
        icon: CheckCircle,
        className:
            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    en_preparation: {
        label: 'En préparation',
        icon: Package,
        className:
            'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    },
    expédiée: {
        label: 'Expédiée',
        icon: Truck,
        className:
            'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    },
    livree: {
        label: 'Livrée',
        icon: CheckCircle,
        className:
            'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
    annulee: {
        label: 'Annulée',
        icon: XCircle,
        className:
            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
    remboursee: {
        label: 'Remboursée',
        icon: AlertCircle,
        className:
            'bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-400',
    },
};

function StatusBadge({ statut }: { statut: string }) {
    const config = statusConfig[statut] ?? statusConfig.en_attente;
    const StatusIcon = config.icon;

    return (
        <Badge
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize',
                config.className,
            )}
        >
            <StatusIcon className="h-3.5 w-3.5" />
            {config.label}
        </Badge>
    );
}

export default function ShopOrdersIndexPage() {
    const { orders } = usePage<Props>().props;

    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <Head title="Mes commandes" />
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                    <div className="flex flex-1 flex-col gap-6 p-4 pt-0 md:p-6 md:pt-0">
                        {/* En-tête */}
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Mes commandes
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Consultez l’historique de vos achats, suivez
                                leur statut et accédez au détail de chaque
                                commande.
                            </p>
                        </div>

                        {/* Carte de statistiques rapide */}
                        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
                                <ShoppingBag className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    Total
                                </p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {orders.total}
                                </p>
                            </div>
                            <p className="ml-auto text-sm text-slate-400 dark:text-slate-500">
                                commande(s) enregistrée(s)
                            </p>
                        </div>

                        {/* Tableau des commandes */}
                        <Card className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                                    Historique
                                </CardTitle>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Toutes vos commandes centralisées au même
                                    endroit.
                                </p>
                            </CardHeader>
                            <CardContent className="p-0">
                                {orders.data.length > 0 ? (
                                    <div className="hidden md:block">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-slate-200 dark:border-slate-800">
                                                    <th className="px-6 py-3 text-left font-medium text-slate-500 dark:text-slate-400">
                                                        Commande
                                                    </th>
                                                    <th className="px-6 py-3 text-left font-medium text-slate-500 dark:text-slate-400">
                                                        Date
                                                    </th>
                                                    <th className="px-6 py-3 text-left font-medium text-slate-500 dark:text-slate-400">
                                                        Statut
                                                    </th>
                                                    <th className="px-6 py-3 text-right font-medium text-slate-500 dark:text-slate-400">
                                                        Total
                                                    </th>
                                                    <th className="px-6 py-3 text-right font-medium text-slate-500 dark:text-slate-400">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.data.map((order) => (
                                                    <tr
                                                        key={order.id}
                                                        className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                                                    >
                                                        <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                                                            {
                                                                order.numero_commande
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                                            {order.date_commande
                                                                ? new Date(
                                                                      order.date_commande,
                                                                  ).toLocaleDateString(
                                                                      'fr-FR',
                                                                  )
                                                                : new Date(
                                                                      order.created_at,
                                                                  ).toLocaleDateString(
                                                                      'fr-FR',
                                                                  )}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <StatusBadge
                                                                statut={
                                                                    order.statut
                                                                }
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 text-right font-semibold text-slate-900 dark:text-white">
                                                            {typeof order.total ===
                                                            'number'
                                                                ? order.total.toFixed(
                                                                      2,
                                                                  )
                                                                : order.total}{' '}
                                                            €
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="rounded-xl text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={
                                                                        tenant.orders.show(
                                                                            order.id,
                                                                        ).url
                                                                    }
                                                                >
                                                                    Voir{' '}
                                                                    <ChevronRight className="ml-1 h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="py-16 text-center text-sm text-slate-500 dark:text-slate-400">
                                        Aucune commande trouvée.
                                    </div>
                                )}
                                {/* Version mobile */}
                                {orders.data.length > 0 && (
                                    <div className="flex flex-col gap-4 p-4 md:hidden">
                                        {orders.data.map((order) => (
                                            <div
                                                key={order.id}
                                                className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-semibold text-slate-900 dark:text-white">
                                                        {order.numero_commande}
                                                    </span>
                                                    <StatusBadge
                                                        statut={order.statut}
                                                    />
                                                </div>
                                                <div className="mt-2 flex items-center justify-between text-sm">
                                                    <span className="text-slate-500 dark:text-slate-400">
                                                        {order.date_commande
                                                            ? new Date(
                                                                  order.date_commande,
                                                              ).toLocaleDateString(
                                                                  'fr-FR',
                                                              )
                                                            : new Date(
                                                                  order.created_at,
                                                              ).toLocaleDateString(
                                                                  'fr-FR',
                                                              )}
                                                    </span>
                                                    <span className="font-semibold text-slate-900 dark:text-white">
                                                        {typeof order.total ===
                                                        'number'
                                                            ? order.total.toFixed(
                                                                  2,
                                                              )
                                                            : order.total}{' '}
                                                        €
                                                    </span>
                                                </div>
                                                <div className="mt-3">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={
                                                                tenant.orders.show(
                                                                    order.id,
                                                                ).url
                                                            }
                                                        >
                                                            Voir le détail{' '}
                                                            <ArrowRight className="ml-2 h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
