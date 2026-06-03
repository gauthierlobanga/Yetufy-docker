/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/pages/Shop/Returns/Index.tsx
import type { PageProps } from '@inertiajs/core';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    RotateCcw,
    ChevronRight,
    Package,
    AlertCircle,
    Clock,
    CheckCircle,
    XCircle,
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
interface ReturnItem {
    id: string;
    statut: string;
    motif?: string | null;
    date_demande?: string | null;
    commande?: {
        id: string;
        numero_commande: string;
    } | null;
}

interface Props extends PageProps {
    returns: {
        data: ReturnItem[];
        total: number;
    };
}

// Statuts avec icônes
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
    accepte: {
        label: 'Accepté',
        icon: CheckCircle,
        className:
            'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
    en_cours: {
        label: 'En cours',
        icon: RotateCcw,
        className:
            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    termine: {
        label: 'Terminé',
        icon: CheckCircle,
        className:
            'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    },
    refuse: {
        label: 'Refusé',
        icon: XCircle,
        className:
            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
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

export default function ShopReturnsIndexPage() {
    const { returns } = usePage<Props>().props;

    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <Head title="Mes retours" />
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                    <div className="flex flex-1 flex-col gap-6 p-4 pt-0 md:p-6 md:pt-0">
                        {/* En-tête */}
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Mes retours
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Suivez vos demandes de retour et leur
                                traitement.
                            </p>
                        </div>

                        {/* Liste */}
                        <div className="space-y-4">
                            {returns.data.length > 0 ? (
                                returns.data.map((returnItem) => (
                                    <Card
                                        key={returnItem.id}
                                        className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:border-emerald-200 hover:shadow-md dark:border-slate-800/60 dark:bg-slate-900/70"
                                    >
                                        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                                                    <Package className="h-5 w-5 text-slate-500" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-white">
                                                        {returnItem.commande
                                                            ?.numero_commande ??
                                                            'Commande'}
                                                    </p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                                        {returnItem.motif ??
                                                            'Motif non précisé'}
                                                    </p>
                                                    {returnItem.date_demande && (
                                                        <p className="text-xs text-slate-400 dark:text-slate-500">
                                                            {new Date(
                                                                returnItem.date_demande,
                                                            ).toLocaleDateString(
                                                                'fr-FR',
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <StatusBadge
                                                    statut={returnItem.statut}
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="rounded-xl text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                                                    asChild
                                                >
                                                    <Link
                                                        href={route(
                                                            'return.show',
                                                            returnItem.id,
                                                        )}
                                                    >
                                                        Voir le détail
                                                        <ChevronRight className="ml-1 h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <Card className="rounded-2xl border border-dashed border-slate-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                                            Aucun retour
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-slate-500 dark:text-slate-400">
                                        Vos prochaines demandes de retour
                                        apparaîtront ici.
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
