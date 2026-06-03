// resources/js/components/navigation/ProductsMenuContent.tsx
import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    Factory,
    Globe,
    Handshake,
    Palette,
    Settings,
    ShoppingCart,
    Smartphone,
    Sparkles,
    Store,
    TrendingUp,
    Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*                                   Data                                     */
/* -------------------------------------------------------------------------- */

const tools = [
    {
        icon: Store,
        title: 'Boutique en ligne',
        desc: 'Créez une vitrine premium et vendez 24h/24.',
    },
    {
        icon: ShoppingCart,
        title: 'Panier & Checkout',
        desc: 'Tunnel de conversion optimisé.',
    },
    {
        icon: Smartphone,
        title: 'Mobile First',
        desc: 'Expérience parfaite sur tous les écrans.',
    },
    {
        icon: Globe,
        title: 'Domaine personnalisé',
        desc: 'Connectez votre propre domaine.',
    },
    {
        icon: Palette,
        title: 'Personnalisation',
        desc: 'Adaptez votre boutique à votre image.',
    },
    {
        icon: Settings,
        title: 'Gestion avancée',
        desc: 'Stocks, commandes et clients centralisés.',
    },
];

const solutions = [
    {
        icon: Handshake,
        label: 'Pour les artisans',
        description: 'Simple, rapide et accessible.',
        href: route('vendor.register'),
    },
    {
        icon: Building2,
        label: 'Pour les PME',
        description: 'Automatisez vos ventes.',
        href: route('vendor.register'),
    },
    {
        icon: Factory,
        label: 'Grandes marques',
        description: 'Infrastructure robuste.',
        href: route('vendor.register'),
    },
];

/* -------------------------------------------------------------------------- */
/*                                 Component                                  */
/* -------------------------------------------------------------------------- */

export function Support() {
    return (
        <div
            className={cn(
                // Animation "voile"
                'animate-in duration-300 fade-in slide-in-from-top-6',
                // Container
                'relative w-full overflow-hidden',
                'rounded-b-[2rem]',
                'border-x border-b border-slate-200/70',
                'bg-white/95 backdrop-blur-2xl',
                'shadow-[0_24px_80px_-20px_rgba(15,23,42,0.18)]',
                'dark:border-slate-800/70',
                'dark:bg-slate-950/95',
                'dark:shadow-[0_24px_80px_-20px_rgba(0,0,0,0.65)]',
            )}
        >
            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-emerald-500/8 blur-3xl dark:bg-emerald-400/10" />
                <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-slate-400/8 blur-3xl dark:bg-slate-200/5" />
            </div>

            {/* ------------------------------------------------------------------ */}
            {/* Header */}
            {/* ------------------------------------------------------------------ */}
            <div className="relative border-b border-slate-200/70 bg-linear-to-r from-emerald-50/90 via-white to-slate-50/90 px-6 py-5 dark:border-slate-800/70 dark:from-emerald-950/25 dark:via-slate-950 dark:to-slate-900">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-emerald-700 uppercase shadow-sm dark:border-emerald-800/50 dark:bg-emerald-500/10 dark:text-emerald-300">
                            <Sparkles className="h-3.5 w-3.5" />
                            Plateforme e-commerce
                        </div>

                        <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Créez votre boutique en ligne professionnelle
                        </h3>

                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                            Une solution moderne pour vendre, gérer vos
                            commandes et développer votre activité avec une
                            expérience premium.
                        </p>
                    </div>

                    <div className="hidden items-center gap-3 lg:flex">
                        {[
                            { icon: TrendingUp, label: 'Croissance' },
                            { icon: Zap, label: 'Rapide' },
                            { icon: Smartphone, label: 'Responsive' },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                            >
                                <item.icon className="h-4.5 w-4.5 text-emerald-500" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ------------------------------------------------------------------ */}
            {/* Main Content */}
            {/* ------------------------------------------------------------------ */}
            <div className="relative grid grid-cols-12">
                {/* ------------------------------------------------------------------ */}
                {/* Left Content */}
                {/* ------------------------------------------------------------------ */}
                <section className="col-span-12 p-6 xl:col-span-8 xl:p-7">
                    {/* Section Header */}
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/15">
                                <Store className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400">
                                    Outils de vente
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Toutes les fonctionnalités essentielles.
                                </p>
                            </div>
                        </div>

                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {tools.length} modules
                        </span>
                    </div>

                    {/* Compact Tools Grid */}
                    <div className="grid gap-3 md:grid-cols-2">
                        {tools.map((tool, index) => (
                            <Link
                                key={tool.title}
                                href={route('vendor.register')}
                                className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/10 dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-emerald-800/60"
                            >
                                <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-emerald-500 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                <div className="flex items-start gap-3">
                                    <div
                                        className={cn(
                                            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all',
                                            index % 2 === 0
                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
                                        )}
                                    >
                                        <tool.icon className="h-4 w-4" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                                                {tool.title}
                                            </h4>

                                            <ArrowRight className="h-4 w-4 shrink-0 translate-x-1 text-slate-300 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-emerald-500 group-hover:opacity-100" />
                                        </div>

                                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                            {tool.desc}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-4 rounded-2xl border border-emerald-200/70 bg-linear-to-r from-emerald-50 to-slate-50 p-4 dark:border-emerald-800/40 dark:from-emerald-950/20 dark:to-slate-900">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
                                <TrendingUp className="h-4 w-4" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                    Développez vos ventes
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Lancez votre boutique en quelques minutes.
                                </p>
                            </div>

                            <Link
                                href={route('vendor.register')}
                                className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
                            >
                                Commencer
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ------------------------------------------------------------------ */}
                {/* Right Sidebar - Compact */}
                {/* ------------------------------------------------------------------ */}
                <aside className="col-span-12 border-t border-slate-200/70 bg-slate-50/70 p-6 xl:col-span-4 xl:border-t-0 xl:border-l dark:border-slate-800/70 dark:bg-slate-900/40">
                    <div className="mb-4">
                        <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400">
                            Solutions
                        </p>
                        <h4 className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
                            Pour chaque activité
                        </h4>
                    </div>

                    {/* Compact solution list */}
                    <div className="space-y-2">
                        {solutions.map((solution) => (
                            <Link
                                key={solution.label}
                                href={solution.href}
                                className="group flex items-center gap-3 rounded-2xl border border-transparent p-3 transition-all duration-300 hover:border-emerald-200 hover:bg-white hover:shadow-sm dark:hover:border-emerald-800/50 dark:hover:bg-slate-800/70"
                            >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                                    <solution.icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                                        {solution.label}
                                    </p>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                        {solution.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Compact CTA */}
                    <div className="mt-4 rounded-2xl border border-emerald-200/70 bg-linear-to-br from-emerald-50 via-white to-slate-50 p-4 dark:border-emerald-800/40 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-950">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
                            <Zap className="h-4 w-4" />
                        </div>

                        <h5 className="text-sm font-semibold text-slate-900 dark:text-white">
                            Prêt à vendre ?
                        </h5>

                        <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                            Créez votre boutique professionnelle dès
                            aujourd’hui.
                        </p>

                        <Link
                            href={route('vendor.register')}
                            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                        >
                            Créer ma boutique
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </aside>
            </div>
        </div>
    );
}
