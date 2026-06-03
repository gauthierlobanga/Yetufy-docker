/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/pages/Shop/Returns/Show.tsx
import type { PageProps } from '@inertiajs/core';
import { Head, usePage } from '@inertiajs/react';
import {
    RotateCcw,
    Package,
    AlertCircle,
    CheckCircle,
    Clock,
    XCircle,
    ArrowLeft,
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
interface ReturnLine {
    id: string;
    quantite: number;
    montant: number | string;
    etat_label?: string;
    etat?: string;
    ligne_commande?: {
        produit?: {
            nom?: string;
        } | null;
    } | null;
}

interface Props extends PageProps {
    return: {
        id: string;
        statut: string;
        motif_label?: string;
        motif?: string;
        commentaire?: string | null;
        commande?: {
            numero_commande: string;
        } | null;
        lignes: ReturnLine[];
    };
}

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

export default function ShopReturnShowPage() {
    const { return: returnRequest } = usePage<Props>().props;
    const status =
        statusConfig[returnRequest.statut] ?? statusConfig.en_attente;
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
            <Head
                title={`Retour - ${returnRequest.commande?.numero_commande ?? ''}`}
            />
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
                            <a href={route('tenant.return.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Tous les retours
                            </a>
                        </Button>

                        {/* En-tête */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    Retour –{' '}
                                    {returnRequest.commande?.numero_commande ??
                                        'Détail'}
                                </h1>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {returnRequest.motif_label ??
                                        returnRequest.motif ??
                                        'Motif non précisé'}
                                </p>
                            </div>
                            <Badge
                                className={cn(
                                    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium capitalize',
                                    status.className,
                                )}
                            >
                                <StatusIcon className="h-4 w-4" />
                                {status.label}
                            </Badge>
                        </div>

                        {/* Lignes */}
                        <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                                    <Package className="h-5 w-5 text-emerald-500" />
                                    Produits retournés
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {returnRequest.lignes.map((line) => (
                                    <div
                                        key={line.id}
                                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60"
                                    >
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">
                                                {line.ligne_commande?.produit
                                                    ?.nom ?? 'Produit'}
                                            </p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                {line.quantite} article(s) –{' '}
                                                {line.etat_label ??
                                                    line.etat ??
                                                    'État non précisé'}
                                            </p>
                                        </div>
                                        <Badge
                                            variant="secondary"
                                            className="rounded-full"
                                        >
                                            {typeof line.montant === 'number'
                                                ? line.montant.toFixed(2)
                                                : line.montant}{' '}
                                            €
                                        </Badge>
                                    </div>
                                ))}

                                {returnRequest.commentaire && (
                                    <div className="mt-4 rounded-xl border-l-4 border-emerald-400 bg-white p-4 text-sm text-slate-700 dark:border-emerald-600 dark:bg-slate-900/60 dark:text-slate-300">
                                        {returnRequest.commentaire}
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
