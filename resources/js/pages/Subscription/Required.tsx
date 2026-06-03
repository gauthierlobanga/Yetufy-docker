import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MainLayout from '@/layouts/main-layout';

interface Props {
    trialEndedAt?: string;
}

export default function SubscriptionRequired({ trialEndedAt }: Props) {
    return (
        <MainLayout>
            <Head title="Abonnement requis" />
            <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-linear-to-b from-white to-emerald-50/50 px-4 dark:from-slate-950 dark:to-emerald-950/20">
                {/* Cercles décoratifs d’arrière-plan */}
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-800/10" />
                    <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-slate-300/20 blur-3xl dark:bg-slate-700/10" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="relative max-w-lg text-center"
                >
                    {/* Icône cadenas */}
                    <div className="mb-8 inline-flex">
                        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-200 dark:from-amber-500 dark:to-amber-700 dark:shadow-amber-900/30">
                            <Lock className="h-12 w-12 text-white" />
                            <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow dark:bg-slate-800">
                                <Clock className="h-5 w-5 text-amber-500" />
                            </div>
                        </div>
                    </div>

                    {/* Titre */}
                    <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl dark:text-white">
                        Essai terminé
                    </h1>

                    {/* Sous‑titre */}
                    <p className="mb-2 text-lg font-semibold text-slate-700 dark:text-slate-300">
                        Votre période d’essai gratuit a expiré.
                    </p>

                    {/* Description */}
                    <p className="mb-6 text-slate-600 dark:text-slate-400">
                        Pour continuer à profiter de toutes les fonctionnalités
                        de votre boutique, choisissez un plan adapté à votre
                        activité.
                    </p>

                    {/* Date d’expiration (si fournie) */}
                    {trialEndedAt && (
                        <p className="mb-6 rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                            Expiré depuis le{' '}
                            {new Date(trialEndedAt).toLocaleDateString(
                                'fr-FR',
                                {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                },
                            )}
                        </p>
                    )}

                    {/* Bouton principal */}
                    <Button
                        asChild
                        size="lg"
                        className="group mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-6 text-lg font-bold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700 hover:shadow-xl dark:bg-emerald-500 dark:shadow-emerald-900/30 dark:hover:bg-emerald-600"
                    >
                        <Link href={route('vendor.payment')}>
                            <Sparkles className="h-5 w-5" />
                            Choisir un plan
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>

                    {/* Sécurité & support */}
                    <div className="mt-8 flex flex-col items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            Paiement sécurisé
                        </div>
                        <Link
                            href={route('tenant.page.contact')}
                            className="hover:text-slate-700 dark:hover:text-slate-300"
                        >
                            Une question ? Contactez le support
                        </Link>
                    </div>
                </motion.div>
            </div>
        </MainLayout>
    );
}
