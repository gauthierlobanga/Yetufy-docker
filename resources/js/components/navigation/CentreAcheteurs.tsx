// resources/js/components/navigation/ProductsMenuContent.tsx
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    Building2,
    Factory,
    Handshake,
    Search,
    ShieldCheck,
    ShoppingCart,
    Smartphone,
    Sparkles,
    Star,
    Store,
    TrendingUp,
    Truck,
    Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*                                   Data                                     */
/* -------------------------------------------------------------------------- */

const tools = [
    {
        icon: Store,
        title: 'Catalogue intelligent',
        desc: 'Des milliers de produits classés de manière claire et intuitive.',
    },
    {
        icon: Search,
        title: 'Recherche avancée',
        desc: 'Filtres puissants pour trouver exactement ce qu’il vous faut.',
    },
    {
        icon: ShoppingCart,
        title: 'Commande simplifiée',
        desc: 'Ajoutez au panier et commandez en quelques clics.',
    },
    {
        icon: Smartphone,
        title: 'Expérience mobile',
        desc: 'Navigation fluide sur smartphone, tablette et ordinateur.',
    },
    {
        icon: Truck,
        title: 'Livraison rapide',
        desc: 'Suivez vos commandes et recevez vos produits rapidement.',
    },
    {
        icon: ShieldCheck,
        title: 'Paiement sécurisé',
        desc: 'Transactions fiables et protection de vos achats.',
    },
];

const solutions = [
    {
        icon: Handshake,
        label: 'Achats particuliers',
        description: 'Produits du quotidien au meilleur prix.',
        href: route('tenant.product.index'),
    },
    {
        icon: Building2,
        label: 'Achats professionnels',
        description: 'Solutions adaptées aux entreprises.',
        href: route('tenant.product.index'),
    },
    {
        icon: Factory,
        label: 'Achats en volume',
        description: 'Tarifs avantageux pour les grosses commandes.',
        href: route('tenant.product.index'),
    },
];

const highlights = [
    { icon: TrendingUp, label: 'Meilleurs prix' },
    { icon: Star, label: 'Produits fiables' },
    { icon: Zap, label: 'Commande rapide' },
];

/* -------------------------------------------------------------------------- */
/*                              Main Component                                */
/* -------------------------------------------------------------------------- */

export function CentreAcheteurs() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
                'relative w-full overflow-hidden rounded-b-[2rem]',
                'border-x border-b border-slate-200/70',
                'bg-white/96 backdrop-blur-2xl',
                'shadow-[0_28px_90px_-24px_rgba(15,23,42,0.20)]',
                'dark:border-slate-800/70',
                'dark:bg-slate-950/96',
                'dark:shadow-[0_28px_90px_-24px_rgba(0,0,0,0.70)]',
            )}
        >
            {/* Decorative Background */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-400/40 to-transparent" />
                <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-emerald-500/8 blur-3xl dark:bg-emerald-400/10" />
                <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-slate-400/8 blur-3xl dark:bg-slate-200/5" />
            </div>

            {/* Header */}
            <div className="relative border-b border-slate-200/70 bg-linear-to-r from-emerald-50/90 via-white to-slate-50/90 px-6 py-4 dark:border-slate-800/70 dark:from-emerald-950/20 dark:via-slate-950 dark:to-slate-900">
                <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-widest text-emerald-700 uppercase shadow-sm dark:border-emerald-800/50 dark:bg-emerald-500/10 dark:text-emerald-300">
                            <Sparkles className="h-3.5 w-3.5" />
                            Centre acheteurs
                        </div>
                        <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Achetez plus vite, simplement et en toute confiance
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                            Marketplace moderne pour trouver les meilleurs
                            produits.
                        </p>
                    </div>
                    <div className="hidden items-center gap-2 lg:flex">
                        {highlights.map((item) => (
                            <div
                                key={item.label}
                                className="group flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/90 px-3 py-2 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10">
                                    <item.icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Layout */}
            <div className="relative grid grid-cols-12">
                {/* Left Content */}
                <section className="col-span-12 p-4 xl:col-span-8 xl:p-5">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/15">
                                <Store className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                Fonctionnalités
                            </p>
                        </div>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {tools.length} outils
                        </span>
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                        {tools.map((tool, index) => (
                            <Link
                                key={tool.title}
                                href={route('tenant.product.index')}
                                className="group relative overflow-hidden rounded-xl border border-slate-200/70 bg-white/90 p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-emerald-800/60"
                            >
                                <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-emerald-500 via-emerald-400 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                <div className="flex items-start gap-2">
                                    <div
                                        className={cn(
                                            'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all',
                                            index % 2 === 0
                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
                                        )}
                                    >
                                        <tool.icon className="h-3.5 w-3.5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-1">
                                            <h4 className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                                                {tool.title}
                                            </h4>
                                            <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 translate-x-1 text-slate-300 opacity-0 transition-all group-hover:translate-x-0 group-hover:text-emerald-500 group-hover:opacity-100" />
                                        </div>
                                        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                            {tool.desc}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-3 rounded-xl border border-emerald-200/70 bg-linear-to-r from-emerald-50 to-slate-50 p-3 dark:border-emerald-800/40 dark:from-emerald-950/20 dark:to-slate-900">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
                                <TrendingUp className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                    Explorez notre catalogue
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Des milliers de produits disponibles.
                                </p>
                            </div>
                            <Link
                                href={route('tenant.product.index')}
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/20"
                            >
                                Explorer
                                <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Sidebar */}
                <aside className="col-span-12 border-t border-slate-200/70 bg-slate-50/70 p-4 xl:col-span-4 xl:border-t-0 xl:border-l dark:border-slate-800/70 dark:bg-slate-900/40">
                    <div className="mb-3">
                        <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                            Solutions
                        </p>
                        <h4 className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
                            Adapté à chaque profil
                        </h4>
                    </div>
                    <div className="space-y-2">
                        {solutions.map((solution) => (
                            <Link
                                key={solution.label}
                                href={solution.href}
                                className="group flex items-start gap-2 rounded-xl border border-transparent p-2.5 transition-all hover:border-emerald-200 hover:bg-white hover:shadow-sm dark:hover:border-emerald-800/50 dark:hover:bg-slate-800/70"
                            >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                                    <solution.icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                                        {solution.label}
                                    </p>
                                    <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                                        {solution.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-3 rounded-xl border border-emerald-200/70 bg-linear-to-br from-emerald-50 via-white to-slate-50 p-3 dark:border-emerald-800/40 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-950">
                        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
                            <Zap className="h-4 w-4" />
                        </div>
                        <h5 className="text-sm font-semibold text-slate-900 dark:text-white">
                            Commencez vos achats
                        </h5>
                        <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                            Trouvez rapidement les produits adaptés.
                        </p>
                        <Link
                            href={route('tenant.product.index')}
                            className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                        >
                            Voir les produits
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </aside>
            </div>
        </motion.div>
    );
}
