import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    BookOpen,
    HelpCircle,
    ImageOff,
    Mail,
    Sparkles,
    Store,
} from 'lucide-react';

interface Category {
    id: number;
    nom: string;
    slug: string;
    url: string;
    image?: string | null;
}

interface HeaderData {
    categories: Category[];
}

const resources = [
    {
        icon: BookOpen,
        label: 'Blog',
        description: 'Conseils, tendances et guides',
        href: route('blog.index'),
    },
    {
        icon: HelpCircle,
        label: "Centre d'aide",
        description: 'Réponses à vos questions',
        href: route('page.help'),
    },
    {
        icon: HelpCircle,
        label: 'À propos',
        description: 'Découvrez notre mission',
        href: route('page.about'),
    },
    {
        icon: Mail,
        label: 'Contact',
        description: 'Notre équipe vous répond',
        href: route('page.contact'),
    },
];

export function ChooseYetuContent() {
    const { headerData } = usePage().props as { headerData?: HeaderData };
    const categories = headerData?.categories ?? [];

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scaleY: 0.96, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scaleY: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, scaleY: 0.96, filter: 'blur(4px)' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'top center' }}
            className="mx-auto w-full border border-white/20 bg-white/70 shadow-2xl shadow-black/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80"
        >
            <div className="relative overflow-hidden ">
                {/* Fond décoratif */}
                <div className="absolute inset-0 bg-linear-to-br from-white/60 via-slate-50/40 to-emerald-50/30 dark:from-slate-950/60 dark:via-slate-900/40 dark:to-emerald-950/20" />
                <div className="absolute top-0 left-0 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
                <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-slate-400/10 blur-3xl dark:bg-slate-600/10" />

                <div className="relative grid grid-cols-1 gap-6 p-3 lg:grid-cols-[1fr_360px] xl:grid-cols-[2fr_340px]">
                    {/* Colonne principale : Catégories */}
                    <div className="space-y-6">
                        {/* Entête */}
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50/80 px-3 py-1 text-[11px] font-semibold tracking-wide text-emerald-700 uppercase backdrop-blur-sm dark:border-emerald-800/60 dark:bg-emerald-950/30 dark:text-emerald-300">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    Explorez nos univers
                                </div>
                                <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                                    Catégories populaires
                                </h3>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Découvrez les produits les plus recherchés par nos clients.
                                </p>
                            </div>

                            <Link
                                href={route('tenant.product.category.index')}
                                className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300"
                            >
                                Voir toutes les catégories
                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        </div>

                        {/* Grille de catégories */}
                        {categories.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                {categories.slice(0, 6).map((category, index) => (
                                    <motion.div
                                        key={category.id}
                                        initial={{ opacity: 0, y: 18 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.4,
                                            delay: index * 0.05,
                                        }}
                                        whileHover={{ y: -6, scale: 1.02 }}
                                        className="group"
                                    >
                                        <Link
                                            href={category.url}
                                            className="relative isolate block overflow-hidden rounded-2xl border border-slate-200/70 bg-white/75 shadow-sm ring-1 ring-slate-100/60 backdrop-blur-xl transition-all duration-500 hover:border-emerald-300/70 hover:shadow-xl hover:shadow-emerald-500/10 dark:border-slate-800 dark:bg-slate-900/80 dark:ring-slate-800/60 dark:hover:border-emerald-800"
                                        >
                                            {/* Image */}
                                            <div className="relative aspect-4/2.5 overflow-hidden bg-slate-100 dark:bg-slate-800">
                                                {category.image ? (
                                                    <>
                                                        <img
                                                            src={category.image}
                                                            alt={category.nom}
                                                            loading="lazy"
                                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent opacity-80" />
                                                    </>
                                                ) : (
                                                    <div className="flex h-full items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
                                                        <ImageOff className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                                                    </div>
                                                )}

                                                <div className="absolute top-3 left-3 rounded-xl border border-white/20 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200">
                                                    Catégorie
                                                </div>
                                            </div>

                                            {/* Contenu */}
                                            <div className="p-4">
                                                <div className="flex items-center justify-between gap-3">
                                                    <h4 className="line-clamp-1 text-sm font-semibold text-slate-900 transition-colors duration-300 group-hover:text-emerald-600 dark:text-slate-100 dark:group-hover:text-emerald-400">
                                                        {category.nom}
                                                    </h4>
                                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all duration-300 group-hover:bg-emerald-100 group-hover:text-emerald-600 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-emerald-900/30 dark:group-hover:text-emerald-400">
                                                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 p-10 text-center dark:border-slate-700 dark:bg-slate-900/50">
                                <Store className="mx-auto mb-3 h-10 w-10 text-slate-400 dark:text-slate-500" />
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                    Aucune catégorie disponible pour le moment.
                                </p>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Revenez bientôt pour découvrir de nouvelles catégories.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Colonne secondaire : Ressources & CTA */}
                    <div className="space-y-6">
                        {/* Ressources */}
                        <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm ring-1 ring-slate-100/60 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 dark:ring-slate-800/60">
                            <div className="mb-4">
                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                    Ressources utiles
                                </h4>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Guides, assistance et informations.
                                </p>
                            </div>

                            <div className="space-y-1">
                                {resources.map((resource) => (
                                    <Link
                                        key={resource.label}
                                        href={resource.href}
                                        className="group flex items-start gap-3 rounded-xl px-3 py-3 transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-900/40">
                                            <resource.icon className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-slate-800 transition-colors group-hover:text-emerald-600 dark:text-slate-200 dark:group-hover:text-emerald-400">
                                                {resource.label}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {resource.description}
                                            </p>
                                        </div>
                                        <ArrowRight className="mt-1 h-4 w-4 text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-emerald-500 dark:text-slate-500" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <motion.div
                            whileHover={{ y: -2 }}
                            transition={{ duration: 0.2 }}
                            className="relative overflow-hidden rounded-2xl border border-emerald-200/70 bg-linear-to-br from-emerald-50 via-white to-slate-50 p-6 shadow-lg shadow-emerald-500/5 before:absolute before:inset-0 before:bg-linear-to-r before:from-emerald-500/10 before:via-cyan-500/10 before:to-emerald-500/10 before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100 dark:border-emerald-900/50 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900"
                        >
                            <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-emerald-400/10 blur-2xl" />

                            <div className="relative">
                                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm dark:bg-emerald-900/30 dark:text-emerald-400">
                                    <Sparkles className="h-5 w-5" />
                                </div>

                                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                                    Lancez votre boutique
                                </h4>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                    Créez votre boutique en ligne gratuitement et commencez à vendre en quelques minutes.
                                </p>

                                <Link
                                    href={route('vendor.register')}
                                    className="group mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all duration-300 hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-600/30 dark:bg-emerald-500 dark:hover:bg-emerald-400"
                                >
                                    Commencer gratuitement
                                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
