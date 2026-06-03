/* eslint-disable @typescript-eslint/no-unused-vars */
import { motion, useInView } from 'framer-motion';
import {
    Sun,
    Sparkles,
    ArrowRight,
    TrendingUp,
    Users,
    Coins,
} from 'lucide-react';
import { useRef } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function HeroSectionProduct() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 },
        },
    };

    const cardVariants = {
        hidden: { scale: 0.95, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { type: 'spring', stiffness: 150 },
        },
    };

    return (
        <section
            ref={ref}
            className="relative mx-auto w-full max-w-7xl overflow-hidden px-6 py-16 lg:py-24"
        >
            {/* Background glow */}
            <div className="absolute -top-40 left-1/2 h-125 w-125 -translate-x-1/2 rounded-full bg-primary/10 blur-[120px] dark:bg-primary/5" />

            <motion.div
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                variants={containerVariants}
                className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2"
            >
                {/* Left Content */}
                <div className="space-y-8">
                    <motion.div variants={itemVariants}>
                        <Badge
                            variant="outline"
                            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-primary/10 dark:border-primary/30 dark:bg-primary/10"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                            </span>
                            <Sparkles className="h-4 w-4" />
                            Version 2.0 disponible
                        </Badge>
                    </motion.div>

                    <div className="space-y-6">
                        <motion.h1
                            variants={itemVariants}
                            className="text-5xl font-bold tracking-tight lg:text-6xl xl:text-7xl"
                        >
                            <span className="bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                                Bienvenue dans
                            </span>
                            <br />
                            <span className="bg-linear-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                                l'oasis d'innovation
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="max-w-lg text-lg leading-relaxed text-muted-foreground"
                        >
                            Découvrez des idées révolutionnaires qui fleurissent
                            à chaque clic. Une expérience où le futur du
                            commerce rencontre l'élégance.
                        </motion.p>
                    </div>

                    <motion.div
                        variants={itemVariants}
                        className="flex flex-wrap gap-4"
                    >
                        <Button
                            size="lg"
                            className="group gap-2 rounded-full px-8 shadow-lg hover:shadow-xl"
                        >
                            Commencer
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="rounded-full border-2 px-8 backdrop-blur-sm"
                        >
                            Démo vidéo
                        </Button>
                    </motion.div>
                </div>

                {/* Right Content - Cards Grid */}
                <motion.div
                    variants={containerVariants}
                    className="grid grid-cols-2 gap-6"
                >
                    <div className="space-y-6">
                        <motion.div
                            variants={cardVariants}
                            whileHover={{ y: -5 }}
                            className="group"
                        >
                            <Card className="overflow-hidden rounded-3xl border-0 bg-linear-to-br from-slate-100 to-slate-50 shadow-lg dark:from-slate-900 dark:to-slate-950">
                                <img
                                    src="https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=800"
                                    alt="Mobile app"
                                    className="aspect-4/3 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </Card>
                        </motion.div>

                        <motion.div
                            variants={cardVariants}
                            whileHover={{ y: -5 }}
                        >
                            <Card className="rounded-3xl border-0 bg-linear-to-br from-primary/5 to-primary/10 p-6 shadow-lg backdrop-blur-sm dark:from-primary/10 dark:to-primary/5">
                                <div className="flex h-full flex-col justify-end">
                                    <div className="flex items-center gap-2 text-primary">
                                        <TrendingUp className="h-5 w-5" />
                                        <span className="text-sm font-medium">
                                            Croissance
                                        </span>
                                    </div>
                                    <div className="mt-2 text-4xl font-bold tracking-tight">
                                        +127%
                                    </div>
                                    <div className="mt-1 text-muted-foreground">
                                        de startups accompagnées
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </div>

                    <div className="space-y-6">
                        <motion.div
                            variants={cardVariants}
                            whileHover={{ y: -5 }}
                        >
                            <Card className="rounded-3xl border-0 bg-linear-to-br from-secondary/5 to-secondary/10 p-6 shadow-lg backdrop-blur-sm dark:from-secondary/10 dark:to-secondary/5">
                                <div className="flex items-center gap-2 text-secondary-foreground">
                                    <Coins className="h-5 w-5 text-secondary" />
                                    <span className="text-sm font-medium">
                                        Fonds levés
                                    </span>
                                </div>
                                <div className="mt-2 text-4xl font-bold tracking-tight">
                                    €14.8M
                                </div>
                                <div className="mt-1 text-muted-foreground">
                                    par nos partenaires
                                </div>
                            </Card>
                        </motion.div>

                        <motion.div
                            variants={cardVariants}
                            whileHover={{ y: -5 }}
                        >
                            <Card className="rounded-3xl border-0 bg-linear-to-br from-amber-50 to-orange-50 p-6 shadow-lg backdrop-blur-sm dark:from-amber-950/40 dark:to-orange-950/30">
                                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                                    <Users className="h-5 w-5" />
                                    <span className="text-sm font-medium">
                                        Communauté
                                    </span>
                                </div>
                                <div className="mt-2 text-4xl font-bold tracking-tight">
                                    80k+
                                </div>
                                <div className="mt-1 text-muted-foreground">
                                    membres actifs
                                </div>

                                <div className="mt-4 flex -space-x-2">
                                    {[
                                        '2379004',
                                        '1222271',
                                        '774909',
                                        '1516680',
                                    ].map((img, i) => (
                                        <Avatar
                                            key={i}
                                            className="h-10 w-10 border-2 border-background ring-2 ring-background/50"
                                        >
                                            <AvatarImage
                                                src={`https://images.pexels.com/photos/${img}/pexels-photo-${img}.jpeg?auto=compress&cs=tinysrgb&w=100&h=100`}
                                            />
                                            <AvatarFallback className="bg-primary/10 text-xs">
                                                U{i + 1}
                                            </AvatarFallback>
                                        </Avatar>
                                    ))}
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-primary/10 text-xs font-medium ring-2 ring-background/50">
                                        +12k
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
