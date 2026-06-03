'use client';

import { motion, useAnimation, useInView } from 'motion/react';
import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Marquee } from './marquee';

// ------------------------------------------
// 1. Images des produits
// ------------------------------------------
const productImages = [
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

// ------------------------------------------
// 2. Fonction de mélange
// ------------------------------------------
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

// ------------------------------------------
// 3. Carte produit modernisée
// ------------------------------------------
function Card({ src, alt }: { src: string; alt: string }) {
    const id = useId();
    const controls = useAnimation();
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (inView) {
            controls.start({
                opacity: 1,
                scale: 1,
                transition: {
                    delay: Math.random() * 1.5,
                    ease: 'easeOut',
                    duration: 0.8,
                },
            });
        }
    }, [controls, inView]);

    return (
        <motion.div
            key={id}
            ref={ref}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={controls}
            // Animation au survol très légère : scale 1.01, pas de rotation
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            className={cn(
                'group relative h-44 w-44 cursor-pointer overflow-hidden rounded-2xl border p-2 sm:h-52 sm:w-52 lg:h-56 lg:w-56',
                'border-white/40 bg-white/30 shadow-sm backdrop-blur-lg',
                'transition-shadow duration-500 hover:shadow-2xl hover:shadow-emerald-500/10',
                'dark:border-slate-700/40 dark:bg-slate-800/30 dark:hover:shadow-emerald-900/30',
                'transform-gpu',
            )}
        >
            {/* Image avec zoom réduit et plus lent */}
            <img
                src={src}
                alt={alt}
                className="h-full w-full rounded-xl object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                loading="lazy"
            />

            {/* Lueur subtile émeraude au survol */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-radial-[at_50%_50%] from-emerald-400/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-emerald-600/30" />
        </motion.div>
    );
}

// ------------------------------------------
// 4. Composant principal (inchangé)
// ------------------------------------------
export function IntegrationProduct() {
    const [randomTiles1] = useState(() => shuffleArray(productImages));
    const [randomTiles2] = useState(() => shuffleArray(productImages));

    return (
        <section
            id="cta"
            className="relative overflow-hidden bg-linear-to-b from-slate-100/60 to-emerald-50/60 py-20 dark:from-slate-900 dark:to-emerald-950/60"
        >
            {/* Formes d’arrière-plan */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-emerald-200/20 blur-3xl dark:bg-emerald-700/10" />
                <div className="absolute right-1/4 -bottom-20 h-96 w-96 rounded-full bg-slate-300/20 blur-3xl dark:bg-slate-600/10" />
            </div>

            <div className="container mx-auto px-4 md:px-8">
                <div className="flex w-full flex-col items-center justify-center">
                    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
                        <Marquee
                            reverse
                            className="-delay-[200ms] [--duration:15s]"
                            repeat={4}
                        >
                            {randomTiles1.map((item, idx) => (
                                <Card key={idx} src={item.src} alt={item.alt} />
                            ))}
                        </Marquee>
                        <Marquee
                            reverse
                            className="[--duration:20s]"
                            repeat={4}
                        >
                            {randomTiles2.map((item, idx) => (
                                <Card key={idx} src={item.src} alt={item.alt} />
                            ))}
                        </Marquee>
                        <Marquee
                            reverse
                            className="-delay-[200ms] [--duration:18s]"
                            repeat={4}
                        >
                            {randomTiles1.map((item, idx) => (
                                <Card key={idx} src={item.src} alt={item.alt} />
                            ))}
                        </Marquee>

                        {/* Dégradés de fondu sur les bords */}
                        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-linear-to-r from-slate-100/80 to-transparent dark:from-slate-900/80" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-linear-to-r from-transparent to-slate-100/80 dark:to-slate-900/80" />
                    </div>
                </div>
            </div>
        </section>
    );
}
