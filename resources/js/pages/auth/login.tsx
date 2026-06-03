import { Form, Head, Link } from '@inertiajs/react';
import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import {
    Mail,
    Lock,
    ArrowRight,
    Sparkles,
    ShieldCheck,
    KeyRound,
    LogIn,
} from 'lucide-react';

import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { SocialLoginButtons } from '@/components/social-login-buttons';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

import { useTenant } from '@/hooks/useTenant';
import AuthLayout from '@/layouts/auth-layout';
import { cn } from '@/lib/utils';
import { store } from '@/routes/login';
import { register as tenantRegister } from '@/routes/tenant';
import { request as tenantPasswordRequest } from '@/routes/tenant/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

const currentOriginUrl = (path: string) =>
    typeof window === 'undefined'
        ? path
        : new URL(path, window.location.origin).toString();

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    const { isTenant } = useTenant();
    const passwordRequest = isTenant
        ? tenantPasswordRequest()
        : currentOriginUrl('/forgot-password');
    const registerLink = isTenant
        ? tenantRegister().url
        : currentOriginUrl('/register');

    // Variantes d'animation
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.15,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: 'easeOut' },
        },
    };

    return (
        <AuthLayout
            title={isTenant ? 'Connexion client' : 'Bon retour'}
            description={
                isTenant
                    ? 'Connectez-vous pour retrouver vos commandes, vos favoris et finaliser vos achats.'
                    : 'Connectez-vous pour accéder à votre espace vendeur et gérer votre boutique.'
            }
        >
            <Head title="Connexion" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="space-y-8"
            >
                {({ processing, errors }) => (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-8"
                    >
                        {/* Badge de confiance */}
                        <motion.div
                            variants={itemVariants}
                            className="flex justify-center"
                        >
                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-emerald-700 backdrop-blur-xl dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Connexion sécurisée
                            </div>
                        </motion.div>

                        {/* Message de statut */}
                        {status && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-700 backdrop-blur-xl dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300"
                            >
                                {status}
                            </motion.div>
                        )}

                        {/* Formulaire */}
                        <motion.div
                            variants={itemVariants}
                            className="space-y-6"
                        >
                            {/* Email */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-semibold text-foreground/80 dark:text-foreground/90"
                                >
                                    Adresse e-mail
                                </Label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute top-1/2 left-4 z-10 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="email@exemple.com"
                                        className={cn(
                                            'h-12 rounded-2xl border-border bg-card/80 pl-11 shadow-sm backdrop-blur transition-all duration-300',
                                            'placeholder:text-muted-foreground/60',
                                            'focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10',
                                            'dark:focus:border-emerald-400 dark:focus:ring-emerald-400/10',
                                        )}
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            {/* Mot de passe */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-4">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-semibold text-foreground/80 dark:text-foreground/90"
                                    >
                                        Mot de passe
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={passwordRequest}
                                            className="text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                                            tabIndex={5}
                                        >
                                            Mot de passe oublié ?
                                        </TextLink>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute top-1/2 left-4 z-10 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400" />
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className={cn(
                                            'h-12 rounded-2xl border-border bg-card/80 pl-11 shadow-sm backdrop-blur transition-all duration-300',
                                            'placeholder:text-muted-foreground/60',
                                            'focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10',
                                            'dark:focus:border-emerald-400 dark:focus:ring-emerald-400/10',
                                        )}
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            {/* Remember me */}
                            <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-muted/50 px-4 py-3 dark:bg-muted/30">
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                    />
                                    <Label
                                        htmlFor="remember"
                                        className="cursor-pointer text-sm font-medium text-muted-foreground"
                                    >
                                        Se souvenir de moi
                                    </Label>
                                </div>
                                <KeyRound className="h-4 w-4 text-muted-foreground/60" />
                            </div>

                            {/* Bouton de connexion */}
                            <Button
                                type="submit"
                                disabled={processing}
                                tabIndex={4}
                                className={cn(
                                    'group relative h-12 w-full overflow-hidden rounded-xl',
                                    'bg-linear-to-r from-emerald-600 to-emerald-700',
                                    'text-sm font-semibold text-white',
                                    'transition-all duration-300 hover:scale-[1.01]',
                                    'disabled:cursor-not-allowed disabled:opacity-70',
                                    'dark:from-emerald-500 dark:to-emerald-600 dark:shadow-emerald-400/25 dark:hover:shadow-emerald-400/35',
                                )}
                            >
                                <span className="absolute inset-0 bg-linear-to-r from-white/0 via-white/15 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {processing ? (
                                        <>
                                            <Spinner className="h-4 w-4" />
                                            Connexion en cours...
                                        </>
                                    ) : (
                                        <>
                                            <LogIn className="h-4 w-4" />
                                            Se connecter
                                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                        </>
                                    )}
                                </span>
                            </Button>
                        </motion.div>

                        {/* Séparateur */}
                        <motion.div
                            variants={itemVariants}
                            className="relative"
                        >
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="rounded-full border border-border bg-card px-4 py-1 text-[11px] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
                                    Ou continuer avec
                                </span>
                            </div>
                        </motion.div>

                        {/* Connexions sociales */}
                        <motion.div variants={itemVariants}>
                            <SocialLoginButtons />
                        </motion.div>

                        {/* Lien d'inscription */}
                        {canRegister && (
                            <motion.div
                                variants={itemVariants}
                                className="text-center text-sm text-muted-foreground"
                            >
                                {isTenant
                                    ? "Vous n'avez pas encore de compte ?"
                                    : 'Pas encore de boutique ?'}{' '}
                                <Link
                                    href={registerLink}
                                    tabIndex={5}
                                    className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                                >
                                    {isTenant
                                        ? 'Créer mon compte'
                                        : 'Créer ma boutique'}
                                    <Sparkles className="h-3.5 w-3.5" />
                                </Link>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </Form>
        </AuthLayout>
    );
}
