// resources/js/layouts/FooterSection.tsx
import { Link } from '@inertiajs/react';
import { motion, useInView } from 'framer-motion';
import {
    ChevronRight,
    CreditCard,
    Globe,
    RefreshCw,
    ShieldCheck,
    Truck,
    ArrowUpRight,
    Building2,
    HeartHandshake,
    Headphones,
} from 'lucide-react';
import { useRef } from 'react';

import {
    FaFacebook,
    FaInstagram,
    FaLinkedin,
    FaTwitter,
    FaYoutube,
} from 'react-icons/fa';
import AppLogo from '@/components/app-logo';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const socialLinks = [
    { name: 'Facebook', href: '#', icon: FaFacebook },
    { name: 'Instagram', href: '#', icon: FaInstagram },
    { name: 'X', href: '#', icon: FaTwitter },
    { name: 'LinkedIn', href: '#', icon: FaLinkedin },
    { name: 'YouTube', href: '#', icon: FaYoutube },
];

const guarantees = [
    {
        icon: ShieldCheck,
        title: 'Paiement sécurisé',
        desc: 'Transactions chiffrées SSL/TLS',
    },
    {
        icon: Truck,
        title: 'Livraison rapide',
        desc: 'Expédition fiable partout',
    },
    {
        icon: RefreshCw,
        title: 'Retours simplifiés',
        desc: '30 jours pour changer d’avis',
    },
    {
        icon: Headphones,
        title: 'Support réactif',
        desc: 'Assistance disponible 7j/7',
    },
];

const footerSections = [
    {
        title: 'Explorer',
        links: [
            { name: 'Produits', href: route('tenant.product.index') },
            {
                name: 'Promotions',
                href: route('tenant.promotions.index'),
                badge: 'Hot',
            },
            {
                name: 'Nouveautés',
                href: route('tenant.product.index', { sort: 'newest' }),
                badge: 'New',
            },
            {
                name: 'Meilleures ventes',
                href: route('tenant.product.index', { sort: 'bestseller' }),
            },
        ],
    },
    {
        title: 'Entreprise',
        links: [
            { name: 'À propos', href: route('tenant.page.about') },
            { name: 'Blog', href: route('tenant.blog.index') },
            { name: 'Devenir vendeur', href: route('vendor.register') },
        ],
    },
    {
        title: 'Support',
        links: [
            { name: 'Contact', href: route('tenant.page.contact') },
            { name: 'FAQ', href: route('tenant.page.faq') },
            { name: 'Suivi de commande', href: route('tenant.orders.index') },
            { name: 'Retours', href: route('tenant.return.index') },
        ],
    },
    {
        title: 'Légal',
        links: [
            { name: 'Conditions', href: route('tenant.page.terms') },
            { name: 'Confidentialité', href: route('tenant.page.privacy') },
            { name: 'Cookies', href: route('tenant.page.cookies') },
        ],
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06, delayChildren: 0.08 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
    },
};

export default function FooterSection() {
    const ref = useRef<HTMLElement | null>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });
    const currentYear = new Date().getFullYear();

    return (
        <footer
            ref={ref}
            className="relative w-full overflow-hidden border-t border-slate-200/70 bg-white dark:border-slate-800/70 dark:bg-slate-950"
        >
            {/* Background effects */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-400/8" />
                <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-slate-400/5 blur-3xl dark:bg-slate-200/5" />
            </div>

            {/* Guarantees – pleine largeur, contenu centré */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="mx-auto w-full max-w-7xl px-4 pt-10 pb-8 sm:px-6 lg:px-8"
            >
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {guarantees.map((item) => (
                        <motion.div
                            key={item.title}
                            variants={itemVariants}
                            whileHover={{ y: -2 }}
                            transition={{ duration: 0.2 }}
                            className={cn(
                                'group relative overflow-hidden rounded-3xl border p-4',
                                'border-slate-200/70 bg-white/80 backdrop-blur-xl',
                                'shadow-[0_10px_30px_-18px_rgba(15,23,42,0.18)]',
                                'transition-all duration-300',
                                'hover:border-emerald-200 hover:shadow-emerald-500/10',
                                'dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-emerald-800/50',
                            )}
                        >
                            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            <div className="flex items-start gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/10 dark:text-emerald-400">
                                    <item.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {item.title}
                                    </p>
                                    <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <Separator className="bg-slate-200/70 dark:bg-slate-800/70" />

            {/* Main Footer – pleine largeur, contenu centré */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
            >
                <div className="grid gap-12 lg:grid-cols-12">
                    {/* Brand */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-4"
                    >
                        <Link
                            href={route('home')}
                            className="inline-flex items-center"
                        >
                            <AppLogo />
                        </Link>
                        <p className="mt-5 max-w-sm text-sm leading-7 text-slate-600 dark:text-slate-400">
                            Une plateforme e-commerce moderne conçue pour offrir
                            une expérience d’achat rapide, sécurisée et
                            élégante.
                        </p>
                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/60">
                                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                    <Building2 className="h-4 w-4" />
                                </div>
                                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                                    Marketplace locale
                                </p>
                                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                                    Connectez vendeurs et acheteurs.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/60">
                                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                    <HeartHandshake className="h-4 w-4" />
                                </div>
                                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                                    Confiance & qualité
                                </p>
                                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                                    Satisfaction au cœur du service.
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 flex flex-wrap gap-2">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.name}
                                    href={social.href}
                                    aria-label={social.name}
                                    whileHover={{ y: -2, scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={cn(
                                        'flex h-10 w-10 items-center justify-center rounded-xl border',
                                        'border-slate-200/70 bg-white text-slate-500',
                                        'transition-all duration-300',
                                        'hover:border-emerald-200 hover:text-emerald-600',
                                        'dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400',
                                        'dark:hover:border-emerald-800 dark:hover:text-emerald-400',
                                    )}
                                >
                                    <social.icon className="h-4 w-4" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Links */}
                    <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
                        {footerSections.map((section) => (
                            <motion.div
                                key={section.title}
                                variants={itemVariants}
                            >
                                <h3 className="mb-4 text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400">
                                    {section.title}
                                </h3>
                                <ul className="space-y-3">
                                    {section.links.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="group inline-flex items-center gap-1.5 text-sm text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                                            >
                                                <ChevronRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                                                <span className="relative">
                                                    {link.name}
                                                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-emerald-500 transition-all duration-300 group-hover:w-full" />
                                                </span>
                                                {link.badge && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="ml-1 rounded-full px-1.5 py-0 text-[10px] font-semibold"
                                                    >
                                                        {link.badge}
                                                    </Badge>
                                                )}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            <Separator className="bg-slate-200/70 dark:bg-slate-800/70" />

            {/* Bottom Bar – pleine largeur */}
            <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between dark:text-slate-400">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="inline-flex items-center gap-2">
                            <Globe className="h-4 w-4 text-emerald-500" />{' '}
                            Français • CDF
                        </div>
                        <div className="inline-flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-emerald-500" />{' '}
                            Visa • Mastercard • PayPal
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <span>
                            © {currentYear} {import.meta.env.VITE_APP_NAME}.
                        </span>
                        <span className="hidden md:inline">•</span>
                        <span>Tous droits réservés.</span>
                    </div>
                    <Link
                        href="#top"
                        className="group inline-flex items-center gap-1 font-medium text-slate-600 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                    >
                        Retour en haut
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                </div>
            </div>
        </footer>
    );
}
