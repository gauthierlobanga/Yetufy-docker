// resources/js/layouts/FooterSection.tsx
import { Link, usePage } from '@inertiajs/react';
import type { Variants } from 'framer-motion';
import { motion, useInView } from 'framer-motion';
import {
    ChevronRight,
    MapPinIcon,
    PhoneIcon,
    MailIcon,
    ArrowUpRight,
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
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import agencies from '@/routes/agencies'; // à créer si besoin, sinon on utilise '#'
import blog from '@/routes/blog';
import page from '@/routes/page';
import properties from '@/routes/properties';

const footerSections = [
    {
        title: 'Nos biens',
        links: [
            { name: 'Toutes les propriétés', href: properties.index().url },
            { name: 'Acheter', href: '#', badge: null },
            { name: 'Louer', href: '#', badge: null },
            { name: 'Nos agences', href: agencies.index?.().url ?? '#' },
        ],
    },
    {
        title: 'Agence',
        links: [
            { name: 'À propos', href: page.about().url },
            { name: 'Blog', href: blog.index().url },
            { name: 'Témoignages', href: page.testimonials().url },
            { name: 'Carrières', href: '#' },
        ],
    },
    {
        title: 'Support',
        links: [
            { name: 'Contact', href: page.contact().url },
            { name: 'FAQ', href: page.faq().url },
            { name: 'Centre d’aide', href: page.help().url },
            { name: 'Support technique', href: page.support().url },
        ],
    },
    {
        title: 'Légal',
        links: [
            { name: 'Conditions générales', href: page.terms().url },
            { name: 'Confidentialité', href: page.privacy().url },
            { name: 'Cookies', href: page.cookies().url },
            { name: 'Mentions légales', href: '#' },
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

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
};

export default function FooterSection() {
    const ref = useRef<HTMLElement | null>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });
    const currentYear = new Date().getFullYear();

    const { socialLinks: rawSocialLinks } = usePage().props as any;

    const socialLinks = [
        { name: 'Facebook', href: rawSocialLinks?.facebook, icon: FaFacebook },
        {
            name: 'Instagram',
            href: rawSocialLinks?.instagram,
            icon: FaInstagram,
        },
        { name: 'X', href: rawSocialLinks?.x, icon: FaTwitter },
        { name: 'LinkedIn', href: rawSocialLinks?.linkedin, icon: FaLinkedin },
        { name: 'YouTube', href: rawSocialLinks?.youtube, icon: FaYoutube },
    ].filter((link) => link.href); // n'affiche que ceux qui ont un lien

    // Récupération des données de contact depuis le partage global (si configuré dans HandleInertiaRequests)
    const { contactInfo, name } = usePage().props as any;

    const phone = contactInfo?.phone ?? '+243 123 456 789';
    const email = contactInfo?.email ?? 'contact@immo-rdc.cd';
    const address =
        contactInfo?.address ?? '123 Avenue de l’Immobilier, Kinshasa';

    return (
        <footer
            ref={ref}
            className="relative w-full overflow-hidden border-t border-slate-200/70 bg-white dark:border-slate-800/70 dark:bg-slate-950"
        >
            {/* Main Footer */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
            >
                <div className="grid gap-12 lg:grid-cols-12">
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-4"
                    >
                        {/* Logo */}
                        <Link
                            href={route('home')}
                            className="inline-flex items-center"
                        >
                            <AppLogo />
                        </Link>

                        {/* Description */}
                        <p className="mt-6 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                            Votre partenaire immobilier de confiance à Kinshasa
                            et dans toute la RDC. Achat, vente, location :
                            trouvez le bien de vos rêves.
                        </p>

                        {/* Coordonnées – bloc premium */}
                        <div className="mt-8 space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 shadow-sm dark:bg-teal-900/30 dark:text-teal-400">
                                    <MapPinIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                        Adresse
                                    </p>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                        {address}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 shadow-sm dark:bg-teal-900/30 dark:text-teal-400">
                                    <PhoneIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                        Téléphone
                                    </p>
                                    <a
                                        href={`tel:${phone}`}
                                        className="text-sm font-medium text-slate-700 transition-colors hover:text-teal-600 dark:text-slate-200 dark:hover:text-teal-400"
                                    >
                                        {phone}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 shadow-sm dark:bg-teal-900/30 dark:text-teal-400">
                                    <MailIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                        Email
                                    </p>
                                    <a
                                        href={`mailto:${email}`}
                                        className="text-sm font-medium text-slate-700 transition-colors hover:text-teal-600 dark:text-slate-200 dark:hover:text-teal-400"
                                    >
                                        {email}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Réseaux sociaux */}
                        <div className="mt-8">
                            <p className="mb-3 text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                Suivez‑nous
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {socialLinks.map((social) => (
                                    <motion.a
                                        key={social.name}
                                        href={social.href}
                                        aria-label={social.name}
                                        whileHover={{ y: -2, scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={cn(
                                            'flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300',
                                            'border-slate-200 bg-white text-slate-500 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-600',
                                            'dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-teal-700 dark:hover:bg-teal-900/30 dark:hover:text-teal-400',
                                        )}
                                    >
                                        <social.icon className="h-5 w-5" />
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Liens */}
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
                                                className="group inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 transition-colors hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400"
                                            >
                                                <ChevronRight className="h-3.5 w-3.5 shrink-0 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                                                <span className="relative">
                                                    {link.name}
                                                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-teal-500 transition-all duration-300 group-hover:w-full" />
                                                </span>
                                                {link.badge && (
                                                    <span className="ml-1.5 rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:bg-teal-900/50 dark:text-teal-300">
                                                        {/* {link.badge} */}
                                                    </span>
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

            {/* Bottom Bar */}
            <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between dark:text-slate-400">
                    <div className="flex flex-wrap items-center gap-4">
                        <span className="inline-flex items-center gap-2">
                            🌍 Français • CDF
                        </span>
                        <span className="inline-flex items-center gap-2">
                            💳 Visa • Mastercard • Mobile Money
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <span>
                            © {currentYear} {name}.
                        </span>
                        <span className="hidden md:inline">•</span>
                        <span>Tous droits réservés.</span>
                    </div>
                    <Link
                        href="#top"
                        className="group inline-flex items-center gap-1 font-medium text-slate-600 transition-colors hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
                    >
                        Retour en haut
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                </div>
            </div>
        </footer>
    );
}
