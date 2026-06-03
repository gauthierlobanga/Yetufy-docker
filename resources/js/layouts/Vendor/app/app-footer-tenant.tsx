// resources/js/layouts/FooterSection.tsx
import { Link } from '@inertiajs/react';
import { motion, useInView } from 'framer-motion';
import {
    ShieldCheckIcon,
    TruckIcon,
    CreditCardIcon,
    RefreshCwIcon,
    ChevronRight,
    Globe,
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

const Logo = () => (
    <Link
        href={route('home')}
        className="group flex items-center space-x-2 transition-opacity hover:opacity-80"
    >
        <AppLogo />
    </Link>
);

const socialLinks = [
    { name: 'Facebook', href: '#', icon: FaFacebook, color: '#1877f2' },
    { name: 'Instagram', href: '#', icon: FaInstagram, color: '#e4405f' },
    { name: 'Twitter', href: '#', icon: FaTwitter, color: '#1da1f2' },
    { name: 'LinkedIn', href: '#', icon: FaLinkedin, color: '#0a66c2' },
    { name: 'YouTube', href: '#', icon: FaYoutube, color: '#ff0000' },
];

const guarantees = [
    {
        icon: ShieldCheckIcon,
        title: 'Paiement sécurisé',
        desc: 'Transactions cryptées SSL',
    },
    { icon: TruckIcon, title: 'Livraison rapide', desc: 'Expédition 24h' },
    { icon: RefreshCwIcon, title: 'Retours faciles', desc: '30 jours' },
    { icon: CreditCardIcon, title: 'Paiement en 4x', desc: 'Sans frais' },
];

const footerSections = [
    {
        title: 'Explorer',
        links: [
            { name: 'Produits', href: route('tenant.product.index') },
            {
                name: 'Promotions',
                href: route('tenant.promotions.index'),
                badge: '',
            },
            {
                name: 'Nouveautés',
                href: route('tenant.product.index', { sort: 'newest' }),
                badge: '',
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
            { name: 'À propos', href: route('tenant.pages.about') },
            { name: 'Blog', href: route('tenant.blog.index') },
            { name: 'Carrières', href: route('tenant.home') },
            { name: 'Devenir vendeur', href: route('vendor.register') },
        ],
    },
    {
        title: 'Support',
        links: [
            { name: 'Contact', href: route('tenant.page.contact') },
            { name: 'FAQ', href: route('tenant.pages.faq') },
            { name: 'Suivi de commande', href: route('tenant.orders.index') },
            { name: 'Retours', href: route('tenant.returns.index') },
        ],
    },
    {
        title: 'Légal',
        links: [
            { name: 'Conditions', href: route('tenant.pages.terms') },
            { name: 'Confidentialité', href: route('tenant.pages.privacy') },
            { name: 'Cookies', href: route('tenant.pages.cookies') },
        ],
    },
];

export default function TenantFooterSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
    };

    return (
        <footer
            ref={ref}
            className="relative border-t border-border/40 bg-linear-to-b from-background via-background to-muted/20 dark:border-white/10"
        >
            {/* Glow supérieur */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-primary/5 to-transparent blur-3xl" />

            {/* Garanties */}
            {/* <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="container mx-auto px-4 py-12"
            >
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {guarantees.map((item, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            whileHover={{
                                y: -3,
                                transition: { duration: 0.2 },
                            }}
                            className="group flex items-center gap-3 rounded-2xl border border-border bg-card/50 p-4 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card hover:shadow-lg dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                        >
                            <motion.div
                                whileHover={{
                                    rotate: [0, -5, 5, 0],
                                    transition: { duration: 0.4 },
                                }}
                                className="rounded-xl bg-primary/10 p-2 text-primary"
                            >
                                <item.icon className="h-5 w-5" />
                            </motion.div>
                            <div>
                                <p className="text-sm font-semibold">
                                    {item.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {item.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div> */}

            <Separator className="opacity-20" />

            {/* Contenu principal */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="container mx-auto px-4 py-16"
            >
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
                    {/* Marque */}
                    <motion.div variants={itemVariants} className="space-y-5">
                        <Logo />
                        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                            shop – Une expérience e‑commerce premium, rapide et
                            fiable.
                        </p>
                        <div className="flex gap-2">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.name}
                                    href={social.href}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group relative rounded-xl border border-border bg-card/50 p-2 backdrop-blur-sm transition-colors hover:bg-card dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                                >
                                    <social.icon className="relative z-10 h-4 w-4 text-muted-foreground transition-colors group-hover:text-white" />
                                    <span
                                        className="absolute inset-0 rounded-xl opacity-0 blur transition-opacity duration-300 group-hover:opacity-40"
                                        style={{
                                            backgroundColor: social.color,
                                        }}
                                    />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Sections de liens */}
                    {footerSections.map((section) => (
                        <motion.div
                            key={section.title}
                            variants={itemVariants}
                            className="space-y-4"
                        >
                            <h3 className="text-sm font-semibold tracking-wider text-foreground/80 uppercase">
                                {section.title}
                            </h3>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="group inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
                                        >
                                            <ChevronRight className="mr-1 h-3 w-3 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                                            <span className="relative">
                                                {link.name}
                                                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                                            </span>
                                            {link.badge && (
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-2 px-1.5 py-0 text-[10px]"
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
            </motion.div>

            <Separator className="opacity-20" />

            {/* Barre inférieure */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 }}
                className="container mx-auto px-4 py-6"
            >
                <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
                    <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Français (CDF)
                    </div>
                    <div className="flex items-center gap-2">
                        <CreditCardIcon className="h-4 w-4" />
                        Visa • Mastercard • PayPal
                    </div>
                    <p>© {new Date().getFullYear()} Tous droits réservés.</p>
                </div>
            </motion.div>
        </footer>
    );
}
