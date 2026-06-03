/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/pages/Shop/Loyalty/Index.tsx
import type { PageProps } from '@inertiajs/core';
import { useForm, usePage, Head } from '@inertiajs/react';
import {
    Gift,
    TrendingUp,
    History,
    Sparkles,
    Trophy,
    Clock,
    Coins,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

// ---------- Types ----------
interface Transaction {
    id: string;
    type: string;
    points: number;
    raison?: string | null;
    created_at?: string;
    date_transaction?: string;
}

interface LoyaltyAccount {
    points: number;
    points_cumules: number;
    niveau?: string | null;
    transactions: Transaction[];
}

interface Props extends PageProps {
    compte: LoyaltyAccount;
}

// ---------- Niveaux (palette discrète) ----------
const loyaltyLevels: Record<
    string,
    { label: string; icon: any; color: string }
> = {
    bronze: {
        label: 'Bronze',
        icon: Trophy,
        color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30',
    },
    argent: {
        label: 'Argent',
        icon: Trophy,
        color: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50',
    },
    or: {
        label: 'Or',
        icon: Trophy,
        color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30',
    },
    platine: {
        label: 'Platine',
        icon: Trophy,
        color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30',
    },
    diamant: {
        label: 'Diamant',
        icon: Trophy,
        color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30',
    },
};

export default function ShopLoyaltyPage() {
    const { compte } = usePage<Props>().props;
    const form = useForm({ points: '' });

    const level =
        loyaltyLevels[compte.niveau ?? 'bronze'] ?? loyaltyLevels.bronze;
    const LevelIcon = level.icon;

    // Barre de progression (seuil max adaptable)
    const maxPoints = 500;
    const progress = Math.min((compte.points_cumules / maxPoints) * 100, 100);

    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <Head title="Programme de fidélité" />
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
                    <div className="flex flex-1 flex-col gap-8 p-4 md:p-8">
                        {/* En-tête épuré */}
                        <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/70">
                            <div className="absolute inset-0 bg-linear-to-br from-amber-500/5 to-transparent dark:from-amber-500/10" />
                            <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400">
                                        <Sparkles className="h-4 w-4" />
                                        Programme fidélité
                                    </div>
                                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                        Vos avantages
                                    </h1>
                                    <p className="mt-2 max-w-md text-slate-500 dark:text-slate-400">
                                        Suivez votre solde, échangez vos points
                                        et profitez de récompenses exclusives.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Cartes de statistiques */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {/* Points disponibles */}
                            <div className="flex items-start gap-5 rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/30">
                                    <Coins className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        Points disponibles
                                    </p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                        {compte.points}
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500">
                                        {compte.points_cumules} cumulés
                                    </p>
                                </div>
                            </div>

                            {/* Niveau actuel */}
                            <div className="flex items-start gap-5 rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                <div
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-xl',
                                        level.color,
                                    )}
                                >
                                    <LevelIcon className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        Niveau actuel
                                    </p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                        {level.label}
                                    </p>
                                    <div className="mt-3">
                                        <Progress
                                            value={progress}
                                            className="h-2 bg-slate-100 dark:bg-slate-800 [&>div]:bg-linear-to-r [&>div]:from-amber-400 [&>div]:to-amber-600"
                                        />
                                        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                            {maxPoints} points pour le niveau
                                            suivant
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contenu principal */}
                        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                            {/* Échanger des points */}
                            <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                                        <Gift className="h-5 w-5 text-amber-500" />
                                        Utiliser mes points
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            min="1"
                                            max={compte.points}
                                            value={form.data.points}
                                            onChange={(e) =>
                                                form.setData(
                                                    'points',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Nombre de points"
                                            className="h-12 rounded-xl border-slate-200 bg-white/80 pr-14 text-slate-900 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white"
                                        />
                                        <div className="absolute top-1/2 right-4 -translate-y-1/2 text-sm font-medium text-amber-600 dark:text-amber-400">
                                            pts
                                        </div>
                                    </div>
                                    <Button
                                        disabled={
                                            form.processing || !form.data.points
                                        }
                                        onClick={() =>
                                            form.post(route('loyalty.redeem'))
                                        }
                                        className="w-full rounded-xl bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-orange-600"
                                    >
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Échanger mes points
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Historique */}
                            <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                                        <History className="h-5 w-5 text-emerald-500" />
                                        Historique
                                    </CardTitle>
                                    <Badge
                                        variant="secondary"
                                        className="rounded-full bg-slate-100 dark:bg-slate-800"
                                    >
                                        {compte.transactions.length}{' '}
                                        transaction(s)
                                    </Badge>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {compte.transactions.length > 0 ? (
                                        compte.transactions.map(
                                            (transaction) => {
                                                const isPositive =
                                                    transaction.points >= 0;

                                                return (
                                                    <div
                                                        key={transaction.id}
                                                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-800/50"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className={cn(
                                                                    'flex h-8 w-8 items-center justify-center rounded-lg',
                                                                    isPositive
                                                                        ? 'bg-emerald-50 dark:bg-emerald-950/30'
                                                                        : 'bg-red-50 dark:bg-red-950/30',
                                                                )}
                                                            >
                                                                {isPositive ? (
                                                                    <ArrowUpRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                                ) : (
                                                                    <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-slate-900 dark:text-white">
                                                                    {transaction.raison ??
                                                                        'Mouvement de points'}
                                                                </p>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                    {transaction.date_transaction
                                                                        ? new Date(
                                                                              transaction.date_transaction,
                                                                          ).toLocaleDateString(
                                                                              'fr-FR',
                                                                          )
                                                                        : transaction.created_at
                                                                          ? new Date(
                                                                                transaction.created_at,
                                                                            ).toLocaleDateString(
                                                                                'fr-FR',
                                                                            )
                                                                          : ''}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <p
                                                            className={cn(
                                                                'font-semibold tabular-nums',
                                                                isPositive
                                                                    ? 'text-emerald-600 dark:text-emerald-400'
                                                                    : 'text-red-600 dark:text-red-400',
                                                            )}
                                                        >
                                                            {isPositive
                                                                ? '+'
                                                                : ''}
                                                            {transaction.points}{' '}
                                                            pts
                                                        </p>
                                                    </div>
                                                );
                                            },
                                        )
                                    ) : (
                                        <div className="rounded-xl border border-dashed border-slate-200 p-10 text-center dark:border-slate-800">
                                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                                <History className="h-6 w-6 text-slate-400" />
                                            </div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                Aucune transaction pour
                                                l’instant.
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
