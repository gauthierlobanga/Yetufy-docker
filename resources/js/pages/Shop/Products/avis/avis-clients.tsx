// resources/js/components/ecommerce/products/avis/avis-clients.tsx
import { router } from '@inertiajs/react';
import type { Variants } from 'framer-motion';
import { AnimatePresence, motion } from 'framer-motion';
import {
    CheckCircle2,
    MessageCircle,
    Send,
    Sparkles,
    Star,
    StarIcon,
    TrendingUp,
} from 'lucide-react';
import React, { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ReviewCard } from './review-card';

interface Review {
    id: number;
    note: number;
    commentaire: string;
    client: string;
    date: string;
}

interface RatingStats {
    average: number;
    total: number;
    distribution: Record<number, number>;
}

interface Props {
    productId: string | number;
    avis: Review[];
    ratingStats?: RatingStats;
}

const cardVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 24,
        scale: 0.98,
    },
    visible: (i: number = 1) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            delay: i * 0.05,
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1] as const,
        },
    }),
};

export function ReviewsSection({ productId, avis, ratingStats }: Props) {
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);

    /**
     * Statistiques des avis
     */
    const stats = useMemo(() => {
        if (ratingStats) {
            return ratingStats;
        }

        const total = avis.length;

        const average =
            total > 0
                ? avis.reduce((sum, review) => sum + review.note, 0) / total
                : 0;

        const distribution: Record<number, number> = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
        };

        avis.forEach((review) => {
            if (distribution[review.note] !== undefined) {
                distribution[review.note]++;
            }
        });

        return {
            average,
            total,
            distribution,
        };
    }, [avis, ratingStats]);

    /**
     * Pourcentage de satisfaction (4 et 5 étoiles)
     */
    const satisfactionRate = useMemo(() => {
        if (stats.total === 0) {
            return 0;
        }

        const positive =
            (stats.distribution[4] || 0) + (stats.distribution[5] || 0);

        return Math.round((positive / stats.total) * 100);
    }, [stats]);

    /**
     * Libellé de la note
     */
    const ratingLabel = useMemo(() => {
        if (reviewRating === 5) {
            return 'Excellent';
        }

        if (reviewRating === 4) {
            return 'Très satisfait';
        }

        if (reviewRating === 3) {
            return 'Correct';
        }

        if (reviewRating === 2) {
            return 'Décevant';
        }

        return 'Insuffisant';
    }, [reviewRating]);

    /**
     * Scroll vers le formulaire
     */
    const scrollToForm = () => {
        formRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    /**
     * Soumission
     */
    const handleSubmitReview = () => {
        if (reviewComment.trim().length < 10) {
            return;
        }

        setSubmitting(true);

        router.post(
            route('tenant.products.reviews.store', productId),
            {
                note: reviewRating,
                commentaire: reviewComment.trim(),
            },
            {
                preserveScroll: true,
                preserveState: true,
                showProgress: false,

                onSuccess: () => {
                    setReviewComment('');
                    setReviewRating(5);
                    setSubmitting(false);

                    toast.success('Merci pour votre avis !', {
                        description:
                            'Votre commentaire a été publié avec succès.',
                        icon: (
                            <Star
                                className="h-4 w-4 text-amber-400"
                                fill="currentColor"
                            />
                        ),
                    });

                    router.reload({
                        only: ['product'],
                    });
                },

                onError: () => {
                    setSubmitting(false);

                    toast.error('Une erreur est survenue', {
                        description: "Impossible d'enregistrer votre avis.",
                    });
                },
            },
        );
    };

    const canSubmit = reviewComment.trim().length >= 10 && !submitting;

    return (
        <section className="mt-24">
            {/* Header */}
            <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
            >
                <div className="max-w-2xl">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50/80 px-4 py-2 text-xs font-semibold tracking-wide text-emerald-700 backdrop-blur-xl dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-300">
                        <Sparkles className="h-3.5 w-3.5" />
                        AVIS CLIENTS
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white">
                        Ce que pensent nos clients
                    </h2>

                    <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                        Consultez des retours authentiques et partagez votre
                        expérience avec ce produit.
                    </p>
                </div>

                {stats.total > 0 && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <StatCard
                            label="Note moyenne"
                            value={stats.average.toFixed(1)}
                            icon={<Star className="h-4 w-4" />}
                        />
                        <StatCard
                            label="Avis"
                            value={stats.total.toString()}
                            icon={<MessageCircle className="h-4 w-4" />}
                        />
                        <StatCard
                            label="Satisfaction"
                            value={`${satisfactionRate}%`}
                            icon={<TrendingUp className="h-4 w-4" />}
                        />
                    </div>
                )}
            </motion.div>

            <div className="grid gap-10 xl:grid-cols-[1fr_420px]">
                {/* Liste des avis */}
                <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {avis.length === 0 ? (
                        <div className="relative overflow-hidden rounded-3xl border border-dashed border-emerald-200 bg-linear-to-br from-emerald-50 to-white p-12 text-center shadow-sm dark:border-emerald-800/40 dark:from-emerald-950/20 dark:to-slate-900">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-lg dark:bg-slate-800">
                                <MessageCircle className="h-10 w-10 text-emerald-500" />
                            </div>

                            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
                                Aucun avis pour le moment
                            </h3>

                            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                Soyez le premier à partager votre expérience
                                avec ce produit.
                            </p>

                            <Button
                                onClick={scrollToForm}
                                className="mt-8 rounded-full px-6"
                            >
                                <Star className="mr-2 h-4 w-4" />
                                Donner mon avis
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <AnimatePresence initial={false} mode="popLayout">
                                {avis.map((review, index) => (
                                    <motion.div
                                        key={`review-${review.id}`}
                                        layout
                                        initial={{
                                            opacity: 0,
                                            y: 24,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -10,
                                        }}
                                        transition={{
                                            duration: 0.35,
                                            delay: index * 0.04,
                                        }}
                                    >
                                        <ReviewCard
                                            customerName={review.client}
                                            rating={review.note}
                                            reviewDate={review.date}
                                            reviewText={review.commentaire}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </motion.div>

                {/* Sidebar */}
                <motion.div
                    ref={formRef}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="space-y-6 xl:sticky xl:top-24"
                >
                    {/* Résumé */}
                    <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-2xl dark:border-slate-800/60 dark:bg-slate-900/80 dark:shadow-black/20">
                        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500" />

                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-500 dark:bg-amber-900/20 dark:text-amber-400">
                                <StarIcon
                                    className="h-5 w-5"
                                    fill="currentColor"
                                />
                            </div>

                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                    Note globale
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Basé sur {stats.total} avis
                                </p>
                            </div>
                        </div>

                        <div className="mb-6 flex items-end justify-between gap-4">
                            <div className="flex items-baseline gap-1">
                                <span className="text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {stats.average.toFixed(1)}
                                </span>
                                <span className="pb-2 text-sm text-slate-500">
                                    /5
                                </span>
                            </div>

                            <div className="flex gap-1">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <Star
                                        key={index}
                                        className={`h-5 w-5 ${
                                            index < Math.round(stats.average)
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'text-slate-300 dark:text-slate-700'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = stats.distribution[star] || 0;

                                const percentage =
                                    stats.total > 0
                                        ? (count / stats.total) * 100
                                        : 0;

                                return (
                                    <div
                                        key={star}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="flex w-10 items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                                            {star}
                                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                        </div>

                                        <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{
                                                    width: `${percentage}%`,
                                                }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    duration: 0.8,
                                                    ease: 'easeOut',
                                                }}
                                                className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-emerald-500 to-teal-500"
                                            />
                                        </div>

                                        <span className="w-8 text-right text-xs font-medium text-slate-500">
                                            {count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Formulaire */}
                    <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-2xl dark:border-slate-800/60 dark:bg-slate-900/80 dark:shadow-black/20">
                        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-500 to-teal-500" />

                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                                <MessageCircle className="h-5 w-5" />
                            </div>

                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                    Laisser un avis
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Votre retour aide les autres acheteurs.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Note */}
                            <div>
                                <div className="mb-3 flex items-center justify-between">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Votre note
                                    </label>

                                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                        {ratingLabel}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() =>
                                                setReviewRating(star)
                                            }
                                            className="transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`h-8 w-8 ${
                                                    star <= reviewRating
                                                        ? 'fill-amber-400 text-amber-400'
                                                        : 'text-slate-300 dark:text-slate-600'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Commentaire */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Votre avis
                                </label>

                                <Textarea
                                    value={reviewComment}
                                    onChange={(e) =>
                                        setReviewComment(
                                            e.target.value.slice(0, 500),
                                        )
                                    }
                                    rows={5}
                                    placeholder="Partagez votre expérience avec ce produit..."
                                    className="resize-none rounded-2xl border-slate-200 bg-slate-50/70 dark:border-slate-700 dark:bg-slate-800/50"
                                />

                                <div className="mt-2 flex items-center justify-between text-xs">
                                    <span className="text-slate-400">
                                        Minimum 10 caractères
                                    </span>
                                    <span className="font-medium text-slate-500">
                                        {reviewComment.length}/500
                                    </span>
                                </div>
                            </div>

                            {/* CTA */}
                            <Button
                                onClick={handleSubmitReview}
                                disabled={!canSubmit}
                                className="h-12 w-full rounded-2xl bg-emerald-600 font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:bg-emerald-700 hover:shadow-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting ? (
                                    <span className="flex items-center gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 shrink-0 animate-spin"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            aria-hidden="true"
                                        >
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                className="opacity-25"
                                            />

                                            <path
                                                fill="currentColor"
                                                className="opacity-90"
                                                d="M12 2 a10 10 0 0 1 10 10 h-4 a6 6 0 0 0-6-6"
                                            />
                                        </svg>

                                        <span>Publication...</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Send className="h-4 w-4 shrink-0" />
                                        <span>Publier mon avis</span>
                                    </span>
                                )}
                            </Button>

                            {canSubmit && (
                                <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Votre avis est prêt à être publié.
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

/**
 * Petite carte de statistique
 */
function StatCard({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/70">
            <div className="mb-2 flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                {icon}
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
                {value}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
                {label}
            </div>
        </div>
    );
}
