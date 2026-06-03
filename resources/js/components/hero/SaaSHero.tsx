import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SaaSHeroProps {
    stats: {
        stores_created: number;
        products_listed: number;
        countries_served: number;
    };
}

export default function SaaSHero({ stats }: SaaSHeroProps) {
    return (
        <section className="relative overflow-hidden bg-linear-to-br from-amber-50 to-white py-20 lg:py-32">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-amber-100/40 via-white to-transparent" />

            <div className="relative mx-auto max-w-7xl px-4">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    {/* LEFT */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-700">
                            <Sparkles className="h-4 w-4" />
                            Lancez votre boutique en ligne
                        </span>

                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                            Vendez en ligne{' '}
                            <span className="text-amber-600">simplement</span>
                        </h1>

                        <p className="max-w-lg text-lg text-gray-500 md:text-xl">
                            Créez votre site e‑commerce professionnel, gérez vos
                            produits, vos commandes et acceptez les paiements en
                            ligne – le tout sans compétence technique.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Button
                                size="lg"
                                asChild
                                className="rounded-full px-8 py-6 text-lg"
                            >
                                <Link href={route('vendor.register')}>
                                    Démarrer gratuitement
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                asChild
                                className="rounded-full px-8 py-6 text-lg"
                            >
                                <Link href="#plans">Voir les plans</Link>
                            </Button>
                        </div>
                    </motion.div>

                    {/* RIGHT */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="hidden lg:block"
                    >
                        <div className="relative mx-auto max-w-md">
                            <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-amber-300/30 to-amber-500/10 blur-2xl" />
                            <img
                                src="/storage/images/shopping-basket.jpg"
                                alt="Boutique en ligne"
                                className="relative rounded-3xl shadow-2xl"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-20 grid grid-cols-3 gap-8 text-center"
                >
                    <div>
                        <p className="text-4xl font-extrabold text-amber-600">
                            {stats.stores_created}+
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                            boutiques créées
                        </p>
                    </div>
                    <div>
                        <p className="text-4xl font-extrabold text-amber-600">
                            {stats.products_listed}+
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                            produits en ligne
                        </p>
                    </div>
                    <div>
                        <p className="text-4xl font-extrabold text-amber-600">
                            {stats.countries_served}
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                            pays desservis
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
