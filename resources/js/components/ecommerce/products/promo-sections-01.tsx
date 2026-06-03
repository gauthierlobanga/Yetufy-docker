/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/components/home/promo-section.tsx
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Calendar,
    Check,
    Clock3,
    Copy,
    Sparkles,
    Ticket,
    Zap,
} from 'lucide-react';
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PromoData } from '@/types/ecommerce/products';

interface PromoSectionProps {
    promo: PromoData;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function formatNumber(value: number): string {
    return String(value).padStart(2, '0');
}

function formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function CountdownItem({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-slate-900 tabular-nums dark:text-white">
                {formatNumber(value)}
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                {label}
            </span>
        </div>
    );
}

export default function PromoSection({ promo }: PromoSectionProps) {
    const targetDate = useMemo(
        () => new Date(promo.end_date),
        [promo.end_date],
    );
    const coupons = promo.coupons ?? [];
    const [now, setNow] = useState(Date.now());
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);

        return () => clearInterval(interval);
    }, []);

    const diff = Math.max(targetDate.getTime() - now, 0);
    const isExpired = diff <= 0;
    const isAlmostExpired = diff > 0 && diff < 24 * 60 * 60 * 1000;

    const timeLeft: TimeLeft = {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };

    const copyCode = useCallback(async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedCode(code);
            setTimeout(() => setCopiedCode(null), 2000);
        } catch (error) {
            console.error(error);
        }
    }, []);

    return (
        <section className="relative overflow-hidden py-12 md:py-16">
            {/* Fond épuré */}
            <div className="absolute inset-0 bg-linear-to-br from-emerald-50/80 via-white to-slate-50/80 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20" />
            <div className="absolute top-0 left-0 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-400/5" />
            <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-slate-400/10 blur-3xl dark:bg-slate-500/5" />

            <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="overflow-hidden rounded-3xl border border-white/80 bg-white/80 shadow-2xl shadow-slate-200/50 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/30"
                >
                    <div className="grid items-center gap-8 p-6 md:p-10 lg:grid-cols-5 lg:gap-12 lg:p-12">
                        {/* Contenu principal (3/5) */}
                        <div className="space-y-6 lg:col-span-3">
                            {/* Badges */}
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge className="gap-1 bg-emerald-600 text-white hover:bg-emerald-700">
                                    <Sparkles className="h-3 w-3" /> Offre
                                    exclusive
                                </Badge>
                                <Badge variant="secondary">
                                    <Calendar className="mr-1 h-3 w-3" />
                                    Jusqu’au {formatDate(targetDate)}
                                </Badge>
                            </div>

                            {/* Titre et réduction */}
                            <div>
                                <h2 className="text-2xl leading-tight font-extrabold text-slate-900 md:text-3xl dark:text-white">
                                    {promo.title}
                                </h2>
                                {promo.discount_percentage && (
                                    <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-emerald-500 px-4 py-2 text-white shadow-lg shadow-emerald-500/20">
                                        <Zap className="h-4 w-4" />
                                        <span className="text-lg font-bold">
                                            -{promo.discount_percentage}%
                                        </span>
                                    </div>
                                )}
                                {promo.description && (
                                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                        {promo.description}
                                    </p>
                                )}
                            </div>

                            {/* Compteur */}
                            {!isExpired && (
                                <div>
                                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                                        <Clock3
                                            className={cn(
                                                'h-4 w-4',
                                                isAlmostExpired
                                                    ? 'animate-pulse text-red-500'
                                                    : 'text-emerald-500',
                                            )}
                                        />
                                        Fin de l’offre :
                                    </div>
                                    <div className="flex gap-4">
                                        <CountdownItem
                                            label="Jours"
                                            value={timeLeft.days}
                                        />
                                        <CountdownItem
                                            label="Heures"
                                            value={timeLeft.hours}
                                        />
                                        <CountdownItem
                                            label="Min"
                                            value={timeLeft.minutes}
                                        />
                                        <CountdownItem
                                            label="Sec"
                                            value={timeLeft.seconds}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Coupons */}
                            {coupons.length > 0 && (
                                <div>
                                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                                        <Ticket className="h-4 w-4 text-emerald-500" />
                                        Codes promo
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {coupons.map((coupon, idx) => (
                                            <motion.div
                                                key={`${coupon.code}-${idx}`}
                                                whileHover={{ y: -2 }}
                                                className="flex items-center gap-3 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/60 px-3 py-2 backdrop-blur dark:border-emerald-800 dark:bg-emerald-950/20"
                                            >
                                                <div className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                                                    {coupon.code}
                                                </div>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-7 w-7 rounded-lg text-emerald-600 hover:bg-emerald-200 dark:hover:bg-emerald-800"
                                                    onClick={() =>
                                                        copyCode(coupon.code)
                                                    }
                                                >
                                                    {copiedCode ===
                                                    coupon.code ? (
                                                        <Check className="h-3.5 w-3.5" />
                                                    ) : (
                                                        <Copy className="h-3.5 w-3.5" />
                                                    )}
                                                </Button>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CTA */}
                            <div className="flex flex-wrap items-center gap-3">
                                <Button
                                    asChild
                                    className="bg-emerald-600 hover:bg-emerald-700"
                                >
                                    <Link
                                        href={route('tenant.promotions.index')}
                                    >
                                        Profiter de l’offre
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                {isExpired && (
                                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                        Offre expirée
                                    </span>
                                )}
                                {isAlmostExpired && !isExpired && (
                                    <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                                        ⏰ Plus que quelques heures !
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Image (2/5) */}
                        <div className="relative hidden lg:col-span-2 lg:block">
                            <div className="relative mx-auto max-w-xs overflow-hidden rounded-2xl shadow-2xl">
                                <img
                                    src={promo.image || undefined}
                                    alt={promo.title}
                                    className="aspect-3/4 w-full object-cover transition-transform duration-700 hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                                {promo.discount_percentage && (
                                    <div className="absolute top-3 right-3 rounded-xl bg-white/90 px-3 py-1.5 text-sm font-bold text-emerald-700 shadow backdrop-blur dark:bg-slate-900/80 dark:text-emerald-300">
                                        -{promo.discount_percentage}%
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
