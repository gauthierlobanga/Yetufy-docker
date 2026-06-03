'use client';

import { motion, useTransform } from 'motion/react';
import React from 'react';

interface CardProps {
    id: number;
    className?: string;
    progress: any;
    range: number[];
    targetScale: number;
    children?: React.ReactNode;
}

export default function ParallaxCardEffect({
    id,
    className,
    progress,
    range,
    targetScale,
    children,
}: CardProps) {
    const scale = useTransform(progress, range, [1, targetScale]);

    return (
        <div className="sticky top-0 flex h-screen items-center justify-center">
            <motion.div
                style={{
                    scale,
                    top: `calc(-5vh + ${id * 30}px)`,
                }}
                className={className}
            >
                {children}
            </motion.div>
        </div>
    );
}
