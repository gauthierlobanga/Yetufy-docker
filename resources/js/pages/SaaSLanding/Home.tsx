/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/Pages/SaaSLanding/Home.tsx
import { Head, Link } from '@inertiajs/react';
import type { Variants } from 'framer-motion';
import { animate, motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    ArrowRight,
    Globe,
    Zap,
    DollarSign,
    TrendingUp,
    Shield,
    Store,
    CheckCircle,
    Sparkles,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { div } from 'three/src/nodes/math/OperatorNode.js';
import CobePremiumGSAP from '@/components/eldoraui/cobe-globe';
import { IntegrationProduct } from '@/components/eldoraui/IntegrationProduit';
import AnimatedCtaButton from '@/components/hero/AnimatedCtaButton';
import { Button } from '@/components/ui/button';
import MainLayout from '@/layouts/main-layout';
import { duration } from '@/routes/track';

gsap.registerPlugin(ScrollTrigger);

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------
interface Plan {
    id: number;
    name: string;
    description: string;
    price: number;
    currency: string;
    interval: string;
    trial_days: number;
    is_featured: boolean;
    is_recommended: boolean;
    features: string[];
    badge: string | null;
    button_text: string | null;
}

interface Testimonial {
    name: string;
    store: string;
    quote: string;
    avatar: string;
}

interface Props {
    plans?: Plan[];
    stats?: {
        stores_created: number;
        products_listed: number;
        countries_served: number;
    };
    testimonials?: Testimonial[];
}

interface HeroImage {
    src: string;
    alt: string;
    title?: string;
    subtitle?: string;
}

const images: HeroImage[] = [
    {
        src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        alt: 'Produit 1',
    },
    {
        src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        alt: 'Produit 2',
    },
    {
        src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        alt: 'Produit 3',
    },
    {
        src: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
        alt: 'Produit 4',
    },
    {
        src: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
        alt: 'Produit 5',
    },
    {
        src: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400',
        alt: 'Produit 6',
    },
    {
        src: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400',
        alt: 'Produit 8',
    },
];

// ----------------------------------------------------------------------
// Grille d’images premium
// ----------------------------------------------------------------------
function HeroImageGridPremium() {

     // Variantes d'animation
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.15,
            },
        },
    };

   const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }};

    const imageVariants = {
        hidden: { opacity: 0, y: 40, scale: 0.92 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.9,
                delay: i * 0.06,
                ease: [0.16, 1, 0.3, 1],
            },
        }),
    };

    return (
        <div className="relative">
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-emerald-500/20 blur-[120px]" />
                <div className="absolute right-10 bottom-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]" />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/70 p-4 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/70"
            >
                <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/40 to-transparent dark:from-white/5" />

                <div className="grid grid-cols-3 gap-3">
                    {images.slice(0, 6).map((img, index) => (
                        <motion.div
                            key={index}
                            custom={index}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover={{
                                y: -6,
                                scale: 1.03,
                                transition: { duration: 0.3 },
                            }}
                            className={`group relative overflow-hidden rounded-2xl ${index === 0 ? 'col-span-2 row-span-2' : ''}`}
                        >
                            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                loading="lazy"
                            />
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Floating cards */}
            <motion.div
                initial={{ opacity: 0, x: -30, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute bottom-8 -left-6 hidden w-56 rounded-2xl border border-white/20 bg-white/80 p-5 shadow-xl backdrop-blur-xl lg:block dark:bg-slate-900/80"
            >
                <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                        repeat: Infinity,
                        duration: 3,
                        ease: 'easeInOut',
                    }}
                >
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Revenus mensuels
                        </p>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                        $24,580
                    </p>
                    <p className="text-sm font-medium text-emerald-600">
                        +18.4% ce mois
                    </p>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 30, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="absolute -top-6 -right-6 hidden w-52 rounded-2xl border border-white/20 bg-white/80 p-5 shadow-xl backdrop-blur-xl lg:block dark:bg-slate-900/80"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{
                        repeat: Infinity,
                        duration: 4,
                        ease: 'easeInOut',
                    }}
                >
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Commandes
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                        1,248
                    </p>
                    <p className="text-sm font-medium text-emerald-600">
                        +32% cette semaine
                    </p>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="absolute right-4 bottom-4 hidden rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 shadow-lg lg:flex dark:border-emerald-900 dark:bg-emerald-950/50"
            >
                <Sparkles className="mr-2 h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    IA activée
                </span>
            </motion.div>
        </div>
    );
}
// ----------------------------------------------------------------------
// Section « Pour Tous »
// ----------------------------------------------------------------------
const pourTousCards = [
    {
        title: 'Lancez-vous rapidement',
        desc: 'Jacki Prince a lancé **Guests on Earth** depuis chez elle. C’est aujourd’hui une entreprise de plus de 4 M$.',
        icon: Zap,
    },
    {
        title: 'Voyez aussi grand que vous le souhaitez',
        desc: 'D’une boutique ne proposant qu’un seul produit, **Our Place** est devenue un empire des ustensiles de cuisine.',
        icon: TrendingUp,
    },
    {
        title: 'Passez au niveau supérieur',
        desc: 'Le fabricant de jouets emblématique vend désormais directement aux consommateurs. Le tout propulsé par Yetu.',
        icon: Store,
    },
];

