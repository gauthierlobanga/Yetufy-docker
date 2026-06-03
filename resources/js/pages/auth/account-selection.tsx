import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Mail, Plus, ShieldCheck, Store, Sparkles } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';
import type { Tenant } from '@/types/tenants/products/vendor/tenant';

type Account = {
    name: string;
    email: string;
    avatar_url: string | null;
};

type Props = {
    account: Account;
    tenants: Tenant[];
};

function initials(name: string, email: string): string {
    const source = name.trim() || email;
    const parts = source.split(/\s+/).filter(Boolean);

    return parts
        .map((part) => part.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
}

// Petite animation pour un badge “en ligne”
const OnlineIndicator = () => (
    <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
    </span>
);

export default function AccountSelection({ account, tenants }: Props) {
    const hasTenants = tenants.length > 0;

    return (
        <AuthLayout
            title={hasTenants ? 'Choisir un compte' : 'Créer votre boutique'}
            description={
                hasTenants
                    ? 'Retrouvez votre espace vendeur ou créez un nouveau compte pour une autre boutique.'
                    : 'Bienvenue ! Créez votre première boutique pour commencer à vendre.'
            }
        >
            <Head title={hasTenants ? 'Choisir un compte' : 'Créer votre boutique'} />

            <div className="relative mx-auto max-w-lg space-y-8">
                {/* Badge de session avec un effet de verre dépoli */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex justify-center"
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-white/60 px-4 py-2 text-xs font-semibold tracking-wide text-emerald-700 shadow-sm backdrop-blur-xl dark:border-emerald-400/20 dark:bg-slate-900/60 dark:text-emerald-300">
                        <OnlineIndicator />
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Session reconnue
                    </div>
                </motion.div>

                {/* Carte compte principal – glassmorphisme avancé */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 }}
                    className="group relative overflow-hidden rounded-lg border border-white/20 bg-white/40 p-3 shadow shadow-slate-200/50 backdrop-blur-2xl transition-all hover:shadow-emerald-200/30 dark:border-slate-700/30 dark:bg-slate-900/40 dark:shadow-slate-900/50 dark:hover:shadow-emerald-900/30"
                >
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(16,185,129,0.08),transparent)] dark:bg-[radial-gradient(45%_40%_at_50%_60%,rgba(16,185,129,0.15),transparent)]" />

                    <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 ring-1 ring-emerald-500/20 ring-offset-2 ring-offset-white/50 transition-all duration-30 dark:ring-offset-slate-900/50">
                            <AvatarImage
                                src={account.avatar_url ?? undefined}
                                alt={account.name}
                                className="object-cover"
                            />
                            <AvatarFallback className="bg-linear-to-br from-emerald-500 to-emerald-700 text-lg font-semibold text-white">
                                {initials(account.name, account.email)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-base font-normal tracking-tight text-slate-900 dark:text-white">
                                {account.name}
                            </p>
                            <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                                <span className="truncate">{account.email}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Liste des boutiques ou état vide */}
                <AnimatePresence mode="wait">
                    {hasTenants ? (
                        <motion.div
                            key="tenants"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-5"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Mes boutiques ({tenants.length})
                                </h3>
                                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                                    glissez pour choisir
                                </span>
                            </div>

                            <div className="space-y-4">
                                {tenants.map((tenant, index) => (
                                    <motion.div
                                        key={tenant.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: index * 0.07,
                                            duration: 0.4,
                                            ease: [0.25, 0.46, 0.45, 0.94],
                                        }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <a
                                            href={tenant.sso_login_url}
                                            className="group relative flex w-full items-center gap-4 overflow-hidden rounded-lg border border-slate-200/50 bg-white/50 p-3.5 backdrop-blur-xl transition-all duration-500 hover:border-emerald-300/60 hover:bg-white/80 hover:shadow-emerald-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 dark:border-slate-800/50 dark:bg-slate-900/50 dark:hover:border-emerald-600/40 dark:hover:bg-slate-900/80"
                                        >
                                            {/* Effet de survol gradient */}
                                            <div className="absolute inset-0 -z-10 rounded-2xl bg-linear-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 opacity-0 transition-all duration-500 group-hover:from-emerald-500/5 group-hover:via-emerald-500/5 group-hover:opacity-100" />

                                            <Avatar className="h-10 w-10 shrink-0 ring-1 ring-emerald-500/20 ring-offset-2 ring-offset-white/80 transition-all group-hover:ring-emerald-500/50 dark:ring-offset-slate-900/80">
                                                <AvatarImage
                                                    src={tenant.logo_url ?? undefined}
                                                    alt={tenant.name}
                                                />
                                                <AvatarFallback className="bg-linear-to-br from-emerald-500 to-emerald-700 text-sm font-bold text-white">
                                                    {tenant.name
                                                        .split(' ')
                                                        .slice(0, 2)
                                                        .map((n) => n[0])
                                                        .join('')}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-slate-900 transition-colors group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-300">
                                                    {tenant.name}
                                                </p>
                                                {tenant.email && (
                                                    <div className="mt-1 flex min-w-0 items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                        <Mail className="h-3 w-3 shrink-0" />
                                                        <span className="truncate">{tenant.email}</span>
                                                    </div>
                                                )}

                                            </div>

                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-emerald-700 to-emerald-800 text-white transition-all duration-300 group-hover:translate-x-1">
                                                <ArrowRight className="h-4 w-4 transition-transform group-hover:scale-110" />
                                            </div>
                                        </a>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Bouton ajouter une boutique – plus moderne */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Button
                                    asChild
                                    variant="outline"
                                    className="group h-12 w-full rounded-2xl border-2 border-dashed border-slate-300/80 bg-white/30 text-sm font-semibold backdrop-blur-md transition-all hover:border-emerald-400 hover:bg-emerald-50/50 hover:text-emerald-700 dark:border-slate-700/80 dark:bg-slate-900/30 dark:hover:border-emerald-600 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300"
                                >
                                    <Link href="/selection-compte/ajouter">
                                        <Plus className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                                        Ajouter une boutique
                                    </Link>
                                </Button>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-6"
                        >
                            <div className="relative overflow-hidden rounded-3xl border border-dashed border-slate-300/80 bg-white/40 p-8 text-center backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/40">
                                {/* Animation de fond */}
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                                    transition={{ repeat: Infinity, duration: 4 }}
                                    className="absolute left-1/2 top-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/20"
                                />
                                <motion.div
                                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                                    transition={{ duration: 0.4 }}
                                    className="mb-6 inline-flex items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-600 p-4 shadow-2xl shadow-emerald-500/30"
                                >
                                    <Store className="h-10 w-10 text-white" />
                                </motion.div>
                                <h3 className="mb-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    Bienvenue sur la plateforme
                                </h3>
                                <p className="mb-8 text-sm text-slate-600 dark:text-slate-400">
                                    Créez votre première boutique pour commencer à vendre et développer votre activité.
                                </p>

                                <Button
                                    asChild
                                    className="group h-12 w-full rounded-2xl bg-linear-to-r from-emerald-500 to-emerald-600 text-sm font-semibold text-white shadow-xl shadow-emerald-500/30 transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-emerald-500/40 dark:from-emerald-600 dark:to-emerald-700"
                                >
                                    <Link href="/devenir-vendeur">
                                        <Sparkles className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                                        Créer votre boutique
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AuthLayout>
    );
}
