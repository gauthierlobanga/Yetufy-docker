'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface MarqueeEffectProps {
    children: React.ReactNode;
    gap?: number;
    direction?: 'horizontal' | 'vertical';
    speed?: number;
    speedOnHover?: number;
    reverse?: boolean;
    pauseOnHover?: boolean;
    className?: string;
}

export function MarqueeEffect({
    children,
    gap = 8,
    direction = 'horizontal',
    speed = 100,
    speedOnHover,
    reverse = false,
    pauseOnHover = true,
    className,
}: MarqueeEffectProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollerRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [contentSize, setContentSize] = useState(0);

    // Dupliquer le contenu pour l'effet infini
    useEffect(() => {
        if (!scrollerRef.current) {
            return;
        }

        const scrollerContent = Array.from(scrollerRef.current.children);

        // Vider le conteneur et re-créer avec doublons
        while (scrollerRef.current.firstChild) {
            scrollerRef.current.removeChild(scrollerRef.current.firstChild);
        }

        // Ajouter le contenu original plusieurs fois pour un défilement fluide
        const createContent = () => {
            // On duplique 2 fois pour avoir 3 jeux de données (original + 2 copies)
            for (let i = 0; i < 3; i++) {
                scrollerContent.forEach((item) => {
                    const clonedItem = item.cloneNode(true);
                    scrollerRef.current?.appendChild(clonedItem);
                });
            }
        };

        createContent();

        // Calculer la taille du contenu pour l'animation (taille d'un seul jeu)
        if (direction === 'horizontal') {
            setContentSize(scrollerRef.current.scrollWidth / 3);
        } else {
            setContentSize(scrollerRef.current.scrollHeight / 3);
        }
    }, [children, direction]);

    // Calculer la durée de l'animation basée sur la taille du contenu
    useEffect(() => {
        if (!scrollerRef.current || contentSize === 0) {
            return;
        }

        // Ajuster la vitesse : plus speed est grand, plus l'animation est rapide
        const duration = contentSize / (speed * 10);
        scrollerRef.current.style.setProperty(
            '--marquee-duration',
            `${duration}s`,
        );
    }, [contentSize, speed]);

    // Gérer les événements de survol
    const handleMouseEnter = () => {
        if (pauseOnHover || speedOnHover !== undefined) {
            setIsPaused(true);
        }
    };

    const handleMouseLeave = () => {
        setIsPaused(false);
    };

    // Déterminer la direction de l'animation
    const getAnimationClass = () => {
        if (direction === 'horizontal') {
            return reverse
                ? 'animate-marquee-horizontal-reverse'
                : 'animate-marquee-horizontal';
        } else {
            return reverse
                ? 'animate-marquee-vertical-reverse'
                : 'animate-marquee-vertical';
        }
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                'marquee-container relative overflow-hidden',
                direction === 'vertical' ? 'h-full' : 'w-full',
                className,
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                ref={scrollerRef}
                className={cn(
                    'marquee-scroller flex',
                    direction === 'horizontal' ? 'flex-row' : 'flex-col',
                    getAnimationClass(),
                )}
                style={{
                    gap: `${gap}px`,
                    animationPlayState: isPaused ? 'paused' : 'running',
                    animationDuration: `var(--marquee-duration, ${speed}s)`,
                }}
            >
                {children}
            </div>

            <style>{`
                @keyframes marquee-horizontal {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-33.333%);
                    }
                }

                @keyframes marquee-horizontal-reverse {
                    0% {
                        transform: translateX(-33.333%);
                    }
                    100% {
                        transform: translateX(0);
                    }
                }

                @keyframes marquee-vertical {
                    0% {
                        transform: translateY(0);
                    }
                    100% {
                        transform: translateY(-33.333%);
                    }
                }

                @keyframes marquee-vertical-reverse {
                    0% {
                        transform: translateY(-33.333%);
                    }
                    100% {
                        transform: translateY(0);
                    }
                }

                .animate-marquee-horizontal {
                    animation: marquee-horizontal var(--marquee-duration, 30s)
                        linear infinite;
                }

                .animate-marquee-horizontal-reverse {
                    animation: marquee-horizontal-reverse
                        var(--marquee-duration, 30s) linear infinite;
                }

                .animate-marquee-vertical {
                    animation: marquee-vertical var(--marquee-duration, 30s)
                        linear infinite;
                }

                .animate-marquee-vertical-reverse {
                    animation: marquee-vertical-reverse
                        var(--marquee-duration, 30s) linear infinite;
                }

                .marquee-container {
                    mask-image: ${
                        direction === 'horizontal'
                            ? 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
                            : 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
                    };
                }
            `}</style>
        </div>
    );
}
