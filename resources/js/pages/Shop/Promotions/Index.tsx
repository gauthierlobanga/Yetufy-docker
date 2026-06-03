// resources/js/Pages/Shop/Promotions/Index.tsx
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    CalendarRange,
    TicketPercent,
    Copy,
    Check,
    Tag,
    ArrowRight,
    Clock,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import MainLayout from '@/layouts/main-layout';

interface Promotion {
    id: string;
    nom?: string | null;
    description?: string | null;
    code?: string | null;
    type: string;
    valeur: number | string;
    date_fin?: string | null;
    est_active: boolean;
}

interface Props extends Record<string, unknown> {
    promotions: Promotion[];
}

function formatDate(dateStr?: string | null): string {
    if (!dateStr) {
        return 'sans limite';
    }

    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
        return dateStr;
    }

    return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);
}

function isExpired(dateStr?: string | null): boolean {
    if (!dateStr) {
        return false;
    }

    const date = new Date(dateStr);

    return !isNaN(date.getTime()) && date < new Date();
}

function CopiableCode({ code }: { code: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback muet
        }
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            className="group flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur transition-all hover:bg-white hover:shadow dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800"
        >
            <span className="font-mono font-bold tracking-wider uppercase">
                {code}
            </span>
            {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
                <Copy className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-500" />
            )}
        </button>
    );
}

export default function PromotionsIndexPage() {
    const { promotions } = usePage<Props>().props;

    return (
        <MainLayout>
            <Head title="Promotions" />

            <div className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
                {/* En‑tête */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative mb-12 overflow-hidden rounded-3xl border border-slate-200/70 bg-linear-to-br from-emerald-50 via-white to-amber-50/70 p-8 shadow-xl shadow-slate-200/40 backdrop-blur dark:border-slate-800 dark:from-emerald-950/20 dark:via-slate-950 dark:to-amber-950/10 dark:shadow-black/20"
                >
                    <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-400/5" />
                    <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl dark:bg-amber-400/5" />

                    <div className="relative flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <Badge className="mb-3 border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <TicketPercent className="mr-1.5 h-3.5 w-3.5" />
                                {promotions.length} promotion
                                {promotions.length > 1 ? 's' : ''} active
                                {promotions.length > 1 ? 's' : ''}
                            </Badge>
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl dark:text-white">
                                Les meilleures offres du moment
                            </h1>
                            <p className="mt-2 max-w-2xl text-slate-500 dark:text-slate-400">
                                Retrouvez les réductions disponibles et les
                                codes à utiliser sur vos prochaines commandes.
                            </p>
                        </div>
                        <Button
                            asChild
                            className="rounded-full"
                            variant="outline"
                        >
                            <Link href={route('tenant.product.index')}>
                                Voir tous les produits
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </motion.div>

                {/* Grille des promotions */}
                {promotions.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-20 text-center dark:border-slate-800 dark:bg-slate-900/30"
                    >
                        <div className="mb-4 rounded-full bg-amber-100 p-4 dark:bg-amber-900/30">
                            <Tag className="h-10 w-10 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                            Aucune promotion en cours
                        </h3>
                        <p className="mt-2 max-w-md text-slate-500 dark:text-slate-400">
                            Revenez bientôt pour découvrir nos offres
                            exceptionnelles.
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {promotions.map((promotion, index) => {
                            const expired =
                                !promotion.est_active ||
                                isExpired(promotion.date_fin);

                            return (
                                <motion.div
                                    key={promotion.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: index * 0.05,
                                        duration: 0.35,
                                    }}
                                >
                                    <div
                                        className={`group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-lg dark:bg-slate-900/80 ${
                                            expired
                                                ? 'border-slate-200 opacity-60 dark:border-slate-800'
                                                : 'border-slate-200/80 hover:border-emerald-200 dark:border-slate-800 dark:hover:border-emerald-700'
                                        }`}
                                    >
                                        {/* Barre supérieure colorée */}
                                        <div
                                            className={`h-1.5 w-full ${
                                                expired
                                                    ? 'bg-slate-300 dark:bg-slate-700'
                                                    : 'bg-linear-to-r from-emerald-500 to-teal-500'
                                            }`}
                                        />

                                        <div className="p-6">
                                            {/* En-tête de la carte */}
                                            <div className="mb-4 flex items-start justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                                            expired
                                                                ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                                                                : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                        }`}
                                                    >
                                                        <TicketPercent className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <span
                                                            className={`inline-block text-xs font-semibold tracking-wide uppercase ${
                                                                expired
                                                                    ? 'text-slate-400'
                                                                    : 'text-emerald-600 dark:text-emerald-400'
                                                            }`}
                                                        >
                                                            {expired
                                                                ? 'Expirée'
                                                                : 'Active'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {promotion.code && !expired && (
                                                    <CopiableCode
                                                        code={promotion.code}
                                                    />
                                                )}
                                            </div>

                                            {/* Contenu */}
                                            <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                                                {promotion.nom ?? 'Promotion'}
                                            </h3>
                                            <p className="mb-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                                {promotion.description ??
                                                    'Offre active sur une sélection de produits.'}
                                            </p>

                                            {/* Valeur de la promotion */}
                                            <div className="mb-4 flex items-center gap-2">
                                                <Badge
                                                    className={`px-3 py-1 text-sm font-semibold ${
                                                        expired
                                                            ? 'bg-slate-100 text-slate-500'
                                                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                    }`}
                                                >
                                                    {promotion.type ===
                                                    'percentage'
                                                        ? `-${promotion.valeur}%`
                                                        : `-${promotion.valeur} €`}
                                                </Badge>
                                            </div>

                                            {/* Date de fin */}
                                            <div className="mb-5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                <CalendarRange className="h-4 w-4" />
                                                <span>
                                                    Jusqu’au{' '}
                                                    {formatDate(
                                                        promotion.date_fin,
                                                    )}
                                                </span>
                                                {!expired &&
                                                    promotion.date_fin && (
                                                        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            Bientôt terminé
                                                        </span>
                                                    )}
                                            </div>

                                            {/* Lien vers les produits */}
                                            <Link
                                                href={route(
                                                    'tenant.product.index',
                                                    {
                                                        promo: promotion.id,
                                                    },
                                                )}
                                                className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                                            >
                                                Explorer les produits concernés
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
