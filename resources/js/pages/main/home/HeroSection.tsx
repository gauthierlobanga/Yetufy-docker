/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/components/home/HeroSection.tsx
import { useGSAP } from '@gsap/react';
import { Link, usePage } from '@inertiajs/react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import {
    ArrowRight,
    CheckCircle2,
    Flame,
    Package2,
    ShieldCheck,
    Sparkles,
    Star,
    Truck,
    Users,
} from 'lucide-react';
import { useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/ecommerce/products';

interface HeroSectionProps {
    categories: Category[];
}

export default function HeroSection({ categories }: HeroSectionProps) {
    const containerRef = useRef(null);
    const sectionRef = useRef<HTMLElement>(null);

    const isInView = useInView(sectionRef, { once: true, amount: 0.25 });
    const { productsCount = 0 } = usePage<{ productsCount?: number }>().props;

    useGSAP(
        () => {
            if (!isInView) {
                return;
            }

            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            tl.from('.hero-badge', { y: 20, opacity: 0, duration: 0.6 })
                .from(
                    '.hero-title',
                    { y: 40, opacity: 0, duration: 0.9 },
                    '-=0.3',
                )
                .from(
                    '.hero-subtitle',
                    { y: 20, opacity: 0, duration: 0.7 },
                    '-=0.5',
                )
                .from(
                    '.hero-action-item',
                    { y: 20, opacity: 0, duration: 0.5, stagger: 0.08 },
                    '-=0.4',
                )
                .from(
                    '.hero-trust > *',
                    { y: 12, opacity: 0, duration: 0.4, stagger: 0.05 },
                    '-=0.4',
                )
                .from(
                    '.hero-categories > *',
                    { y: 10, opacity: 0, duration: 0.35, stagger: 0.04 },
                    '-=0.3',
                )
                .from(
                    '.hero-visual',
                    { scale: 0.95, opacity: 0, duration: 1 },
                    '-=0.8',
                )
                .from(
                    '.floating-card',
                    { y: 20, opacity: 0, duration: 0.6, stagger: 0.12 },
                    '-=0.7',
                );
        },
        { scope: containerRef, dependencies: [isInView] },
    );

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-white dark:bg-slate-950"
        >
            <div ref={containerRef}>
                {/* Background premium */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-linear-to-br from-emerald-50 via-white to-cyan-50/40 dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950/20" />
                    <motion.div
                        animate={{ x: [0, 30, -10, 0], y: [0, -20, 20, 0] }}
                        transition={{
                            duration: 22,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/12 blur-3xl dark:bg-emerald-400/8"
                    />
                    <motion.div
                        animate={{ x: [0, -20, 30, 0], y: [0, 30, -20, 0] }}
                        transition={{
                            duration: 28,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        className="absolute top-1/4 -right-32 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-400/8"
                    />
                    <motion.div
                        animate={{ x: [0, 15, -15, 0], y: [0, -10, 15, 0] }}
                        transition={{
                            duration: 24,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-violet-500/8 blur-3xl dark:bg-violet-400/5"
                    />
                    <div className="absolute inset-0 bg-[radial-linear(circle_at_1px_1px,rgba(148,163,184,0.15)_1px,transparent_0)] bg-size-[28px_28px] dark:bg-[radial-linear(circle_at_1px_1px,rgba(51,65,85,0.35)_1px,transparent_0)]" />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-white to-transparent dark:from-slate-950" />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
                    <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-16">
                        {/* Left content */}
                        <div className="relative z-10">
                            <Badge className="hero-badge inline-flex rounded-full border border-emerald-200/70 bg-white/90 px-4 py-2 text-emerald-700 shadow-sm backdrop-blur-xl dark:border-emerald-800/60 dark:bg-slate-900/80 dark:text-emerald-300">
                                <Sparkles className="mr-2 h-4 w-4" />
                                Nouvelle collection • Livraison offerte
                            </Badge>

                            <h1 className="hero-title mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
                                Achetez{' '}
                                <span className="block bg-linear-to-r from-emerald-600 via-cyan-600 to-violet-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-cyan-400 dark:to-violet-400">
                                    intelligemment
                                </span>
                                <span className="block text-slate-900 dark:text-white">
                                    en toute confiance
                                </span>
                            </h1>

                            <p className="hero-subtitle mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-300">
                                Découvrez des milliers de produits soigneusement
                                sélectionnés, des offres exclusives et une
                                expérience e-commerce moderne, rapide et
                                sécurisée.
                            </p>

                            {/* Actions */}
                            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.2,
                                        ease: 'easeOut',
                                    }}
                                >
                                    <Button
                                        asChild
                                        size="lg"
                                        className={cn(
                                            'group relative h-14 overflow-hidden rounded-2xl px-8 text-base font-semibold',
                                            'bg-linear-to-r from-emerald-600 via-emerald-500 to-cyan-500',
                                            'text-white',
                                            'border border-emerald-400/20',
                                            'transition-all duration-300',
                                            'hover:-translate-y-0.5 hover:scale-[1.02]',
                                            'hover:shadow-2xl hover:shadow-emerald-500/35',
                                            'focus-visible:ring-2 focus-visible:ring-emerald-500/40',
                                            'active:scale-[0.98]',
                                        )}
                                    >
                                        <Link
                                            href={route('tenant.product.index')}
                                        >
                                            <span className="relative z-10 flex items-center">
                                                Commencer mes achats
                                                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                                            </span>
                                            <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                                        </Link>
                                    </Button>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.3,
                                        ease: 'easeOut',
                                    }}
                                >
                                    <Button
                                        asChild
                                        size="lg"
                                        variant="outline"
                                        className={cn(
                                            'group relative h-14 overflow-hidden rounded-2xl px-8 text-base font-semibold',
                                            'border-slate-300 bg-white text-slate-900 shadow-lg shadow-slate-200/60',
                                            'hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700',
                                            'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/20',
                                            'dark:hover:border-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400',
                                            'backdrop-blur-xl transition-all duration-300',
                                            'hover:-translate-y-0.5 hover:shadow-xl',
                                            'focus-visible:ring-2 focus-visible:ring-emerald-500/30',
                                            'active:scale-[0.98]',
                                        )}
                                    >
                                        <Link
                                            href={route(
                                                'tenant.product.category.index',
                                            )}
                                        >
                                            <span className="flex items-center">
                                                Explorer les catégories
                                                <ArrowRight className="ml-2 h-4 w-4 opacity-70 transition-transform duration-300 group-hover:translate-x-1" />
                                            </span>
                                        </Link>
                                    </Button>
                                </motion.div>
                            </div>

                            {/* Trust indicators */}
                            <div className="hero-trust mt-8 flex flex-wrap gap-3">
                                {[
                                    {
                                        icon: ShieldCheck,
                                        label: 'Paiement sécurisé',
                                    },
                                    { icon: Truck, label: 'Livraison rapide' },
                                    {
                                        icon: CheckCircle2,
                                        label: 'Retours faciles',
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/80 px-3 py-2 text-sm text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300"
                                    >
                                        <item.icon className="h-4 w-4 text-emerald-500" />
                                        {item.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Right visual */}
                        <div className="hero-visual relative -mt-6 hidden lg:-mt-10 lg:block">
                            <div className="relative mx-auto max-w-md">
                                <div className="absolute inset-0 scale-105 rounded-[2.5rem] bg-linear-to-br from-emerald-500/20 via-cyan-500/10 to-violet-500/10 blur-3xl" />
                                <div className="relative overflow-hidden rounded-[2.5rem] border border-white/30 bg-white/10 shadow-2xl shadow-slate-300/20 backdrop-blur-2xl dark:border-white/10 dark:shadow-black/30">
                                    <motion.img
                                        src="/storage/images/shopping-cart.jpg"
                                        alt="Shopping premium"
                                        className="aspect-4/5 w-full object-cover"
                                        whileHover={{ scale: 1.04 }}
                                        transition={{ duration: 0.7 }}
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/30 via-transparent to-transparent" />
                                </div>

                                {/* Stats card */}
                                <motion.div
                                    className="floating-card absolute -bottom-6 -left-6 rounded-3xl border border-white/60 bg-white/90 p-5 shadow-2xl backdrop-blur-2xl dark:border-slate-700/60 dark:bg-slate-900/90"
                                    whileHover={{ y: -4 }}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                                            <Flame className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                                {productsCount.toLocaleString(
                                                    'fr-FR',
                                                )}
                                                +
                                            </p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                produits disponibles
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-1 text-amber-400">
                                        {Array.from({ length: 5 }).map(
                                            (_, i) => (
                                                <Star
                                                    key={i}
                                                    className="h-3.5 w-3.5 fill-current"
                                                />
                                            ),
                                        )}
                                        <span className="ml-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                                            4.9/5
                                        </span>
                                    </div>
                                </motion.div>

                                {/* Floating card 2 */}
                                <motion.div
                                    className="floating-card absolute top-8 -right-6 rounded-3xl border border-white/60 bg-white/90 p-4 shadow-xl backdrop-blur-2xl dark:border-slate-700/60 dark:bg-slate-900/90"
                                    whileHover={{ y: -4 }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                            <Users className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                10 000+
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                clients satisfaits
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Floating card 3 */}
                                <motion.div
                                    className="floating-card absolute right-8 bottom-10 rounded-3xl border border-white/60 bg-white/90 p-4 shadow-xl backdrop-blur-2xl dark:border-slate-700/60 dark:bg-slate-900/90"
                                    whileHover={{ y: -4 }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400">
                                            <Package2 className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                Livraison 24h
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Dans les grandes villes
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
