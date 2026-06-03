/* eslint-disable react-hooks/rules-of-hooks */
// resources/js/Pages/Vendor/Plans.tsx
import { SparklesIcon as SparklesSolid } from '@heroicons/react/24/solid';
import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Rocket,
    Zap,
    Crown,
    Gem,
    ArrowRight,
    ShieldCheckIcon,
    RefreshCw,
    Headphones,
    TrendingUp,
    Store,
    Sparkles,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { dashboard } from '@/routes';

interface Plan {
    id: number | string;
    name: string;
    description: string;
    price: number;
    currency?: string;
    interval?: string;
    trial_days: number;
    is_featured?: boolean;
    is_recommended?: boolean;
    features?: string[];
    badge?: string;
    button_text?: string;
}

interface Props {
    plans: Plan[];
    canBecomeVendor: boolean;
}

const icons: Record<string, any> = {
    Gratuit: Zap,
    Starter: Rocket,
    Pro: Crown,
    Business: Gem,
};

export default function VendorPlans({ plans, canBecomeVendor }: Props) {
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(
        'monthly',
    );

    if (!canBecomeVendor) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-4">
                <div className="max-w-md text-center">
                    <div className="mb-6 inline-flex rounded-2xl bg-primary/10 p-4">
                        <SparklesSolid className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">
                        Demande en cours
                    </h1>
                    <p className="mt-3 text-muted-foreground">
                        Une demande de création de boutique est déjà en cours de
                        traitement. Vous recevrez une notification dès qu'elle
                        sera validée.
                    </p>
                    <Link
                        href={dashboard()}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                    >
                        Retour au tableau de bord
                    </Link>
                </div>
            </div>
        );
    }

    const displayed = useMemo(() => {
        return plans.map((p) => ({
            ...p,
            price:
                billingCycle === 'annual' ? Math.round(p.price * 10) : p.price,
            interval: billingCycle === 'annual' ? 'year' : 'month',
        }));
    }, [plans, billingCycle]);

    const format = (price: number, currency = 'CDF') =>
        price === 0
            ? 'Gratuit'
            : new Intl.NumberFormat('fr-CD', {
                  style: 'currency',
                  currency,
              }).format(price);

    const handleContinue = () => {
        if (!selectedPlan) {
            return;
        }

        router.visit('/devenir-vendeur/configurer', {
            method: 'get',
            data: { plan_id: selectedPlan.id, billing_cycle: billingCycle },
        });
    };

    return (
        <>
            <Head title="Choisir un plan" />

            <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-white via-slate-50 to-emerald-50/40 dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950/20">
                {/* Background premium */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute top-0 left-1/2 h-125 w-125 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
                    <div className="absolute right-0 bottom-0 h-100 w-100 rounded-full bg-teal-400/10 blur-3xl" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(16,185,129,0.08)_1px,transparent_0)] bg-size-[28px_28px]" />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 py-16">
                    {/* Header */}
                    <div className="text-center">
                        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40">
                            <TrendingUp className="h-4 w-4" />
                            Lancez votre boutique en 2 minutes
                        </span>

                        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
                            Choisissez votre{' '}
                            <span className="bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                                plan
                            </span>
                        </h1>

                        <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
                            Flexible, évolutif, sans engagement.
                        </p>
                    </div>

                    {/* Billing toggle premium */}
                    <div className="mt-10 flex justify-center">
                        <div className="flex rounded-full bg-slate-100 p-1 dark:bg-slate-900">
                            {['monthly', 'annual'].map((cycle) => (
                                <button
                                    key={cycle}
                                    onClick={() =>
                                        setBillingCycle(cycle as any)
                                    }
                                    className={`rounded-full px-6 py-2 text-sm font-medium transition ${
                                        billingCycle === cycle
                                            ? 'bg-white text-emerald-600 shadow dark:bg-slate-800'
                                            : 'text-slate-500'
                                    }`}
                                >
                                    {cycle === 'monthly' ? 'Mensuel' : 'Annuel'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Plans */}
                    <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {displayed.map((plan) => {
                            const Icon = icons[plan.name] || Store;
                            const active = selectedPlan?.id === plan.id;

                            return (
                                <motion.div
                                    key={plan.id}
                                    whileHover={{ y: -6 }}
                                    onClick={() => setSelectedPlan(plan)}
                                    className={`relative cursor-pointer rounded-3xl border p-6 backdrop-blur-xl transition-all ${
                                        active
                                            ? 'border-emerald-500 bg-emerald-50/60 shadow-xl dark:bg-emerald-950/30'
                                            : 'border-slate-200 bg-white/70 dark:border-slate-800 dark:bg-slate-900/60'
                                    }`}
                                >
                                    {/* glow */}
                                    {active && (
                                        <div className="absolute inset-0 rounded-3xl bg-emerald-400/10 blur-2xl" />
                                    )}

                                    {/* badge */}
                                    {plan.badge && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-3 py-1 text-xs text-white">
                                            {plan.badge}
                                        </div>
                                    )}

                                    <div className="relative">
                                        {/* icon */}
                                        <div className="mb-4 inline-flex rounded-2xl bg-slate-100 p-2 dark:bg-slate-800">
                                            <Icon className="h-6 w-6 text-emerald-600" />
                                        </div>

                                        <h3 className="text-lg font-bold">
                                            {plan.name}
                                        </h3>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {plan.description}
                                        </p>

                                        {/* price */}
                                        <div className="mt-5">
                                            <span className="text-3xl font-extrabold">
                                                {format(
                                                    plan.price,
                                                    plan.currency,
                                                )}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                /{plan.interval}
                                            </span>
                                        </div>

                                        {/* features */}
                                        <div className="mt-5 space-y-2">
                                            {plan.features
                                                ?.slice(0, 4)
                                                .map((f, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-center gap-2 text-xs text-slate-500"
                                                    >
                                                        <Sparkles className="h-3 w-3 text-emerald-500" />
                                                        {f}
                                                    </div>
                                                ))}
                                        </div>

                                        {/* CTA */}
                                        <button
                                            className={`mt-6 w-full rounded-2xl py-2 text-sm font-semibold transition ${
                                                active
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-slate-100 text-slate-700 hover:bg-emerald-100'
                                            }`}
                                        >
                                            {active ? 'Sélectionné' : 'Choisir'}
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Continue CTA sticky */}
                    <AnimatePresence>
                        {selectedPlan && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="fixed bottom-6 left-1/2 -translate-x-1/2"
                            >
                                <button
                                    onClick={handleContinue}
                                    className="flex items-center gap-3 rounded-full bg-emerald-600 px-8 py-4 text-white shadow-xl"
                                >
                                    Continuer avec {selectedPlan.name}
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Trust bar */}
                    <div className="mt-20 grid grid-cols-2 gap-4 text-center md:grid-cols-4">
                        {[
                            { icon: ShieldCheckIcon, text: 'Sécurisé' },
                            { icon: RefreshCw, text: 'Sans engagement' },
                            { icon: Headphones, text: 'Support 24/7' },
                            { icon: TrendingUp, text: 'Évolutif' },
                        ].map(({ icon: Icon, text }) => (
                            <div
                                key={text}
                                className="rounded-2xl bg-white/60 p-4 dark:bg-slate-900/60"
                            >
                                <Icon className="mx-auto h-6 w-6 text-emerald-600" />
                                <p className="mt-2 text-xs">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
