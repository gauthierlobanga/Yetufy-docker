/* eslint-disable @typescript-eslint/no-unused-vars */
import { motion, useInView } from 'framer-motion';
import {
    Zap,
    ShieldCheck,
    Headphones,
    Globe,
    Package,
    BarChart3,
    Server,
    Lock,
} from 'lucide-react';
import { useRef } from 'react';

interface BentoGridsProps {
    stats?: {
        pageLoadTime?: string;
        uptime?: string;
        supportResponseTime?: string;
        productsCount?: number;
        ordersProcessed?: number;
        paymentMethods?: number;
        countriesServed?: number;
    };
}

export default function BentoGrids({ stats }: BentoGridsProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    const defaultStats = {
        pageLoadTime: '< 1.2s',
        uptime: '99.99%',
        supportResponseTime: '< 2h',
        productsCount: 15000,
        ordersProcessed: 250000,
        paymentMethods: 12,
        countriesServed: 45,
    };

    const s = { ...defaultStats, ...stats };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100, damping: 15 },
        },
    };

    return (
        <section ref={ref} className="relative overflow-hidden py-28">
            {/* PREMIUM BACKGROUND */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 -right-40 h-125 w-125 rounded-full bg-primary/10 blur-[140px]" />
                <div className="absolute -bottom-40 -left-40 h-125 w-125 rounded-full bg-secondary/10 blur-[140px]" />
                <div className="absolute inset-0 bg-[radial-linear(circle_at_center,rgba(255,255,255,0.4),transparent_70%)] dark:bg-[radial-linear(circle_at_center,rgba(255,255,255,0.05),transparent_70%)]" />
            </div>

            <div className="mx-auto max-w-6xl px-4 md:px-6">
                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="mx-auto mb-20 max-w-3xl text-center"
                >
                    <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur">
                        Pourquoi nous choisir
                    </span>

                    <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
                        Une plateforme{' '}
                        <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                            pensée pour performer
                        </span>
                    </h2>

                    <p className="mt-4 text-lg text-muted-foreground">
                        Des milliers de marchands développent leur business avec
                        une infrastructure rapide, fiable et scalable.
                    </p>
                </motion.div>

                {/* GRID */}
                <motion.div
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    variants={containerVariants}
                    className="grid gap-5 md:grid-cols-4"
                >
                    {/* HERO CARD */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ y: -8, scale: 1.01 }}
                        className="group relative overflow-hidden rounded-3xl bg-linear-to-br from-primary via-primary to-primary/90 p-8 text-white shadow-2xl md:col-span-2 md:row-span-2"
                    >
                        <div className="absolute -top-20 -right-20 h-52 w-52 rounded-full bg-white/10 blur-3xl transition-all duration-500 group-hover:scale-150" />

                        <div>
                            <div className="flex items-center gap-2 opacity-90">
                                <Zap className="h-5 w-5" />
                                <span className="text-xs tracking-wider uppercase">
                                    Performance
                                </span>
                            </div>

                            <h3 className="mt-3 text-2xl font-semibold">
                                Navigation ultra-rapide
                            </h3>

                            <p className="mt-3 text-sm text-white/90">
                                Chargement instantané, filtres fluides et
                                expérience sans friction. Vos clients naviguent
                                sans attendre.
                            </p>
                        </div>

                        <div className="mt-10">
                            <div className="text-6xl font-bold">
                                {s.pageLoadTime}
                            </div>
                            <p className="text-sm text-white/80">
                                temps moyen de chargement
                            </p>
                        </div>
                    </motion.div>

                    {/* SMALL CARDS TEMPLATE */}
                    {[
                        {
                            icon: Server,
                            label: 'Disponibilité',
                            title: 'Toujours en ligne',
                            value: s.uptime,
                            desc: 'uptime garanti',
                        },
                        {
                            icon: Headphones,
                            label: 'Support',
                            title: 'Réponse rapide',
                            value: s.supportResponseTime,
                            desc: 'temps moyen',
                        },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            whileHover={{ y: -6 }}
                            className="group rounded-3xl border border-white/20 bg-white/70 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
                        >
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <item.icon className="h-5 w-5 text-primary" />
                                <span className="text-xs tracking-wider uppercase">
                                    {item.label}
                                </span>
                            </div>

                            <h3 className="mt-2 text-lg font-semibold">
                                {item.title}
                            </h3>

                            <div className="mt-6 text-4xl font-bold text-primary">
                                {item.value}
                            </div>

                            <p className="text-sm text-muted-foreground">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}

                    {/* SECURITY */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ y: -6 }}
                        className="rounded-3xl bg-linear-to-br from-muted/60 to-muted/30 p-8 shadow-xl backdrop-blur md:col-span-2"
                    >
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                            <span className="text-xs tracking-wider text-muted-foreground uppercase">
                                Sécurité
                            </span>
                        </div>

                        <h3 className="mt-2 text-xl font-semibold">
                            Protection maximale
                        </h3>

                        <p className="mt-3 text-sm text-muted-foreground">
                            Paiements sécurisés, chiffrement avancé et
                            protection anti-fraude.
                        </p>

                        <div className="mt-6 flex gap-4 text-sm">
                            <span className="flex items-center gap-1">
                                <Lock className="h-4 w-4 text-primary" />
                                PCI DSS
                            </span>
                            <span className="flex items-center gap-1">
                                <ShieldCheck className="h-4 w-4 text-primary" />
                                3D Secure
                            </span>
                        </div>
                    </motion.div>

                    {/* SCALE */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ y: -6 }}
                        className="rounded-3xl border border-white/20 bg-white/70 p-8 shadow-xl backdrop-blur-xl md:col-span-2 dark:bg-white/5"
                    >
                        <div className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-primary" />
                            <span className="text-xs tracking-wider text-muted-foreground uppercase">
                                Global
                            </span>
                        </div>

                        <h3 className="mt-2 text-xl font-semibold">
                            Vendez partout
                        </h3>

                        <p className="mt-3 text-sm text-muted-foreground">
                            Présent dans {s.countriesServed} pays avec une
                            infrastructure scalable.
                        </p>

                        <div className="mt-6 flex justify-between">
                            <div>
                                <div className="text-4xl font-bold text-primary">
                                    {s.productsCount.toLocaleString()}+
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    produits
                                </p>
                            </div>

                            <div className="text-right">
                                <div className="text-4xl font-bold text-primary">
                                    {s.ordersProcessed.toLocaleString()}+
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    commandes
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