export function PourTousSection() {
    return (
        <section className="relative overflow-hidden bg-linear-to-b from-white via-emerald-50/40 to-slate-50 py-24 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* Décorations d’ambiance */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-24 right-1/4 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-500/5" />
                <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-slate-400/10 blur-3xl dark:bg-slate-600/5" />
            </div>

            <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white"
                >
                    Pour tous, des entrepreneurs
                    <br />
                    <span className="bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                        aux grandes entreprises
                    </span>
                </motion.h2>

                <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {pourTousCards.map((card, idx) => {
                        const Icon = card.icon;

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{
                                    duration: 0.5,
                                    delay: idx * 0.1,
                                    ease: 'easeOut',
                                }}
                                className="group relative cursor-default rounded-3xl border border-white/50 bg-white/50 p-8 shadow-xl shadow-slate-200/40 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/5 dark:border-slate-700/40 dark:bg-slate-800/40 dark:shadow-slate-900/30"
                            >
                                <div className="mb-5 inline-flex rounded-2xl bg-emerald-100/80 p-3 text-emerald-700 shadow-inner dark:bg-emerald-900/50 dark:text-emerald-300">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                                    {card.title}
                                </h3>
                                <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
                                    {card.desc.split('**').map((part, i) =>
                                        i % 2 === 1 ? (
                                            <strong
                                                key={i}
                                                className="font-semibold text-emerald-700 dark:text-emerald-400"
                                            >
                                                {part}
                                            </strong>
                                        ) : (
                                            part
                                        ),
                                    )}
                                </p>
                                <div className="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-br from-emerald-500/0 to-slate-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-5 dark:group-hover:opacity-10" />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// ----------------------------------------------------------------------
// Section « Créez rapidement »
// ----------------------------------------------------------------------
const steps = [
    { step: '01', title: 'Ajoutez votre premier produit' },
    { step: '02', title: 'Personnalisez votre boutique' },
    { step: '03', title: 'Configurez les paiements' },
];

export function CreerRapidementSection() {
    return (
        <section className="relative overflow-hidden bg-linear-to-b from-slate-50 to-white py-24 dark:from-slate-900 dark:to-slate-950">
            <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white"
                >
                    Créez rapidement sur Yetu
                </motion.h2>

                <div className="mt-14 grid gap-6 sm:grid-cols-3">
                    {steps.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{
                                duration: 0.5,
                                delay: idx * 0.1,
                                ease: 'easeOut',
                            }}
                            className="group relative rounded-3xl border border-white/40 bg-white/50 p-8 backdrop-blur-lg transition-all hover:shadow-xl hover:shadow-emerald-500/5 dark:border-slate-700/30 dark:bg-slate-800/30"
                        >
                            <span className="text-6xl font-black text-emerald-600/20 dark:text-emerald-400/20">
                                {item.step}
                            </span>
                            <h3 className="mt-2 text-xl font-bold text-slate-800 dark:text-white">
                                {item.title}
                            </h3>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-12"
                >
                    <Button
                        size="lg"
                        asChild
                        className="rounded-full bg-emerald-600 px-10 py-6 text-lg font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700"
                    >
                        <Link href={route('vendor.register')}>
                            Essayez maintenant
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}

// ----------------------------------------------------------------------
// Section CTA Finale
// ----------------------------------------------------------------------
export function CtaFinalSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 70%',
                    toggleActions: 'play none none none',
                },
            });

            tl.from(cardRef.current, {
                y: 40,
                opacity: 0,
                scale: 0.95,
                duration: 0.6,
                ease: 'power3.out',
            })
                .from(
                    textRef.current,
                    { y: 20, opacity: 0, duration: 0.4, ease: 'power2.out' },
                    '-=0.2',
                )
                .from(
                    buttonRef.current,
                    {
                        y: 20,
                        opacity: 0,
                        scale: 0.9,
                        duration: 0.4,
                        ease: 'back.out(1.4)',
                    },
                    '-=0.1',
                );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-linear-to-b from-emerald-50/70 via-white to-slate-50/70 py-24 dark:from-slate-950 dark:via-emerald-950/10 dark:to-slate-950"
        >
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-500/50 to-transparent" />
            <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                <div
                    ref={cardRef}
                    className="rounded-3xl border border-white/40 bg-white/50 p-10 shadow-2xl shadow-emerald-500/5 backdrop-blur-2xl sm:p-14 dark:border-slate-700/30 dark:bg-slate-800/30 dark:shadow-emerald-500/5"
                >
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                        Prêt à vous lancer ?
                    </h2>
                    <p
                        ref={textRef}
                        className="mx-auto mt-4 max-w-xl text-lg text-slate-600 dark:text-slate-300"
                    >
                        Créez votre boutique gratuitement et commencez à vendre.
                    </p>
                    <div ref={buttonRef} className="mt-10">
                        <Button
                            size="lg"
                            asChild
                            className="rounded-full bg-emerald-600 px-10 py-6 text-lg font-semibold text-white shadow-xl shadow-emerald-500/20 hover:bg-emerald-700"
                        >
                            <Link href={route('vendor.register')}>
                                Démarrer gratuitement{' '}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ----------------------------------------------------------------------
// Composant FadeInSection (utilitaire)
// ----------------------------------------------------------------------
function FadeInSection({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// ----------------------------------------------------------------------
// Page principale
// ----------------------------------------------------------------------
export default function SaaSLanding({ plans, stats, testimonials }: Props) {
    return (
        <MainLayout>
            <Head title="Yetu – Créez votre boutique en ligne" />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-linear-to-br from-emerald-50 via-white to-slate-50 py-12 lg:py-20 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 right-0 h-125 w-125 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-400/5" />
                    <div className="absolute bottom-0 left-0 h-100 w-100 rounded-full bg-slate-400/10 blur-3xl dark:bg-slate-500/5" />
                </div>
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                            >
                                <Sparkles className="h-4 w-4" />
                                IA intégrée • Multi‑vendeurs • Paiements
                                sécurisés
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.8 }}
                                className="mt-8 text-4xl font-medium tracking-tight text-slate-900 sm:text-6xl lg:text-6xl dark:text-white"
                            >
                                Lancez votre
                                <span className="block bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                                    boutique e‑commerce
                                </span>
                                en quelques minutes.
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.8 }}
                                className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl dark:text-slate-300"
                            >
                                Créez une boutique professionnelle avec
                                paiements, livraison, analytics, automatisation
                                marketing et intelligence artificielle.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="mt-10 flex flex-col gap-4 sm:flex-row"
                            >
                                <AnimatedCtaButton
                                    href={route('vendor.register')}
                                >
                                    Commencer gratuitement
                                </AnimatedCtaButton>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    asChild
                                    className="rounded-full border-slate-300 bg-white/80 px-8 py-6 text-lg font-semibold text-slate-700 backdrop-blur hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-900"
                                >
                                    <a href="#demo">
                                        Voir la démo{' '}
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </a>
                                </Button>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400"
                            >
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-emerald-500" />{' '}
                                    SSL sécurisé
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-500" />{' '}
                                    Essai gratuit
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-emerald-500" />{' '}
                                    Disponible dans 175+ pays
                                </div>
                            </motion.div>
                        </div>

                        <HeroImageGridPremium />
                    </div>
                </div>
            </section>

            {/* Vendez partout */}
            <section className="py-20 lg:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        <div>
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                Vendez partout où vos clients font leurs achats
                            </h2>
                            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                                En ligne, en personne, sur les réseaux sociaux,
                                à l'international. Yetu vous connecte à des
                                millions d'acheteurs.
                            </p>
                            <ul className="mt-8 space-y-4">
                                {[
                                    'Boutique en ligne',
                                    'Points de vente physiques',
                                    'Réseaux sociaux',
                                    'Marketplaces',
                                ].map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-center gap-3 text-slate-700 dark:text-slate-200"
                                    >
                                        <CheckCircle className="h-5 w-5 text-emerald-500" />{' '}
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* <div className="rounded-3xl border border-white/40 bg-white/40 p-6 shadow-xl shadow-slate-200/30 backdrop-blur-xl dark:border-slate-700/30 dark:bg-slate-800/30 dark:shadow-slate-900/30"> */}
                            {/* <img
                                src="/storage/images/shopping-basket.jpg"
                                alt="Shopping"
                                className="w-full rounded-2xl object-cover shadow-md"

                            /> */}
                        {/* </div> */}
                            <CobePremiumGSAP />
                    </div>
                </div>
            </section>

            {/* Pour Tous */}
            <PourTousSection />

            {/* Créez rapidement */}
            <CreerRapidementSection />

            {/* Fiabilité & Paiement */}
            <section className="py-20 lg:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        <div>
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                Très rapide et vraiment fiable
                            </h2>
                            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                                Le processus de paiement offrant le meilleur
                                taux de conversion au monde.
                            </p>
                            <div className="mt-10 space-y-6">
                                <div className="flex items-start gap-4">
                                    <TrendingUp className="mt-1 h-6 w-6 text-emerald-500" />
                                    <div>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                            +15 %
                                        </p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Taux de conversion plus élevé
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Globe className="mt-1 h-6 w-6 text-emerald-500" />
                                    <div>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                            250 M+
                                        </p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Acheteurs à forte intention
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-3xl border border-white/40 bg-white/50 p-8 shadow-2xl shadow-emerald-500/5 backdrop-blur-xl dark:border-slate-700/30 dark:bg-slate-800/30 dark:shadow-emerald-500/5">
                            <p className="text-sm font-semibold text-slate-500">
                                Simulation de checkout
                            </p>
                            <div className="mt-4 space-y-3">
                                <input
                                    disabled
                                    value="jordan.chen@domain.com"
                                    className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        disabled
                                        value="$125.00"
                                        className="rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                    />
                                    <input
                                        disabled
                                        value="Free"
                                        className="rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                    />
                                </div>
                                <input
                                    disabled
                                    value="$10.00 taxes"
                                    className="rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stabilité & Performance */}
            <section className="bg-linear-to-b from-white to-slate-50 py-20 lg:py-28 dark:from-slate-950 dark:to-slate-900">
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                        Une stabilité à toute épreuve
                    </h2>
                    <div className="mt-12 flex flex-wrap justify-center gap-8">
                        <div className="flex items-center gap-4">
                            <Globe className="h-8 w-8 text-emerald-500" />
                            <div className="text-left">
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                    175
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Pays desservis
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Shield className="h-8 w-8 text-emerald-500" />
                            <div className="text-left">
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                                    99.99%
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Disponibilité
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Finale */}
            <CtaFinalSection />

            <IntegrationProduct />
        </MainLayout>
    );
}
