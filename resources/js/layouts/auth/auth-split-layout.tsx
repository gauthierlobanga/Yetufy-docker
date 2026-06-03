import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Globe, BarChart3, Store } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name, isTenant, tenant } = usePage().props as {
        name?: string;
        app_logo?: string;
        isTenant?: boolean;
        tenant?: {
            raison_sociale: string;
            logo_url?: string | null;
            url?: string;
        } | null;
    };

    // Détermine le branding affiché à gauche
    const brandingName = isTenant && tenant
        ? tenant.raison_sociale
        : (name ?? 'Yetufy');

    const brandingLogo = isTenant && tenant?.logo_url
        ? tenant.logo_url
        : null;

    const brandingUrl = isTenant && tenant?.url
        ? tenant.url
        : home();

    const features = [
        { icon: Globe, label: 'E-commerce international' },
        { icon: BarChart3, label: 'Analyses avancées' },
        { icon: ShieldCheck, label: 'Sécurité renforcée' },
    ];

    // Ajout d'un badge "Boutique" pour le tenant
    if (isTenant) {
        features.unshift({ icon: Store, label: 'Boutique personnalisée' });
    }

    return (
        <div className="grid min-h-svh bg-background lg:grid-cols-2">
            {/* ==================== Left branding panel ==================== */}
            <div className="relative hidden overflow-hidden lg:flex">
                <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950" />

                {/* Decorative blobs */}
                <div className="absolute top-16 left-16 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
                <div className="absolute right-10 bottom-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

                {/* Grid overlay */}
                <div className="absolute inset-0 bg-[linear-linear(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-linear(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[40px_40px]" />

                <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
                    {/* Logo / Branding */}
                    <Link
                        href={brandingUrl}
                        className="inline-flex items-center gap-3"
                    >
                        {brandingLogo ? (
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl overflow-hidden">
                                <img
                                    src={brandingLogo}
                                    alt={brandingName}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl">
                                <AppLogoIcon className="size-7 fill-current text-white" />
                            </div>
                        )}
                        <span className="text-lg font-semibold tracking-tight truncate max-w-55">
                            {brandingName}
                        </span>
                    </Link>

                    {/* Main content */}
                    <div className="max-w-lg">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-emerald-200 backdrop-blur-xl">
                                <Sparkles className="h-4 w-4" />
                                {isTenant
                                    ? 'Connectez-vous à votre boutique'
                                    : 'Plateforme moderne de commerce'}
                            </div>

                            <h2 className="text-4xl leading-tight font-semibold tracking-tight">
                                {isTenant
                                    ? 'Accédez à votre espace personnel'
                                    : 'Créez, gérez et développez votre activité en ligne.'}
                            </h2>

                            <p className="mt-5 text-base leading-7 text-slate-300">
                                {isTenant
                                    ? 'Gérez vos commandes, suivez vos livraisons et découvrez nos offres exclusives.'
                                    : 'Une expérience élégante pour vendre vos produits, suivre vos performances et gérer vos clients.'}
                            </p>
                        </motion.div>

                        {/* Features */}
                        <div className="mt-10 grid gap-4">
                            {features.map(({ icon: Icon, label }) => (
                                <div
                                    key={label}
                                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-200">
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="text-sm text-slate-400">
                        © {new Date().getFullYear()} {brandingName}. Tous droits réservés.
                    </p>
                </div>
            </div>

            {/* ====================== Right content panel ========================== */}
            <div className="relative flex items-center justify-center px-6 py-10 md:px-10">
                {/* Background accents (mobile + desktop) */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute top-10 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl lg:hidden" />
                    <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-slate-400/10 blur-3xl dark:bg-slate-500/5" />
                    <div className="absolute inset-0 bg-[radial-linear(circle_at_top,rgba(16,185,129,0.06),transparent_40%)] dark:bg-[radial-linear(circle_at_top,rgba(16,185,129,0.04),transparent_45%)]" />
                    <div className="absolute inset-0 bg-[linear-linear(to_right,rgba(148,163,184,0.04)_1px,transparent_1px),linear-linear(to_bottom,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-size-[36px_36px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="relative z-10 w-full max-w-md"
                >
                    {/* Mobile logo */}
                    <Link
                        href={brandingUrl}
                        className="mb-8 flex justify-center lg:hidden"
                    >
                        <div className="group relative">
                            <div className="absolute inset-0 rounded-3xl bg-emerald-500/20 blur-xl transition-all duration-300 group-hover:bg-emerald-500/30" />
                            {brandingLogo ? (
                                <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl border border-white/60 bg-white/90 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/85 dark:shadow-black/20 overflow-hidden">
                                    <img
                                        src={brandingLogo}
                                        alt={brandingName}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl border border-white/60 bg-white/90 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/85 dark:shadow-black/20">
                                    <AppLogoIcon className="size-9 fill-current text-emerald-600 dark:text-emerald-400" />
                                </div>
                            )}
                        </div>
                    </Link>

                    {/* Header */}
                    <div className="mb-8 text-center lg:text-left">

                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                            {title}
                        </h1>

                        {description && (
                            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Form container */}
                    <div className="relative overflow-hidden rounded-xl border border-white/70 bg-white/85 shadow-lg shadow-slate-900/8 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/85 dark:shadow-black/30">
                        {/* <div className="h-1 w-full bg-linear-to-r from-emerald-500 via-emerald-400 to-teal-400" /> */}
                        <div className="pointer-events-none absolute inset-0 bg-[radial-linear(circle_at_top,rgba(255,255,255,0.6),transparent_45%)] dark:bg-[radial-linear(circle_at_top,rgba(255,255,255,0.04),transparent_45%)]" />
                        <div className="relative p-6 sm:p-8">{children}</div>
                    </div>

                    <p className="mt-6 text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
                        Connexion protégée par chiffrement SSL/TLS.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
