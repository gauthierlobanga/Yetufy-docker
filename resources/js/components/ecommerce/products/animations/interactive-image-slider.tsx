'use client';

import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useRef } from 'react';

const InteractiveImageSlider = ({ items }: { items: string[] }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const prevMouseX = useRef<number>(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) {
            return;
        }

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const percentage = x / width;

        const mouseDirection = e.clientX - prevMouseX.current;
        prevMouseX.current = e.clientX;

        if (mouseDirection !== 0) {
            setDirection(mouseDirection);
        }

        if (percentage < 0.33) {
            setActiveIndex(0);
        } else if (percentage < 0.66) {
            setActiveIndex(1);
        } else {
            setActiveIndex(2);
        }
    };

    const getVariants = (index: number) => {
        const isActive = index === activeIndex;
        const offset = (index - activeIndex) * 100;

        return {
            initial: {
                x: direction > 0 ? '100%' : '-100%',
                opacity: 0,
                rotateY: direction > 0 ? 45 : -45,
            },
            animate: {
                x: isActive ? '0%' : `${offset}%`,
                opacity: isActive ? 1 : 0.3,
                rotateY: 0,
                zIndex: isActive ? 3 : index < activeIndex ? 1 : 2,
            },
            exit: {
                x: direction > 0 ? '-100%' : '100%',
                opacity: 0,
                rotateY: direction > 0 ? -45 : 45,
            },
        };
    };

    return (
        <div className="flex h-[80vh] items-center justify-between">
            <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                className="relative aspect-square w-80 overflow-hidden"
                style={{ perspective: '1000px' }}
            >
                <AnimatePresence mode="sync">
                    {items.map((image, index) => (
                        <motion.div
                            key={index}
                            variants={getVariants(index)}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{
                                type: 'spring',
                                stiffness: 500,
                                damping: 50,
                                opacity: { duration: 0.3 },
                            }}
                            className="absolute inset-0 flex aspect-square w-80 items-center justify-center"
                            style={{
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            <img
                                src={image}
                                alt={`Product ${index + 1}`}
                                className="h-full w-full object-cover"
                                style={{
                                    filter:
                                        activeIndex === index
                                            ? 'brightness(1)'
                                            : 'brightness(0.6)',
                                }}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>

                <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 transform gap-1">
                    {items.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1 rounded-full transition-all duration-300 ${
                                index === activeIndex
                                    ? 'w-4 bg-white'
                                    : 'w-1 bg-white/40'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const images = [
    '/images/gold-zipper.jpg',
    '/images/gold-zipper.jpg',
    '/images/gold-zipper.jpg',
];

export default function InteractiveImageSliderPage() {
    return <InteractiveImageSlider items={images} />;
}
