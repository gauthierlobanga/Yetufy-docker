/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertTriangle,
    ArrowRight,
    BrainCircuit,
    CheckCircle2,
    Loader2,
    Package,
    PlusCircle,
    Sparkles,
    Tag,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

interface ControlPanelProps {
    tenant: {
        id: string;
        raison_sociale: string;
        slug: string;
        produits_count: number;
        categories_count: number;
        ai_enabled: boolean;
        plan: {
            name: string;
            trial_days?: number;
            [key: string]: any;
        } | null;
    };
    onToggleAI?: (enabled: boolean) => void;
}

interface MetricCardProps {
    title: string;
    value: number | string;
    description: string;
    icon: React.ElementType;
    iconClassName: string;
    badge?: string;
    badgeClassName?: string;
    actionHref?: string;
    actionLabel?: string;
    actionIcon?: React.ElementType;
}

function MetricCard({
    title,
    value,
    description,
    icon: Icon,
    iconClassName,
    badge,
    badgeClassName,
    actionHref,
    actionLabel,
    actionIcon: ActionIcon = ArrowRight,
}: MetricCardProps) {
    return (
        <Card className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/80">
            <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-slate-200/40 blur-3xl dark:bg-slate-700/20" />

            <CardHeader className="relative pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                            {title}
                        </CardTitle>
                        <CardDescription className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {description}
                        </CardDescription>
                    </div>

                    <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconClassName}`}
                    >
                        <Icon className="h-5 w-5" />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="relative pt-0">
                <div className="flex items-end justify-between gap-4">
                    <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {value}
                    </div>

                    {badge && (
                        <Badge
                            className={
                                badgeClassName ??
                                'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                            }
                        >
                            {badge}
                        </Badge>
                    )}

                    {!badge && actionHref && actionLabel && (
                        <Button
                            asChild
                            size="sm"
                            variant="ghost"
                            className="h-8 rounded-full px-3 text-xs font-medium text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                        >
                            <Link href={actionHref}>
                                {actionLabel}
                                <ActionIcon className="ml-1.5 h-3.5 w-3.5" />
                            </Link>
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export function TenantControlPanel({ tenant, onToggleAI }: ControlPanelProps) {
    const [aiEnabled, setAiEnabled] = useState(tenant.ai_enabled ?? false);
    const [loading, setLoading] = useState(false);
    const [isUnlocking, setIsUnlocking] = useState(false);

    const hasNoProducts = tenant.produits_count === 0;
    const hasNoCategories = tenant.categories_count === 0;

    const handleToggleAI = async () => {
        const nextState = !aiEnabled;

        setLoading(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 800));

            setAiEnabled(nextState);
            onToggleAI?.(nextState);

            toast.success(
                nextState
                    ? 'Assistant IA activé avec succès.'
                    : 'Assistant IA désactivé.',
            );
        } catch {
            toast.error('Impossible de modifier le statut de l’IA.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (aiEnabled && !tenant.ai_enabled) {
            // L'utilisateur vient d'activer, le serveur n'a pas encore confirmé
            setIsUnlocking(true);
            const timer = setTimeout(() => setIsUnlocking(false), 2500);

            return () => clearTimeout(timer);
        } else {
            // L'IA est déjà activée (ou désactivée), on réinitialise l'état
            setIsUnlocking(false);
        }
    }, [aiEnabled, tenant.ai_enabled]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Contrôles rapides
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Pilotez les fonctionnalités clés de votre boutique depuis un
                    tableau de bord centralisé.
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {/* Assistant IA */}
                <Card className="relative overflow-hidden rounded-3xl border border-emerald-200/70 bg-linear-to-br from-white to-emerald-50/60 shadow-sm backdrop-blur-xl dark:border-emerald-900/40 dark:from-slate-900 dark:to-emerald-950/20">
                    <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-emerald-400/10 blur-3xl" />

                    <AnimatePresence>
                        {isUnlocking && (
                            <motion.div
                                className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 backdrop-blur-md dark:bg-slate-950/80"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    className="flex flex-col items-center gap-3"
                                >
                                    <Sparkles className="h-8 w-8 animate-pulse text-emerald-500" />
                                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                        Activation de l’assistant…
                                    </p>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    Assistant IA
                                </CardTitle>
                                <CardDescription className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Rédaction assistée, suggestions et aide
                                    intelligente.
                                </CardDescription>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                <BrainCircuit className="h-5 w-5" />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-5">
                        {/* Bloc statut + switch premium */}
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            {/* Informations de statut */}
                            <div className="space-y-1">
                                <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {aiEnabled ? 'Activé' : 'Désactivé'}
                                </div>

                                <p className="max-w-sm text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                    {aiEnabled
                                        ? 'L’assistant IA est prêt à générer des descriptions, recommandations et réponses intelligentes.'
                                        : 'Activez l’assistant IA pour bénéficier de fonctionnalités avancées et de recommandations automatisées.'}
                                </p>
                            </div>
                        </div>
                        {/* Switch premium IA */}
                        <div className="flex items-center gap-3">
                            {/* Badge de statut */}
                            <Badge
                                className={
                                    aiEnabled
                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300'
                                        : 'border-slate-200 bg-slate-50 text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300'
                                }
                            >
                                <span
                                    className={`mr-1.5 inline-block h-5 w-5 rounded-full py-2 ${
                                        aiEnabled
                                            ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                                            : 'bg-slate-400'
                                    }`}
                                />
                                {aiEnabled ? 'Activé' : 'Désactivé'}
                            </Badge>

                            {/* Toggle premium */}
                            <motion.button
                                type="button"
                                onClick={handleToggleAI}
                                disabled={loading}
                                whileTap={{ scale: 0.96 }}
                                className={`relative inline-flex h-10 w-23 items-center rounded-full border p-1 transition-all duration-500 focus:ring-4 focus:outline-none ${
                                    aiEnabled
                                        ? 'border-emerald-300 bg-linear-to-r from-emerald-500 via-emerald-600 to-emerald-700 shadow-lg shadow-emerald-500/25 focus:ring-emerald-200 dark:border-emerald-700 dark:shadow-emerald-900/40 dark:focus:ring-emerald-900/40'
                                        : 'border-slate-200 bg-slate-100 shadow-sm focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:focus:ring-slate-700'
                                } ${loading ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                                aria-pressed={aiEnabled}
                                aria-label={
                                    aiEnabled
                                        ? 'Désactiver l’assistant IA'
                                        : 'Activer l’assistant IA'
                                }
                            >
                                {/* Halo lumineux */}
                                {aiEnabled && (
                                    <motion.div
                                        layoutId="ai-switch-glow"
                                        className="absolute inset-0 rounded-full bg-white/10"
                                    />
                                )}

                                {/* Texte OFF / ON */}
                                <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-3 text-[10px] font-semibold tracking-[0.18em] uppercase">
                                    <span
                                        className={
                                            aiEnabled
                                                ? 'text-white/70'
                                                : 'text-slate-500 dark:text-slate-400'
                                        }
                                    >
                                        Off
                                    </span>
                                    <span
                                        className={
                                            aiEnabled
                                                ? 'text-white'
                                                : 'text-slate-400 dark:text-slate-500'
                                        }
                                    >
                                        On
                                    </span>
                                </div>

                                {/* Curseur */}
                                <motion.div
                                    animate={{
                                        x: aiEnabled ? 48 : 0,
                                    }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 420,
                                        damping: 28,
                                    }}
                                    className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-lg ${
                                        aiEnabled
                                            ? 'bg-white text-emerald-600'
                                            : 'bg-white text-slate-500 dark:bg-slate-700 dark:text-slate-300'
                                    }`}
                                >
                                    {loading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : aiEnabled ? (
                                        <Sparkles className="h-4 w-4" />
                                    ) : (
                                        <BrainCircuit className="h-4 w-4" />
                                    )}
                                </motion.div>
                            </motion.button>
                        </div>

                        {/* Indicateur de chargement */}
                        {loading && (
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                Mise à jour des paramètres de l’assistant IA…
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Produits */}
                <MetricCard
                    title="Produits"
                    value={tenant.produits_count}
                    description={
                        hasNoProducts
                            ? 'Aucun produit dans le catalogue.'
                            : 'Produits disponibles dans votre boutique.'
                    }
                    icon={Package}
                    iconClassName="bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                    badge={!hasNoProducts ? 'Actif' : undefined}
                    actionHref={
                        hasNoProducts ? '/vendeur/produits/create' : undefined
                    }
                    actionLabel={hasNoProducts ? 'Créer un produit' : undefined}
                    actionIcon={PlusCircle}
                />

                {/* Catégories */}
                <MetricCard
                    title="Catégories"
                    value={tenant.categories_count}
                    description={
                        hasNoCategories
                            ? 'Aucune catégorie définie.'
                            : 'Catégories organisant votre catalogue.'
                    }
                    icon={Tag}
                    iconClassName="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    badge={!hasNoCategories ? 'Actif' : undefined}
                    actionHref={
                        hasNoCategories
                            ? '/vendeur/categories/create'
                            : undefined
                    }
                    actionLabel={
                        hasNoCategories ? 'Créer une catégorie' : undefined
                    }
                    actionIcon={PlusCircle}
                />
            </div>

            {/* Empty state */}
            {hasNoProducts && hasNoCategories && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl border border-amber-200 bg-linear-to-br from-amber-50 to-white p-6 shadow-sm dark:border-amber-900/40 dark:from-amber-950/20 dark:to-slate-900"
                >
                    <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-amber-400/10 blur-3xl" />

                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                            <AlertTriangle className="h-5 w-5" />
                        </div>

                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-300">
                                Votre boutique est encore vide
                            </h3>

                            <p className="mt-2 text-sm leading-relaxed text-amber-800/90 dark:text-amber-400">
                                Ajoutez vos premiers produits et catégories pour
                                commencer à vendre. L’assistant IA peut vous
                                aider à générer des descriptions et organiser
                                votre catalogue.
                            </p>

                            <div className="mt-4 flex flex-wrap gap-3">
                                <Button
                                    asChild
                                    size="sm"
                                    className="bg-amber-600 text-white hover:bg-amber-700"
                                >
                                    <Link href="/vendeur/produits/create">
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Ajouter un produit
                                    </Link>
                                </Button>

                                <Button
                                    asChild
                                    size="sm"
                                    variant="outline"
                                    className="border-amber-300 bg-white/80 text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:bg-transparent dark:text-amber-400 dark:hover:bg-amber-950/30"
                                >
                                    <Link href="/vendeur/categories/create">
                                        <Tag className="mr-2 h-4 w-4" />
                                        Créer une catégorie
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
