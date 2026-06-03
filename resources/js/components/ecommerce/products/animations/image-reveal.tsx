'use client';

import { ChevronRightIcon } from 'lucide-react';
import { motion, useSpring } from 'motion/react';
import type { MouseEvent } from 'react';
import React, { useState, useRef } from 'react';

interface ImageItem {
    img: string;
    label: string;
}

function ImageReveal({ list }: { list: ImageItem[] }) {
    const [img, setImg] = useState<{
        src: string;
        alt: string;
        opacity: number;
    }>({
        src: '',
        alt: '',
        opacity: 0,
    });

    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const spring = {
        stiffness: 150,
        damping: 15,
        mass: 0.1,
    };

    const imagePos = {
        x: useSpring(0, spring),
        y: useSpring(0, spring),
    };

    const handleMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current || !containerRef.current) {
            return;
        }

        const containerRect = containerRef.current.getBoundingClientRect();
        const { clientX, clientY } = e;
        const relativeX = clientX - containerRect.left;
        const relativeY = clientY - containerRect.top;

        imagePos.x.set(relativeX - imageRef.current.offsetWidth / 2);
        imagePos.y.set(relativeY - imageRef.current.offsetHeight / 2);
    };

    const handleImageInteraction = (item: ImageItem, opacity: number) => {
        setImg({ src: item.img, alt: item.label, opacity });
    };

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMove}
            className="relative w-full p-4"
        >
            {list.map((item) => (
                <div
                    key={item.label}
                    onMouseEnter={() => handleImageInteraction(item, 1)}
                    onMouseMove={() => handleImageInteraction(item, 1)}
                    onMouseLeave={() => handleImageInteraction(item, 0)}
                    className="flex w-full cursor-pointer justify-between border-b py-6 transition-opacity hover:opacity-40"
                >
                    <p className="text-2xl lg:text-3xl">{item.label}</p>
                    <ChevronRightIcon className="opacity-25" />
                </div>
            ))}

            <motion.img
                key={img.src}
                ref={imageRef}
                src={img.src}
                alt={img.alt}
                initial={{ opacity: 0 }}
                animate={{ opacity: img.opacity }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute top-0 left-0 aspect-square w-60 object-cover shadow-lg transition-opacity duration-200 ease-in-out"
                style={{
                    x: imagePos.x,
                    y: imagePos.y,
                    opacity: img.opacity,
                }}
            />
        </section>
    );
}

const list = [
    {
        img: 'https://images.unsplash.com/photo-1517408395525-fa05dd0bb2ef?q=80&w=2944&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        label: 'Retro Style',
    },
    {
        img: 'https://images.unsplash.com/photo-1501829385782-9841539fa6bf?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        label: 'Classic car',
    },
    {
        img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        label: 'Computer',
    },
    {
        img: 'https://plus.unsplash.com/premium_photo-1682123999644-1ff465694dde?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        label: 'Game Console',
    },
];

export default function ImageRevealExample() {
    return <ImageReveal list={list} />;
}
