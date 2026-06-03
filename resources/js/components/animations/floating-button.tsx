'use client';

import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import React from 'react';
import { useOnClickOutside } from 'usehooks-ts';

type FloatingButtonProps = {
    className?: string;
    children: ReactNode;
    triggerContent: ReactNode;
};

type FloatingButtonItemProps = {
    children: ReactNode;
};

const list = {
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            staggerDirection: -1,
        },
    },
    hidden: {
        opacity: 0,
        transition: {
            when: 'afterChildren',
            staggerChildren: 0.1,
        },
    },
};

const item = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 5 },
};

const btn = {
    visible: { rotate: '45deg' },
    hidden: { rotate: 0 },
};

function FloatingButton({ children, triggerContent }: FloatingButtonProps) {
    const ref = React.useRef<HTMLDivElement | null>(null);
    const [isOpen, setIsOpen] = React.useState(false);

    useOnClickOutside(ref as React.RefObject<HTMLDivElement>, () =>
        setIsOpen(false),
    );

    return (
        <div className="relative flex flex-col items-center">
            <AnimatePresence>
                <motion.ul
                    key="list"
                    className="absolute bottom-14 flex flex-col items-center gap-2"
                    initial="hidden"
                    animate={isOpen ? 'visible' : 'hidden'}
                    variants={list}
                >
                    {children}
                </motion.ul>
                <motion.div
                    key="button"
                    variants={btn}
                    animate={isOpen ? 'visible' : 'hidden'}
                    ref={ref}
                    onClick={() => setIsOpen(!isOpen)}
                    className="cursor-pointer"
                >
                    {triggerContent}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function FloatingButtonItem({ children }: FloatingButtonItemProps) {
    return <motion.li variants={item}>{children}</motion.li>;
}

export { FloatingButton, FloatingButtonItem };
