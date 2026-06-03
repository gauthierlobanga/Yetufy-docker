// ============================================================================
// 2. AuthSimpleLayout.tsx
// Layout minimal premium, centré, très épuré.
// ============================================================================

import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-6 py-10 md:px-10">
            {/* Background décoratif */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute top-16 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/6" />
                <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-slate-400/10 blur-3xl dark:bg-slate-600/5" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <div className="flex flex-col gap-8">
                    {/* Logo */}
                    <div className="flex flex-col items-center gap-5">
                        <Link
                            href={home()}
                            className="group flex flex-col items-center gap-3"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 rounded-3xl bg-emerald-500/20 blur-xl transition-all group-hover:bg-emerald-500/30" />
                                <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl border border-border/60 bg-background/80 shadow-xl backdrop-blur-xl">
                                    <AppLogoIcon className="size-9 fill-current text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                {title}
                            </h1>
                            {description && (
                                <p className="mx-auto max-w-sm text-sm leading-6 text-muted-foreground">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Form content */}
                    <div className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:p-8 dark:shadow-black/20">
                        {children}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
