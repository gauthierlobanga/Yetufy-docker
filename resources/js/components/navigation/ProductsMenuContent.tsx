import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Store,
    ShoppingCart,
    Smartphone,
    Globe,
    Palette,
    Settings,
    Handshake,
    Building2,
    Factory,
    ArrowRight,
} from 'lucide-react';

const tools = [
    { icon: Store, title: 'Boutique en ligne', desc: 'Créez un site vitrine et vendez 24h/24.' },
    { icon: ShoppingCart, title: 'Panier & Checkout', desc: 'Processus de commande optimisé pour convertir.' },
    { icon: Smartphone, title: 'Mobile first', desc: 'Thèmes responsives pour smartphones et tablettes.' },
    { icon: Globe, title: 'Domaines personnalisés', desc: 'Utilisez votre propre nom de domaine.' },
    { icon: Palette, title: 'Personnalisation', desc: 'Modifiez les couleurs, polices et mises en page.' },
    { icon: Settings, title: 'Gestion avancée', desc: 'Inventaire, commandes, clients, tout est intégré.' },
];

const solutions = [
    { icon: Handshake, label: 'Pour les artisans' },
    { icon: Building2, label: 'Pour les PME' },
    { icon: Factory, label: 'Pour les grandes marques' },
];

export function ProductsMenuContent() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scaleY: 0.96, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scaleY: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, scaleY: 0.96, filter: 'blur(4px)' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'top center' }}
            className="mx-auto w-full border border-white/20 bg-white/70 shadow-2xl shadow-black/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80"
        >
            <div className="relative overflow-hidden p-10">
                {/* Fond décoratif */}
                <div className="absolute inset-0 bg-linear-to-br from-white/60 via-slate-50/40 to-emerald-50/30 dark:from-slate-950/60 dark:via-slate-900/40 dark:to-emerald-950/20" />
                <div className="absolute top-0 left-0 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
                <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-slate-400/10 blur-3xl dark:bg-slate-600/10" />

                <div className="relative grid grid-cols-1 gap-8 md:grid-cols-[2fr_1fr]">
                    {/* Colonne principale : Outils */}
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50/80 px-3 py-1 text-[11px] font-semibold tracking-wide text-emerald-700 uppercase backdrop-blur-sm dark:border-emerald-800/60 dark:bg-emerald-950/30 dark:text-emerald-300">
                            <Store className="h-3.5 w-3.5" />
                            Outils de vente
                        </div>
                        <h4 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                            Tout pour vendre en ligne
                        </h4>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Les fonctionnalités clés pour gérer votre boutique.
                        </p>

                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {tools.map((tool) => (
                                <Link
                                    key={tool.title}
                                    href={route('vendor.register')}
                                    className="group flex gap-4 rounded-2xl border border-slate-200/70 bg-white/75 p-4 shadow-sm backdrop-blur transition-all duration-300 hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-500/10 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-emerald-800"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 transition-colors group-hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-900/40 dark:group-hover:bg-emerald-900/40">
                                        <tool.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-emerald-600 dark:text-slate-100 dark:group-hover:text-emerald-400">
                                            {tool.title}
                                        </h5>
                                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                            {tool.desc}
                                        </p>
                                    </div>
                                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-emerald-500 dark:text-slate-600 dark:group-hover:text-emerald-400" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Colonne latérale : Solutions & CTA */}
                    <div className="space-y-6">
                        <div>
                            <h4 className="mb-3 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                Solutions
                            </h4>
                            <ul className="space-y-1">
                                {solutions.map((sol) => (
                                    <li key={sol.label}>
                                        <Link
                                            href={route('vendor.register')}
                                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition-all hover:bg-slate-50 hover:text-emerald-600 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-emerald-400"
                                        >
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                                <sol.icon className="h-4 w-4" />
                                            </div>
                                            <span className="font-medium">{sol.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* CTA */}
                        <div className="relative overflow-hidden rounded-2xl border border-emerald-200/70 bg-linear-to-br from-emerald-50 via-white to-slate-50 p-5 shadow-md shadow-emerald-500/5 dark:border-emerald-900/50 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900">
                            <div className="absolute -top-6 -right-6 h-16 w-16 rounded-full bg-emerald-400/10 blur-2xl" />
                            <div className="relative">
                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                    Boostez votre activité
                                </p>
                                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                                    Démarrez une boutique en quelques clics.
                                </p>
                                <Link
                                    href={route('vendor.register')}
                                    className="group mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-600/30 dark:bg-emerald-500 dark:hover:bg-emerald-400"
                                >
                                    Créer ma boutique
                                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
