/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/Pages/About.tsx
import { Head, Link, usePage } from '@inertiajs/react';
import { motion, useInView } from 'framer-motion';
import {
    BookOpenIcon,
    Mail,
    Phone,
    ArrowRight,
    Sparkles,
    ShieldCheck,
    Truck,
    Globe,
    Award,
    Users,
    Package,
    ChevronRight,
    Star,
    Quote,
    Play,
    CheckCircle2,
    Zap,
    Heart,
    Clock,
} from 'lucide-react';
import { useRef } from 'react';
import InteractiveImageSliderPage from '@/components/animations/interactive-image-slider-page';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import MainLayout from '@/layouts/main-layout';
import { cn } from '@/lib/utils';
import BentoGrids from '@/pages/Shop/Products/bento-grids-01';
import type { PageProps } from '@/types/ecommerce/products';

export default function About() {
    const { props } = usePage<PageProps>();

    // Mapping des icônes (à compléter selon vos besoins)
    const iconMap: Record<
        string,
        React.ComponentType<{ className?: string }>
    > = {
        ShieldCheck,
        Zap,
        Heart,
    };

    const { platformStats } = props;

    const statsRef = useRef(null);
    const statsInView = useInView(statsRef, { once: true, margin: '-100px' });

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    return (
        <MainLayout>
            <Head title="À propos de Yetu" />

            {/* HERO SECTION – IMMERSIVE */}
            <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
                {/* Background décoratif */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5" />
                    <div className="absolute -top-40 -left-40 h-150 w-150 rounded-full bg-primary/10 blur-[120px]" />
                    <div className="absolute -right-40 -bottom-40 h-150 w-150 rounded-full bg-secondary/10 blur-[120px]" />
                    <div className="absolute inset-0 bg-[url('/storage/images/working-at-night.jpg')] opacity-[0.02]" />
                </div>

                <div className="relative mx-auto max-w-6xl px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge className="mb-6 gap-1.5 border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                            <Sparkles className="h-3.5 w-3.5" />
                            Notre histoire
                        </Badge>

                        <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                            Redéfinir l'expérience
                            <span className="mt-2 block bg-linear-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                                du shopping en ligne
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                            shop est né d'une vision simple : créer une
                            plateforme où qualité, confiance et innovation se
                            rencontrent pour offrir une expérience d'achat
                            exceptionnelle.
                        </p>

                        <div className="mt-10 flex flex-wrap justify-center gap-4">
                            <Button
                                size="lg"
                                className="gap-2 shadow-lg"
                                asChild
                            >
                                <Link href={route('tenant.product.index')}>
                                    Découvrir nos produits
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="gap-2"
                                asChild
                            >
                                <Link href="#story">
                                    Notre histoire
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* STATISTIQUES CLÉS – ANIMÉES */}
            {/* <section
                ref={statsRef}
                className="border-y border-border/40 bg-muted/20 py-16"
            >
                <div className="mx-auto max-w-6xl px-4">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate={statsInView ? 'visible' : 'hidden'}
                        className="grid grid-cols-2 gap-8 md:grid-cols-4"
                    >
                        {[
                            {
                                value: '15k+',
                                label: 'Produits disponibles',
                                icon: Package,
                            },
                            {
                                value: '98%',
                                label: 'Clients satisfaits',
                                icon: Star,
                            },
                            { value: '45+', label: 'Pays livrés', icon: Globe },
                            {
                                value: '24/7',
                                label: 'Support client',
                                icon: Clock,
                            },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                className="text-center"
                            >
                                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <stat.icon className="h-7 w-7" />
                                </div>
                                <div className="font-heading text-4xl font-bold tracking-tight">
                                    {stat.value}
                                </div>
                                <div className="mt-1 text-sm text-muted-foreground">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section> */}
            {/* STATISTIQUES CLÉS – DYNAMIQUES */}
            <section
                ref={statsRef}
                className="border-y border-border/40 bg-muted/20 py-16"
            >
                <div className="mx-auto max-w-6xl px-4">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate={statsInView ? 'visible' : 'hidden'}
                        className="grid grid-cols-2 gap-8 md:grid-cols-4"
                    >
                        {[
                            {
                                value: platformStats?.productsCount ?? 0,
                                label: 'Produits disponibles',
                                icon: Package,
                            },
                            {
                                value: `${platformStats?.ordersProcessed ?? 0}+`,
                                label: 'Commandes traitées',
                                icon: Star,
                            },
                            {
                                value: `${platformStats?.countriesServed ?? 0}`,
                                label: 'Pays livrés',
                                icon: Globe,
                            },
                            {
                                value: '24/7',
                                label: 'Support client',
                                icon: Clock,
                            },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                className="text-center"
                            >
                                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <stat.icon className="h-7 w-7" />
                                </div>
                                <div className="font-heading text-4xl font-bold tracking-tight">
                                    {stat.value}
                                </div>
                                <div className="mt-1 text-sm text-muted-foreground">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* NOTRE HISTOIRE */}
            <section id="story" className="py-20 lg:py-28">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            <Badge variant="outline" className="gap-1">
                                <BookOpenIcon className="h-3.5 w-3.5" />
                                Depuis 2023
                            </Badge>
                            <h2 className="font-heading text-3xl font-bold md:text-4xl">
                                Une aventure née de la passion du e‑commerce
                            </h2>
                            <p className="text-muted-foreground">
                                Ce qui a commencé comme un petit projet est
                                rapidement devenu une plateforme de confiance
                                pour des milliers de clients. Notre mission est
                                simple : rendre le shopping en ligne plus
                                humain, plus sûr et plus inspirant.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    'Sélection rigoureuse des produits',
                                    'Partenariats avec des marques de confiance',
                                    'Logistique optimisée pour une livraison rapide',
                                    'Service client basé en France',
                                ].map((item, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center gap-3"
                                    >
                                        <CheckCircle2 className="h-5 w-5 text-primary" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="relative aspect-4/3 overflow-hidden rounded-3xl">
                                <img
                                    src="https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                    alt="Notre équipe"
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                            </div>
                            <div className="absolute -bottom-6 -left-6 rounded-2xl bg-background p-4 shadow-xl">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                                        <Award className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">
                                            Certifié Excellence
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Qualité garantie
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* NOS VALEURS */}
            {/* <section className="bg-muted/30 py-20">
                <div className="mx-auto max-w-6xl px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12 text-center"
                    >
                        <Badge className="mb-4">Nos valeurs</Badge>
                        <h2 className="font-heading text-3xl font-bold md:text-4xl">
                            Ce qui nous rend uniques
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                            Des principes forts qui guident chacune de nos
                            actions au quotidien.
                        </p>
                    </motion.div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {[
                            {
                                icon: ShieldCheck,
                                title: 'Confiance & Sécurité',
                                description:
                                    'Transactions 100% sécurisées et protection des données.',
                            },
                            {
                                icon: Zap,
                                title: 'Innovation permanente',
                                description:
                                    'Des technologies de pointe pour une expérience fluide.',
                            },
                            {
                                icon: Heart,
                                title: 'Satisfaction client',
                                description:
                                    'Votre bonheur est notre priorité absolue.',
                            },
                        ].map((value, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="h-full border-0 bg-background/60 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                                    <CardContent className="p-6">
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <value.icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="mb-2 text-lg font-semibold">
                                            {value.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {value.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section> */}

            {platformStats?.values?.map((value: any, i: number) => {
                const IconComponent = iconMap[value.icon] || ShieldCheck;

                return (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="h-full border-0 bg-background/60 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                            <CardContent className="p-6">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <IconComponent className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold">
                                    {value.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {value.description}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                );
            })}

            {/* TÉMOIGNAGES */}
            {/* <section className="py-20">
                <div className="mx-auto max-w-6xl px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12 text-center"
                    >
                        <Badge className="mb-4">Témoignages</Badge>
                        <h2 className="font-heading text-3xl font-bold md:text-4xl">
                            Ce que disent nos clients
                        </h2>
                    </motion.div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {[
                            {
                                text: 'Service impeccable et livraison ultra rapide. Les produits sont exactement comme décrits.',
                                author: 'Sophie M.',
                                role: 'Cliente fidèle',
                                avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
                            },
                            {
                                text: 'Une plateforme intuitive et un support client réactif. Je recommande vivement !',
                                author: 'Thomas L.',
                                role: 'Entrepreneur',
                                avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
                            },
                            {
                                text: 'Qualité des produits exceptionnelle. shop est devenu mon site de référence.',
                                author: 'Marie D.',
                                role: 'Designer',
                                avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
                            },
                        ].map((testimonial, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="h-full border-border/60 bg-card/60 backdrop-blur-sm">
                                    <CardContent className="p-6">
                                        <Quote className="mb-4 h-8 w-8 text-primary/40" />
                                        <p className="mb-6 text-sm italic">
                                            {testimonial.text}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage
                                                    src={testimonial.avatar}
                                                />
                                                <AvatarFallback>
                                                    {testimonial.author[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {testimonial.author}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {testimonial.role}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section> */}
            {platformStats?.testimonials?.map((testimonial: any, i: number) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                >
                    <Card className="h-full border-border/60 bg-card/60 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <Quote className="mb-4 h-8 w-8 text-primary/40" />
                            <p className="mb-6 text-sm italic">
                                {testimonial.quote}
                            </p>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    {/* Si vous aviez un champ avatar, utilisez‑le ici */}
                                    <AvatarFallback>
                                        {testimonial.name?.[0] ?? '?'}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">
                                        {testimonial.name}
                                    </p>
                                    {testimonial.role && (
                                        <p className="text-xs text-muted-foreground">
                                            {testimonial.role}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}

            {/* FAQ */}
            <Accordion type="single" collapsible className="w-full">
                {platformStats?.faqs?.map((faq: any, i: number) => (
                    <AccordionItem key={i} value={`item-${i}`}>
                        <AccordionTrigger className="text-left">
                            {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            {/* CTA FINAL */}
            <section className="relative overflow-hidden py-24">
                <div className="absolute inset-0 -z-10 bg-linear-to-r from-primary/10 to-secondary/10" />
                <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
                <div className="mx-auto max-w-3xl px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="font-heading text-3xl font-bold md:text-4xl">
                            Prêt à rejoindre l'aventure shop ?
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                            Découvrez dès maintenant notre sélection de produits
                            et profitez d'offres exclusives.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <Button
                                size="lg"
                                className="gap-2 shadow-lg"
                                asChild
                            >
                                <Link href={route('tenant.product.index')}>
                                    Explorer la boutique
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link href={route('tenant.page.contact')}>
                                    Nous contacter
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
            {/* Section BentoGrids */}
            <BentoGrids stats={platformStats} />
        </MainLayout>
    );
}
