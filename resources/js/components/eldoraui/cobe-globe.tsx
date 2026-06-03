'use client';

import { useGSAP } from '@gsap/react';
import createGlobe from 'cobe';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export default function CobePremiumGSAP({ className }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    // 🎬 GSAP animations (scoped clean)
    useGSAP(
        () => {
            const tl = gsap.timeline();

            tl.from(containerRef.current, {
                scale: 0.9,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
            });

            // glow breathing animation
            gsap.to(glowRef.current, {
                scale: 1.15,
                opacity: 0.5,
                duration: 2.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });
        },
        { scope: containerRef },
    );

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }

        let phi = 0;
        let width = canvasRef.current.offsetWidth;

        // ✅ ResizeObserver (pro)
        const observer = new ResizeObserver(([entry]) => {
            width = entry.contentRect.width;
        });

        observer.observe(canvasRef.current);

        const isDark = document.documentElement.classList.contains('dark');

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: Math.min(window.devicePixelRatio, 2),

            width: width * 2,
            height: width * 2,

            phi: 0,
            theta: 0.3,

            dark: isDark ? 1.2 : 0.6,
            diffuse: 1.8,

            mapSamples: 18000,
            mapBrightness: isDark ? 1.2 : 2,
            mapBaseBrightness: 0.05,

            baseColor: isDark
                ? [0.02, 0.03, 0.05] // deeper slate
                : [0.92, 0.97, 0.94], // soft emerald tint

            markerColor: [0.16, 0.85, 0.55],
            glowColor: isDark ? [0.2, 0.8, 0.6] : [0.3, 1, 0.7],

            markers: [
                { location: [-4.325, 15.322], size: 0.065 }, // Kinshasa
                { location: [48.8566, 2.3522], size: 0.05 },
                { location: [40.7128, -74.006], size: 0.05 },
                { location: [35.6895, 139.6917], size: 0.05 },
            ],

            onRender: (state) => {
                phi += 0.0035; // plus smooth
                state.phi = phi;

                state.width = width * 2;
                state.height = width * 2;
            },
        });

        // 🎬 fade in canvas (GSAP)
        gsap.to(canvasRef.current, {
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
        });

        return () => {
            globe.destroy();
            observer.disconnect();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={cn(
                'relative mx-auto aspect-square w-full max-w-150',
                className,
            )}
        >
            {/* Glow animé (scoped ref) */}
            <div
                ref={glowRef}
                className="absolute inset-0 rounded-full bg-emerald-400/30 opacity-30 blur-3xl dark:bg-emerald-500/20"
            />

            {/* Globe container */}
            <div className="relative rounded-full border border-white/10 bg-white/30 shadow-2xl backdrop-blur-xl transition-transform duration-500 hover:scale-[1.04] dark:border-white/5 dark:bg-slate-900/40">
                <canvas
                    ref={canvasRef}
                    className="h-full w-full cursor-grab rounded-full opacity-0 active:cursor-grabbing"
                />
            </div>

            {/* Depth overlay */}
            <div className="pointer-events-none absolute inset-0 rounded-full bg-linear-to-b from-transparent via-transparent to-black/30 dark:to-black/50" />
        </div>
    );
}
