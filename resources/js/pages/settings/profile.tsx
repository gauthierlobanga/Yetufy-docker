import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Camera, Mail, MapPin, Phone, Shield, LogOut, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import InputError from '@/components/input-error';
import Heading from '@/components/heading';
import DeleteUser from '@/components/delete-user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import ParametresController from '@/actions/App/Http/Controllers/Vendor/Settings/ParametresController';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mon profil',
        href: route('profile.edit'),
    },
];

export default function ClientProfile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage().props;
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const user = auth?.user;
    const initials = user?.name
        ? user.name
              .split(' ')
              .map((n: string) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : '?';

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
            toast.success('Avatar sélectionné - Enregistrez pour confirmer');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mon profil" />
            <h1 className="sr-only">Profil utilisateur</h1>

            <div className="space-y-6 max-w-4xl">
                {/* En-tête avec avatar */}
                <Card className="border-emerald-200/50 dark:border-emerald-900/20 overflow-hidden">
                    <div className="h-24 bg-gradient-to-r from-emerald-50 to-emerald-100/50 dark:from-emerald-950/40 dark:to-emerald-900/20" />

                    <CardContent className="pt-6">
                        <div className="flex gap-6 items-start">
                            <div className="relative -mt-16">
                                <Avatar className="h-32 w-32 border-4 border-white dark:border-slate-900 shadow-lg">
                                    <AvatarImage
                                        src={
                                            previewUrl ||
                                            user?.avatar ||
                                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
                                        }
                                    />
                                    <AvatarFallback className="text-xl font-bold bg-emerald-500 text-white">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>

                                <label className="absolute bottom-0 right-0 cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarChange}
                                    />
                                    <div className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-2 shadow-lg transition-colors">
                                        <Camera className="h-5 w-5" />
                                    </div>
                                </label>
                            </div>

                            <div className="flex-1 pt-4">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                    {user?.name}
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    {user?.email}
                                </p>
                                <div className="mt-4 flex gap-2">
                                    {user?.email_verified_at ? (
                                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
                                            <Shield className="h-3 w-3" />
                                            Email vérifié
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium">
                                            <AlertCircle className="h-3 w-3" />
                                            Email non vérifié
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Formulaire d'information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Informations personnelles</CardTitle>
                        <CardDescription>
                            Mettez à jour vos informations de profil
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Form
                            {...ParametresController.update.form()}
                            options={{ preserveScroll: true }}
                            className="space-y-6"
                        >
                            {({ processing, recentlySuccessful, errors }) => (
                                <>
                                    {/* Nom */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="name" className="text-sm font-medium">
                                            Nom complet
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={user?.name}
                                            placeholder="Votre nom complet"
                                            className="h-10"
                                            required
                                            autoComplete="name"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    {/* Email */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            Adresse email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            defaultValue={user?.email}
                                            placeholder="votre@email.com"
                                            className="h-10"
                                            required
                                            autoComplete="email"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Email Verification */}
                                    {mustVerifyEmail && !user?.email_verified_at && (
                                        <div className="flex gap-3 p-4 rounded-lg border border-amber-200 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-900/10">
                                            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="text-sm text-amber-900 dark:text-amber-100 font-medium">
                                                    Email non vérifié
                                                </p>
                                                <p className="text-xs text-amber-800 dark:text-amber-200 mt-1">
                                                    Vérifiez votre email pour accéder à toutes les fonctionnalités.
                                                </p>
                                                <Link
                                                    href={route('verification.send')}
                                                    method="post"
                                                    as="button"
                                                    className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 mt-2 underline"
                                                >
                                                    Renvoyer le lien de vérification
                                                </Link>
                                                {status === 'verification-link-sent' && (
                                                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
                                                        ✓ Lien envoyé à votre email
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center gap-4 pt-4">
                                        <Button
                                            disabled={processing}
                                            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                                        >
                                            Enregistrer les modifications
                                        </Button>

                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out duration-200"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out duration-200"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                                ✓ Modifications sauvegardées
                                            </p>
                                        </Transition>
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>

                {/* Préférences */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Préférences</CardTitle>
                        <CardDescription>
                            Gérez vos paramètres de compte
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    Notifications par email
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Recevez des mises à jour sur vos commandes
                                </p>
                            </div>
                            <input type="checkbox" defaultChecked className="h-4 w-4" />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    Offres promotionnelles
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Soyez informé des réductions exclusives
                                </p>
                            </div>
                            <input type="checkbox" defaultChecked className="h-4 w-4" />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    Historique d'achats
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Activer les recommandations personnalisées
                                </p>
                            </div>
                            <input type="checkbox" defaultChecked className="h-4 w-4" />
                        </div>
                    </CardContent>
                </Card>

                {/* Zone de danger */}
                <Card className="border-red-200/50 dark:border-red-900/20">
                    <CardHeader>
                        <CardTitle className="text-lg text-red-600 dark:text-red-400">Zone de danger</CardTitle>
                        <CardDescription>
                            Actions irréversibles sur votre compte
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-3">
                            <Button variant="outline" className="w-full justify-start gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20">
                                <LogOut className="h-4 w-4" />
                                Déconnexion
                            </Button>
                            <DeleteUser />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
