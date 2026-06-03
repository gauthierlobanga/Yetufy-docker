// import { Link } from '@inertiajs/react';
// import type { PropsWithChildren } from 'react';
// import AppLogoIcon from '@/components/app-logo-icon';
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle,
// } from '@/components/ui/card';
// import { home } from '@/routes';

// export default function AuthCardLayout({
//     children,
//     title,
//     description,
// }: PropsWithChildren<{
//     name?: string;
//     title?: string;
//     description?: string;
// }>) {
//     return (
//         <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
//             <div className="flex w-full max-w-md flex-col gap-6">
//                 <Link
//                     href={home()}
//                     className="flex items-center gap-2 self-center font-medium"
//                 >
//                     <div className="flex h-9 w-9 items-center justify-center">
//                         <AppLogoIcon className="size-9 fill-current text-black dark:text-white" />
//                     </div>
//                 </Link>

//                 <div className="flex flex-col gap-6">
//                     <Card className="rounded-xl">
//                         <CardHeader className="px-10 pt-8 pb-0 text-center">
//                             <CardTitle className="text-xl">{title}</CardTitle>
//                             <CardDescription>{description}</CardDescription>
//                         </CardHeader>
//                         <CardContent className="px-10 py-8">
//                             {children}
//                         </CardContent>
//                     </Card>
//                 </div>
//             </div>
//         </div>
//     );
// }

// ============================================================================
// 1. AuthCardLayout.tsx
// Layout "Card" premium avec glassmorphism subtil, emerald + slate.
// ============================================================================

import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import type { PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-6 py-10 md:px-10">
            {/* Background décoratif */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/2 h-112 w-md -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/8" />
                <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-slate-500/10 blur-3xl dark:bg-slate-400/5" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.06),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.05),transparent_45%)]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div className="mb-8 flex justify-center">
                    <Link
                        href={home()}
                        className="group flex flex-col items-center gap-4"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 rounded-3xl bg-emerald-500/20 blur-xl transition-all duration-300 group-hover:bg-emerald-500/30" />
                            <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl border border-white/60 bg-white/90 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/20">
                                <AppLogoIcon className="size-9 fill-current text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Card */}
                <Card className="overflow-hidden rounded-3xl border border-white/70 bg-white/85 shadow-2xl shadow-slate-900/8 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/85 dark:shadow-black/30">
                    {/* Accent top line */}
                    <div className="h-1 w-full bg-linear-to-r from-emerald-500 via-emerald-400 to-teal-400" />

                    <CardHeader className="px-8 pt-8 pb-0 text-center sm:px-10">
                        <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                            {title}
                        </CardTitle>

                        {description && (
                            <CardDescription className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                                {description}
                            </CardDescription>
                        )}
                    </CardHeader>

                    <CardContent className="px-8 py-8 sm:px-10">
                        {children}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
