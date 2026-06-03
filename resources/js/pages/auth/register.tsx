import { Form, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    Lock,
    ArrowRight,
    Sparkles,
    ShieldCheck,
    CheckCircle2,
} from 'lucide-react';

import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { SocialLoginButtons } from '@/components/social-login-buttons';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

import { useTenant } from '@/hooks/useTenant';
import AuthLayout from '@/layouts/auth-layout';
import { login as centralLogin } from '@/routes/central';
import { store } from '@/routes/register';
import { login as tenantLogin } from '@/routes/tenant';

export default function Register() {
    const { isTenant } = useTenant();
    const loginLink = isTenant ? tenantLogin() : centralLogin();

    return (
        <AuthLayout
            title={isTenant ? 'Créer mon compte client' : 'Créer votre compte'}
            description={
                isTenant
                    ? 'Inscrivez-vous dans cette boutique pour acheter plus vite et suivre vos commandes.'
                    : 'Rejoignez notre plateforme et lancez votre activité en quelques minutes.'
            }
        >
            <Head title="Inscription" />

            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="space-y-8"
            >
                {({ processing, errors }) => (
                    <>
                        {/* Badge premium */}
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="flex justify-center"
                        >
                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-emerald-700 backdrop-blur-xl dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                                <Sparkles className="h-3.5 w-3.5" />
                                Création sécurisée de compte
                            </div>
                        </motion.div>

                        {/* Carte principale */}
                        <div className="relative space-y-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="text-sm font-semibold text-slate-700 dark:text-slate-200"
                                >
                                    Nom complet
                                </Label>

                                <div className="group relative">
                                    <User className="pointer-events-none absolute top-1/2 left-4 h-4.5 w-4.5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400" />

                                    <Input
                                        id="name"
                                        type="text"
                                        name="name"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        placeholder="Jean Dupont"
                                        className="h-12 rounded-2xl border-slate-200 bg-white/70 pl-11 shadow-sm transition-all duration-300 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950/50"
                                    />
                                </div>

                                <InputError message={errors.name} />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-semibold text-slate-700 dark:text-slate-200"
                                >
                                    Adresse e-mail
                                </Label>

                                <div className="group relative">
                                    <Mail className="pointer-events-none absolute top-1/2 left-4 h-4.5 w-4.5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400" />

                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        name="email"
                                        placeholder="email@exemple.com"
                                        className="h-12 rounded-2xl border-slate-200 bg-white/70 pl-11 shadow-sm transition-all duration-300 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950/50"
                                    />
                                </div>

                                <InputError message={errors.email} />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-semibold text-slate-700 dark:text-slate-200"
                                >
                                    Mot de passe
                                </Label>

                                <div className="group relative">
                                    <Lock className="pointer-events-none absolute top-1/2 left-4 z-10 h-4.5 w-4.5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400" />

                                    <PasswordInput
                                        id="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder="Créer un mot de passe"
                                        className="h-12 rounded-2xl border-slate-200 bg-white/70 pl-11 shadow-sm transition-all duration-300 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950/50"
                                    />
                                </div>

                                <InputError message={errors.password} />
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="text-sm font-semibold text-slate-700 dark:text-slate-200"
                                >
                                    Confirmer le mot de passe
                                </Label>

                                <div className="group relative">
                                    <CheckCircle2 className="pointer-events-none absolute top-1/2 left-4 z-10 h-4.5 w-4.5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400" />

                                    <PasswordInput
                                        id="password_confirmation"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder="Confirmer votre mot de passe"
                                        className="h-12 rounded-2xl border-slate-200 bg-white/70 pl-11 shadow-sm transition-all duration-300 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950/50"
                                    />
                                </div>

                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            {/* Security Notice */}
                            <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/10 bg-emerald-500/4 px-4 py-3 dark:border-emerald-400/10 dark:bg-emerald-400/4">
                                <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
                                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                    Vos données sont protégées par un
                                    chiffrement sécurisé.
                                </p>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                tabIndex={5}
                                data-test="register-user-button"
                                disabled={processing}
                                className="group relative h-12 w-full overflow-hidden rounded-2xl bg-linear-to-r from-emerald-600 via-emerald-600 to-emerald-700 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(5,150,105,0.45)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_20px_40px_-12px_rgba(5,150,105,0.55)] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                <span className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {processing ? (
                                        <>
                                            <Spinner className="h-4 w-4" />
                                            Création du compte...
                                        </>
                                    ) : (
                                        <>
                                            Créer mon compte
                                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                        </>
                                    )}
                                </span>
                            </Button>
                        </div>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                            </div>

                            <div className="relative flex justify-center">
                                <span className="rounded-full border border-slate-200 bg-background px-4 py-1 text-[11px] font-semibold tracking-[0.15em] text-muted-foreground uppercase dark:border-slate-800">
                                    Ou s'inscrire avec
                                </span>
                            </div>
                        </div>

                        {/* Social Logins */}
                        <SocialLoginButtons />

                        {/* Login Link */}
                        <div className="text-center text-sm text-muted-foreground">
                            Vous avez déjà un compte ?{' '}
                            <TextLink
                                href={loginLink}
                                tabIndex={6}
                                className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                            >
                                Se connecter
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
