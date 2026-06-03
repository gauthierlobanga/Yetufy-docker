/* eslint-disable react-hooks/set-state-in-effect */
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

// --- Nouveau composant AppearanceToogle ---
export default function AppearanceToogle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Initialisation : localStorage ou préférence système
        const stored = localStorage.getItem('theme');

        if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggle = () => {
        setIsDark(prev => {
            const next = !prev;

            if (next) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }

            return next;
        });
    };

    return (
        <motion.button
            onClick={toggle}
            className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            whileTap={{ scale: 0.9 }}
            aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
        >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </motion.button>
    );
}
