/* eslint-disable react-hooks/purity */
// resources/js/Pages/Vendor/Success.tsx

import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Rocket,
    ExternalLink,
    Copy,
    Check,
    ArrowRight,
    LayoutDashboard,
    ShoppingBag,
    Sparkles,
    ShieldCheck,
    Globe,
    PartyPopper,
    Home,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import type { Tenant } from '@/types/tenants/products/vendor/tenant';

interface Props {
    tenant: Tenant;
}

function useParticlePositions(count: number) {
    return useMemo(
        () =>
            Array.from({ length: count }).map(() => ({
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                duration: 6 + Math.random() * 8,
                delay: Math.random() * 4,
            })),
        [count],
    );
}

export default function VendorSuccess({ tenant }: Props) {
    const [copied, setCopied] = useState(false);
    const particles = useParticlePositions(14);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(tenant.url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2200);
        } catch {
            // fallback
            const textarea = document.createElement('textarea');
            textarea.value = tenant.url;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);

            setCopied(true);
            setTimeout(() => setCopied(false), 2200);
        }
    };

    const summary = [
        {
            label: 'Boutique',
            value: tenant.raison_sociale,
            icon: ShoppingBag,
        },
        {
            label: 'Statut',
            value: 'Active et accessible',
            icon: ShieldCheck,
        },
        {
            label: 'URL publique',
            value: new URL(tenant.url).hostname,
            icon: Globe,
        },
    ];

    return (
        <>
            <Head title="Boutique créée avec succès" />

            <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-white via-slate-50 to-emerald-50/40 dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950/20">
                {/* Background Effects */}
                <div className="pointer-events-none absolute inset-0">
                    {/* Glow blobs */}
                    <div className="absolute top-0 left-1/2 h-144 w-xl -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-500/10" />
                    <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl dark:bg-teal-500/10" />
                    <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-slate-300/20 blur-3xl dark:bg-slate-700/10" />

                    {/* Grid overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-size-[48px_48px]" />
                </div>

                {/* Floating particles */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    {particles.map((particle, i) => (
                        <motion.div
                            key={i}
                            className="absolute"
                            style={{
                                left: particle.left,
                                top: particle.top,
                            }}
                            animate={{
                                y: [0, -20, 0],
                                opacity: [0.08, 0.2, 0.08],
                                scale: [1, 1.15, 1],
                            }}
                            transition={{
                                duration: particle.duration,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: particle.delay,
                            }}
                        >
                            <Sparkles className="h-4 w-4 text-emerald-400/30 dark:text-emerald-500/20" />
                        </motion.div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="w-full max-w-5xl"
                    >
                        <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-[0_30px_120px_-20px_rgba(16,185,129,0.15)] backdrop-blur-2xl dark:border-slate-800/70 dark:bg-slate-900/85 dark:shadow-[0_30px_120px_-20px_rgba(16,185,129,0.08)]">
                            {/* Header */}
                            <div className="relative border-b border-slate-200/60 px-6 py-10 sm:px-10 dark:border-slate-800/60">
                                <div className="absolute inset-0 bg-linear-to-r from-emerald-500/3 via-transparent to-teal-500/3" />

                                <div className="relative flex flex-col items-center text-center">
                                    {/* Success Icon / Logo */}
                                    <motion.div
                                        initial={{ scale: 0.7, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{
                                            delay: 0.15,
                                            duration: 0.6,
                                            type: 'spring',
                                            stiffness: 140,
                                        }}
                                        className="relative mb-8"
                                    >
                                        <div className="absolute inset-0 scale-125 rounded-full bg-emerald-500/10 blur-xl" />
                                        {tenant.logo_url ? (
                                            <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] bg-white/30 backdrop-blur-md">
                                                <img
                                                    src={tenant.logo_url}
                                                    alt={tenant.raison_sociale}
                                                    className="h-full w-full rounded-2xl object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] bg-linear-to-br from-emerald-500 via-emerald-600 to-teal-600 shadow-[0_20px_60px_-10px_rgba(16,185,129,0.45)]">
                                                <Rocket className="h-12 w-12 text-white" />
                                            </div>
                                        )}
                                        <div className="absolute -right-2 -bottom-2 flex h-10 w-10 items-center justify-center rounded-2xl border-4 border-white bg-white shadow-lg dark:border-slate-900 dark:bg-slate-900">
                                            <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                    </motion.div>

                                    {/* Badge */}
                                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50 px-4 py-1.5 text-xs font-medium tracking-wide text-emerald-700 uppercase dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                                        <PartyPopper className="h-3.5 w-3.5" />
                                        Configuration terminée
                                    </div>

                                    {/* Title */}
                                    <h1 className="max-w-3xl text-2xl font-medium tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                        Votre boutique est prête à vendre
                                    </h1>

                                    {/* Subtitle */}
                                    <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 sm:text-base dark:text-slate-300">
                                        <span className="font-semibold text-slate-900 dark:text-white">
                                            {tenant.raison_sociale}
                                        </span>{' '}
                                        a été créée avec succès. Vous pouvez
                                        maintenant ajouter vos produits,
                                        configurer vos paiements et commencer à
                                        recevoir des commandes.
                                    </p>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="grid gap-8 px-6 py-8 sm:px-10 lg:grid-cols-5">
                                {/* Left Content */}
                                <div className="space-y-6 lg:col-span-3">
                                    {/* URL Card */}
                                    <div className="rounded-3xl border border-slate-200/70 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/40">
                                        <div className="mb-3 flex items-center gap-2">
                                            <Globe className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                                URL publique de votre boutique
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-3 sm:flex-row">
                                            <a
                                                href={tenant.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition-all hover:border-emerald-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                                            >
                                                <ExternalLink className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-emerald-500" />
                                                <span className="truncate font-medium text-emerald-700 dark:text-emerald-400">
                                                    {tenant.url}
                                                </span>
                                            </a>

                                            <button
                                                type="button"
                                                onClick={copyToClipboard}
                                                className={cn(
                                                    'inline-flex h-12 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-semibold transition-all',
                                                    copied
                                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300'
                                                        : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300',
                                                )}
                                            >
                                                {copied ? (
                                                    <>
                                                        <Check className="h-4 w-4" />
                                                        Copié
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="h-4 w-4" />
                                                        Copier
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Primary CTA */}
                                    <a
                                        href={tenant.admin_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-4 text-base font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:from-emerald-700 hover:to-teal-700"
                                    >
                                        <Rocket className="h-5 w-5 transition-transform group-hover:-rotate-12" />
                                        Accéder au panneau d'administration
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </a>

                                    {/* Secondary Actions */}
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <a
                                            href={`${tenant.url}/vendor/dashboard`}
                                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-emerald-200 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                                        >
                                            <LayoutDashboard className="h-4 w-4" />
                                            Tableau de bord
                                        </a>

                                        <a
                                            href={`${tenant.admin_url}/products/produits`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow transition-all hover:border-emerald-200 hover:text-emerald-700 hover:shadow dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                                        >
                                            <ShoppingBag className="h-4 w-4" />
                                            Ajouter un produit
                                        </a>
                                    </div>

                                    {/* Return to account selection */}
                                    <Link
                                        href="/selection-compte"
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-emerald-200 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                                    >
                                        <Home className="h-4 w-4" />
                                        Gérer mes boutiques
                                    </Link>
                                </div>

                                {/* Right Summary */}
                                <div className="lg:col-span-2">
                                    <div className="rounded-3xl border border-slate-200/70 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-950/40">
                                        <h3 className="mb-5 text-sm font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                                            Résumé de création
                                        </h3>

                                        <div className="space-y-4">
                                            {summary.map((item) => {
                                                const Icon = item.icon;

                                                return (
                                                    <div
                                                        key={item.label}
                                                        className="flex items-start gap-3"
                                                    >
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-slate-900">
                                                            <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                                                                {item.label}
                                                            </p>
                                                            <p className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-white">
                                                                {item.value}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Security Notice */}
                                        <div className="mt-6 rounded-2xl border border-emerald-200/70 bg-emerald-50/80 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                                            <div className="flex items-start gap-3">
                                                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                                <p className="text-sm leading-6 text-emerald-800 dark:text-emerald-200">
                                                    Votre boutique est sécurisée
                                                    et accessible en ligne.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
