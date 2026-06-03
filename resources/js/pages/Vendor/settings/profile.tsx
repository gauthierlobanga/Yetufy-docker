/* eslint-disable @typescript-eslint/no-unused-vars */
// import { Transition } from '@headlessui/react';
// import { Form, Head, usePage } from '@inertiajs/react';
// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Camera, Mail, Phone, MapPin, Globe, ShoppingBag, Settings2, Lock, AlertCircle, CheckCircle2, Copy, User } from 'lucide-react';
// import { toast } from 'sonner';
// import ParametresController from '@/actions/App/Http/Controllers/Vendor/Settings/ParametresController';
// import InputError from '@/components/input-error';
// import Heading from '@/components/heading';
// import { SiteHeader } from '@/components/site-header';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
// import { VendorSidebar } from '@/components/VendorSidebar';
// import SettingsLayout from '@/layouts/Vendor/settings/layout';
// import type { Tenant } from '@/types/tenants/products/vendor/tenant';

// export default function VendorProfile({
//     tenant,
//     mustVerifyEmail,
//     status,
// }: {
//     tenant: Tenant;
//     mustVerifyEmail: boolean;
//     status?: string;
// }) {
//     const { auth } = usePage().props;
//     const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const [copiedUrl, setCopiedUrl] = useState(false);
//     const [activeTab, setActiveTab] = useState('personal');

//     const user = auth?.user;
//     const userInitials = user?.name
//         ? user.name
//               .split(' ')
//               .map((n: string) => n[0])
//               .join('')
//               .toUpperCase()
//               .slice(0, 2)
//         : '?';

//     const shopUrl = tenant.url || `${tenant.slug}.${window.location.hostname.split('.').slice(-2).join('.')}`;

//     const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             setSelectedFile(file);
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setPreviewUrl(reader.result as string);
//             };
//             reader.readAsDataURL(file);
//             toast.success('Logo sélectionné - Enregistrez pour confirmer');
//         }
//     };

//     const copyShopUrl = () => {
//         navigator.clipboard.writeText(shopUrl);
//         setCopiedUrl(true);
//         toast.success('URL de la boutique copiée');
//         setTimeout(() => setCopiedUrl(false), 2000);
//     };

//     return (
//         <SidebarProvider
//             style={
//                 {
//                     '--sidebar-width': 'calc(var(--spacing) * 72)',
//                     '--header-height': 'calc(var(--spacing) * 12)',
//                 } as React.CSSProperties
//             }
//         >
//             <Head title={`Profil - ${tenant.raison_sociale}`} />
//             <VendorSidebar tenant={tenant} />
//             <SidebarInset>
//                 <SiteHeader />
//                 <SettingsLayout>
//                     <div className="space-y-6 max-w-5xl">
//                         {/* En-tête principal */}
//                         <motion.div
//                             initial={{ opacity: 0, y: 10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             className="space-y-4"
//                         >
//                             <div>
//                                 <Heading
//                                     variant="small"
//                                     title="Profil"
//                                     description="Gérez votre profil personnel et les détails de votre boutique"
//                                 />
//                             </div>
//                         </motion.div>

//                         {/* Onglets */}
//                         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                             <TabsList className="grid w-full max-w-md grid-cols-2">
//                                 <TabsTrigger value="personal" className="flex items-center gap-2">
//                                     <User className="h-4 w-4" />
//                                     Profil personnel
//                                 </TabsTrigger>
//                                 <TabsTrigger value="shop" className="flex items-center gap-2">
//                                     <ShoppingBag className="h-4 w-4" />
//                                     Ma boutique
//                                 </TabsTrigger>
//                             </TabsList>

//                             {/* Onglet: Profil personnel */}
//                             <TabsContent value="personal" className="space-y-6">
//                                 {/* Carte avec avatar */}
//                                 <Card className="border-emerald-200/50 dark:border-emerald-900/20 overflow-hidden">
//                                     <div className="h-24 bg-linear-to-r from-blue-50 via-blue-100/50 to-white dark:from-blue-950/40 dark:via-blue-900/20 dark:to-slate-900" />

//                                     <CardContent className="pt-6">
//                                         <div className="flex gap-6 items-start">
//                                             {/* Avatar utilisateur */}
//                                             <div className="relative -mt-16">
//                                                 <Avatar className="h-32 w-32 border-4 border-white dark:border-slate-900 shadow-lg">
//                                                     <AvatarImage src={user?.avatar} />
//                                                     <AvatarFallback className="text-xl font-bold bg-blue-500 text-white">
//                                                         {userInitials}
//                                                     </AvatarFallback>
//                                                 </Avatar>
//                                             </div>

//                                             {/* Infos utilisateur */}
//                                             <div className="flex-1 pt-4">
//                                                 <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
//                                                     {user?.name}
//                                                 </h2>
//                                                 <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
//                                                     {user?.email}
//                                                 </p>
//                                                 <div className="mt-4 flex gap-2">
//                                                     {user?.email_verified_at ? (
//                                                         <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
//                                                             <CheckCircle2 className="h-3 w-3 mr-1" />
//                                                             Email vérifié
//                                                         </Badge>
//                                                     ) : (
//                                                         <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
//                                                             <AlertCircle className="h-3 w-3 mr-1" />
//                                                             Email non vérifié
//                                                         </Badge>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </CardContent>
//                                 </Card>

//                                 {/* Formulaire profil personnel */}
//                                 <Card>
//                                     <CardHeader>
//                                         <CardTitle className="flex items-center gap-2">
//                                             <Settings2 className="h-5 w-5" />
//                                             Mes informations
//                                         </CardTitle>
//                                         <CardDescription>
//                                             Mettez à jour vos informations personnelles
//                                         </CardDescription>
//                                     </CardHeader>

//                                     <CardContent>
//                                         <Form
//                                             {...ParametresController.update.form()}
//                                             className="space-y-6"
//                                             options={{ preserveScroll: true }}
//                                         >
//                                             {({ processing, recentlySuccessful, errors }) => (
//                                                 <>
//                                                     <div className="grid gap-6 md:grid-cols-2">
//                                                         <div className="grid gap-2">
//                                                             <Label htmlFor="name" className="text-sm font-medium">
//                                                                 Nom complet
//                                                             </Label>
//                                                             <Input
//                                                                 id="name"
//                                                                 name="name"
//                                                                 defaultValue={user?.name}
//                                                                 placeholder="Votre nom"
//                                                                 className="h-10"
//                                                                 required
//                                                             />
//                                                             <InputError message={errors.name} />
//                                                         </div>

//                                                         <div className="grid gap-2">
//                                                             <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
//                                                                 <Mail className="h-4 w-4" />
//                                                                 Email
//                                                             </Label>
//                                                             <Input
//                                                                 id="email"
//                                                                 type="email"
//                                                                 name="email"
//                                                                 defaultValue={user?.email}
//                                                                 placeholder="votre@email.com"
//                                                                 className="h-10"
//                                                                 required
//                                                             />
//                                                             <InputError message={errors.email} />
//                                                         </div>
//                                                     </div>

//                                                     {mustVerifyEmail && !user?.email_verified_at && (
//                                                         <div className="flex gap-3 p-4 rounded-lg border border-amber-200 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-900/10">
//                                                             <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
//                                                             <div className="flex-1">
//                                                                 <p className="text-sm text-amber-900 dark:text-amber-100 font-medium">
//                                                                     Email non vérifié
//                                                                 </p>
//                                                                 <p className="text-xs text-amber-800 dark:text-amber-200 mt-1">
//                                                                     Vérifiez votre adresse email pour accéder à toutes les fonctionnalités.
//                                                                 </p>
//                                                             </div>
//                                                         </div>
//                                                     )}

//                                                     <div className="flex items-center gap-4 pt-4">
//                                                         <Button
//                                                             disabled={processing}
//                                                             className="gap-2 bg-emerald-600 hover:bg-emerald-700"
//                                                         >
//                                                             Enregistrer
//                                                         </Button>

//                                                         <Transition
//                                                             show={recentlySuccessful}
//                                                             enter="transition ease-in-out duration-200"
//                                                             enterFrom="opacity-0"
//                                                             leave="transition ease-in-out duration-200"
//                                                             leaveTo="opacity-0"
//                                                         >
//                                                             <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
//                                                                 <CheckCircle2 className="h-4 w-4" />
//                                                                 Modifications sauvegardées
//                                                             </p>
//                                                         </Transition>
//                                                     </div>
//                                                 </>
//                                             )}
//                                         </Form>
//                                     </CardContent>
//                                 </Card>
//                             </TabsContent>

//                             {/* Onglet: Ma boutique */}
//                             <TabsContent value="shop" className="space-y-6">
//                                 {/* Carte avec logo */}
//                                 <Card className="border-emerald-200/50 dark:border-emerald-900/20 overflow-hidden">
//                                     <div className="h-32 bg-linear-to-r from-emerald-50 via-emerald-100/50 to-white dark:from-emerald-950/40 dark:via-emerald-900/20 dark:to-slate-900" />

//                                     <CardContent className="pt-6">
//                                         <div className="flex gap-8 items-start">
//                                             {/* Logo */}
//                                             <div className="relative -mt-20">
//                                                 <Avatar className="h-40 w-40 border-4 border-white dark:border-slate-900 shadow-xl">
//                                                     <AvatarImage src={previewUrl || tenant.logo_url} />
//                                                     <AvatarFallback className="text-3xl font-bold bg-emerald-500 text-white">
//                                                         {tenant.raison_sociale[0]}
//                                                     </AvatarFallback>
//                                                 </Avatar>

//                                                 <label className="absolute bottom-2 right-2 cursor-pointer">
//                                                     <input
//                                                         type="file"
//                                                         accept="image/*"
//                                                         className="hidden"
//                                                         onChange={handleAvatarChange}
//                                                     />
//                                                     <motion.div
//                                                         whileHover={{ scale: 1.1 }}
//                                                         whileTap={{ scale: 0.95 }}
//                                                         className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-3 shadow-lg transition-colors"
//                                                     >
//                                                         <Camera className="h-5 w-5" />
//                                                     </motion.div>
//                                                 </label>
//                                             </div>

//                                             {/* Infos boutique */}
//                                             <div className="flex-1 pt-6">
//                                                 <div>
//                                                     <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
//                                                         {tenant.raison_sociale}
//                                                     </h2>
//                                                     <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
//                                                         {tenant.type_entite && `Type: ${tenant.type_entite}`}
//                                                     </p>
//                                                 </div>

//                                                 {/* URL Boutique */}
//                                                 <div className="mt-6 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
//                                                     <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
//                                                         URL de votre boutique
//                                                     </p>
//                                                     <div className="flex items-center gap-2">
//                                                         <code className="text-sm font-mono text-slate-900 dark:text-slate-100 flex-1 break-all">
//                                                             {shopUrl}
//                                                         </code>
//                                                         <button
//                                                             onClick={copyShopUrl}
//                                                             className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
//                                                         >
//                                                             {copiedUrl ? (
//                                                                 <CheckCircle2 className="h-4 w-4 text-emerald-600" />
//                                                             ) : (
//                                                                 <Copy className="h-4 w-4 text-slate-600 dark:text-slate-400" />
//                                                             )}
//                                                         </button>
//                                                     </div>
//                                                 </div>

//                                                 {/* Badges */}
//                                                 <div className="mt-4 flex gap-2 flex-wrap">
//                                                     {tenant.email_verified_at || tenant.statut === 'actif' ? (
//                                                         <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
//                                                             <CheckCircle2 className="h-3 w-3 mr-1" />
//                                                             Actif
//                                                         </Badge>
//                                                     ) : (
//                                                         <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
//                                                             <AlertCircle className="h-3 w-3 mr-1" />
//                                                             En attente de vérification
//                                                         </Badge>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </CardContent>
//                                 </Card>

//                                 {/* Formulaire boutique */}
//                                 <Card>
//                                     <CardHeader>
//                                         <CardTitle className="flex items-center gap-2">
//                                             <ShoppingBag className="h-5 w-5" />
//                                             Informations de la boutique
//                                         </CardTitle>
//                                         <CardDescription>
//                                             Mettez à jour les détails de votre boutique
//                                         </CardDescription>
//                                     </CardHeader>

//                                     <CardContent>
//                                         <Form
//                                             {...ParametresController.update.form()}
//                                             className="space-y-6"
//                                             options={{ preserveScroll: true }}
//                                         >
//                                             {({ processing, recentlySuccessful, errors }) => (
//                                                 <>
//                                                     <div className="grid gap-6 md:grid-cols-2">
//                                                         <div className="grid gap-2">
//                                                             <Label htmlFor="raison_sociale" className="text-sm font-medium">
//                                                                 Raison sociale
//                                                             </Label>
//                                                             <Input
//                                                                 id="raison_sociale"
//                                                                 name="raison_sociale"
//                                                                 defaultValue={tenant.raison_sociale}
//                                                                 placeholder="Nom de votre entreprise"
//                                                                 className="h-10"
//                                                                 required
//                                                             />
//                                                         </div>

//                                                         <div className="grid gap-2">
//                                                             <Label htmlFor="telephone" className="text-sm font-medium flex items-center gap-2">
//                                                                 <Phone className="h-4 w-4" />
//                                                                 Téléphone
//                                                             </Label>
//                                                             <Input
//                                                                 id="telephone"
//                                                                 name="telephone"
//                                                                 defaultValue={tenant.telephone || ''}
//                                                                 placeholder="+243 XXX XXX XXX"
//                                                                 className="h-10"
//                                                             />
//                                                         </div>
//                                                     </div>

//                                                     <div className="grid gap-2">
//                                                         <Label htmlFor="description" className="text-sm font-medium">
//                                                             Description de la boutique
//                                                         </Label>
//                                                         <Textarea
//                                                             id="description"
//                                                             name="description"
//                                                             defaultValue={tenant.description || ''}
//                                                             placeholder="Décrivez votre boutique, vos spécialités..."
//                                                             className="min-h-24 resize-none"
//                                                         />
//                                                         <p className="text-xs text-slate-500 dark:text-slate-400">
//                                                             Max 500 caractères
//                                                         </p>
//                                                     </div>

//                                                     <div className="flex items-center gap-4 pt-4">
//                                                         <Button
//                                                             disabled={processing}
//                                                             className="gap-2 bg-emerald-600 hover:bg-emerald-700"
//                                                         >
//                                                             Enregistrer
//                                                         </Button>

//                                                         <Transition
//                                                             show={recentlySuccessful}
//                                                             enter="transition ease-in-out duration-200"
//                                                             enterFrom="opacity-0"
//                                                             leave="transition ease-in-out duration-200"
//                                                             leaveTo="opacity-0"
//                                                         >
//                                                             <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
//                                                                 <CheckCircle2 className="h-4 w-4" />
//                                                                 Modifications sauvegardées
//                                                             </p>
//                                                         </Transition>
//                                                     </div>
//                                                 </>
//                                             )}
//                                         </Form>
//                                     </CardContent>
//                                 </Card>

//                                 {/* Informations supplémentaires */}
//                                 <div className="grid gap-4 md:grid-cols-2">
//                                     {/* SIRET/RCCM */}
//                                     <Card>
//                                         <CardHeader>
//                                             <CardTitle className="text-base">Documents légaux</CardTitle>
//                                         </CardHeader>
//                                         <CardContent className="space-y-3">
//                                             <div>
//                                                 <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-1">
//                                                     RCCM
//                                                 </p>
//                                                 <p className="text-sm font-mono text-slate-900 dark:text-slate-100">
//                                                     {tenant.siret || 'Non renseigné'}
//                                                 </p>
//                                             </div>
//                                             <div>
//                                                 <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-1">
//                                                     Type d'entité
//                                                 </p>
//                                                 <Badge variant="outline">{tenant.type_entite}</Badge>
//                                             </div>
//                                         </CardContent>
//                                     </Card>

//                                     {/* Abonnement */}
//                                     <Card>
//                                         <CardHeader>
//                                             <CardTitle className="text-base">Abonnement</CardTitle>
//                                         </CardHeader>
//                                         <CardContent className="space-y-3">
//                                             <div>
//                                                 <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-1">
//                                                     Statut
//                                                 </p>
//                                                 <Badge className={tenant.statut === 'actif' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-slate-100 text-slate-700'}>
//                                                     {tenant.statut === 'actif' ? 'Actif' : 'Inactif'}
//                                                 </Badge>
//                                             </div>
//                                             <div>
//                                                 <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-1">
//                                                     Plan
//                                                 </p>
//                                                 <p className="text-sm text-slate-900 dark:text-slate-100">
//                                                     {tenant.plan_id ? 'Plan actif' : 'Pas de plan'}
//                                                 </p>
//                                             </div>
//                                         </CardContent>
//                                     </Card>
//                                 </div>
//                             </TabsContent>
//                         </Tabs>
//                     </div>
//                 </SettingsLayout>
//             </SidebarInset>
//         </SidebarProvider>
//     );
// }
import { Transition } from '@headlessui/react';
import { Form, Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Camera,
    Mail,
    Phone,
    Settings2,
    Lock,
    AlertCircle,
    CheckCircle2,
    Copy,
    User,
    ShoppingBag,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import ParametresController from '@/actions/App/Http/Controllers/Vendor/Settings/ParametresController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { SiteHeader } from '@/components/site-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { VendorSidebar } from '@/components/VendorSidebar';
import SettingsLayout from '@/layouts/Vendor/settings/layout';
import type { Tenant } from '@/types/tenants/products/vendor/tenant';

export default function VendorProfile({
    tenant, // rendu optionnel pour les clients acheteurs
    mustVerifyEmail,
    status,
}: {
    tenant?: Tenant; // <-- Modifié pour supporter les deux rôles
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage().props;
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [copiedUrl, setCopiedUrl] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');

    const user = auth?.user;
    const isTenant = Boolean(tenant); // on détermine le rôle

    // ---- Fonctions utilitaires (identiques à l’original) ----
    const userInitials = user?.name
        ? user.name
              .split(' ')
              .map((n: string) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : '?';

    const shopUrl = tenant
        ? tenant.url || `${tenant.slug}.${window.location.hostname.split('.').slice(-2).join('.')}`
        : '';

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
            toast.success('Logo sélectionné - Enregistrez pour confirmer');
        }
    };

    const copyShopUrl = () => {
        navigator.clipboard.writeText(shopUrl);
        setCopiedUrl(true);
        toast.success('URL de la boutique copiée');
        setTimeout(() => setCopiedUrl(false), 2000);
    };

    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <Head title={`Profil - ${user?.name ?? 'Utilisateur'}`} />

            {/* Sidebar conditionnelle : uniquement pour les vendeurs */}
            {isTenant && tenant && <VendorSidebar tenant={tenant} />}

            <SidebarInset>
                <SiteHeader />
                <SettingsLayout>
                    <div className="space-y-6 max-w-5xl">
                        {/* En-tête principal */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div>
                                <Heading
                                    variant="small"
                                    title="Profil"
                                    description={
                                        isTenant
                                            ? 'Gérez votre profil personnel et les détails de votre boutique'
                                            : 'Gérez vos informations personnelles'
                                    }
                                />
                            </div>
                        </motion.div>

                        {/* Onglets : seul l’onglet « Profil personnel » est toujours présent */}
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className={`grid w-full ${isTenant ? 'max-w-md grid-cols-2' : 'max-w-xs grid-cols-1'}`}>
                                <TabsTrigger value="personal" className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Profil personnel
                                </TabsTrigger>
                                {isTenant && (
                                    <TabsTrigger value="shop" className="flex items-center gap-2">
                                        <ShoppingBag className="h-4 w-4" />
                                        Ma boutique
                                    </TabsTrigger>
                                )}
                            </TabsList>

                            {/* Onglet: Profil personnel (valable pour tous) */}
                            <TabsContent value="personal" className="space-y-6">
                                <Card className="border-emerald-200/50 dark:border-emerald-900/20 overflow-hidden">
                                    <div className="h-24 bg-linear-to-r from-blue-50 via-blue-100/50 to-white dark:from-blue-950/40 dark:via-blue-900/20 dark:to-slate-900" />
                                    <CardContent className="pt-6">
                                        <div className="flex gap-6 items-start">
                                            <div className="relative -mt-16">
                                                <Avatar className="h-32 w-32 border-4 border-white dark:border-slate-900 shadow-lg">
                                                    <AvatarImage src={user?.avatar_url ?? undefined} />
                                                    <AvatarFallback className="text-xl font-bold bg-blue-500 text-white">
                                                        {userInitials}
                                                    </AvatarFallback>
                                                </Avatar>
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
                                                        <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                                            Email vérifié
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                                                            <AlertCircle className="h-3 w-3 mr-1" />
                                                            Email non vérifié
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Settings2 className="h-5 w-5" />
                                            Mes informations
                                        </CardTitle>
                                        <CardDescription>
                                            Mettez à jour vos informations personnelles
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Form
                                            {...ParametresController.update.form()}
                                            className="space-y-6"
                                            options={{ preserveScroll: true }}
                                        >
                                            {({ processing, recentlySuccessful, errors }) => (
                                                <>
                                                    <div className="grid gap-6 md:grid-cols-2">
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="name">Nom complet</Label>
                                                            <Input
                                                                id="name"
                                                                name="name"
                                                                defaultValue={user?.name}
                                                                placeholder="Votre nom"
                                                                className="h-10"
                                                                required
                                                            />
                                                            <InputError message={errors.name} />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="email" className="flex items-center gap-2">
                                                                <Mail className="h-4 w-4" />
                                                                Email
                                                            </Label>
                                                            <Input
                                                                id="email"
                                                                type="email"
                                                                name="email"
                                                                defaultValue={user?.email}
                                                                placeholder="votre@email.com"
                                                                className="h-10"
                                                                required
                                                            />
                                                            <InputError message={errors.email} />
                                                        </div>
                                                    </div>

                                                    {mustVerifyEmail && !user?.email_verified_at && (
                                                        <div className="flex gap-3 p-4 rounded-lg border border-amber-200 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-900/10">
                                                            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                                                                    Email non vérifié
                                                                </p>
                                                                <p className="text-xs text-amber-800 dark:text-amber-200 mt-1">
                                                                    Vérifiez votre adresse email pour accéder à toutes les fonctionnalités.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-4 pt-4">
                                                        <Button
                                                            disabled={processing}
                                                            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                                                        >
                                                            Enregistrer
                                                        </Button>
                                                        <Transition
                                                            show={recentlySuccessful}
                                                            enter="transition ease-in-out duration-200"
                                                            enterFrom="opacity-0"
                                                            leave="transition ease-in-out duration-200"
                                                            leaveTo="opacity-0"
                                                        >
                                                            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                                                                <CheckCircle2 className="h-4 w-4" />
                                                                Modifications sauvegardées
                                                            </p>
                                                        </Transition>
                                                    </div>
                                                </>
                                            )}
                                        </Form>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Onglet: Ma boutique (uniquement si tenant) */}
                            {isTenant && tenant && (
                                <TabsContent value="shop" className="space-y-6">
                                    {/* Carte avec logo */}
                                    <Card className="border-emerald-200/50 dark:border-emerald-900/20 overflow-hidden">
                                        <div className="h-32 bg-linear-to-r from-emerald-50 via-emerald-100/50 to-white dark:from-emerald-950/40 dark:via-emerald-900/20 dark:to-slate-900" />
                                        <CardContent className="pt-6">
                                            <div className="flex gap-8 items-start">
                                                <div className="relative -mt-20">
                                                    <Avatar className="h-40 w-40 border-4 border-white dark:border-slate-900 shadow-xl">
                                                        <AvatarImage
                                                            src={previewUrl || (tenant.logo_url ?? undefined)}
                                                        />
                                                        <AvatarFallback className="text-3xl font-bold bg-emerald-500 text-white">
                                                            {tenant.raison_sociale[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <label className="absolute bottom-2 right-2 cursor-pointer">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={handleAvatarChange}
                                                        />
                                                        <motion.div
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-3 shadow-lg transition-colors"
                                                        >
                                                            <Camera className="h-5 w-5" />
                                                        </motion.div>
                                                    </label>
                                                </div>
                                                <div className="flex-1 pt-6">
                                                    <div>
                                                        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                                                            {tenant.raison_sociale}
                                                        </h2>
                                                        {/* <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                                            {tenant.type_entite && `Type: ${tenant.type_entite}`}
                                                        </p> */}
                                                    </div>
                                                    <div className="mt-6 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                                            URL de votre boutique
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            <code className="text-sm font-mono text-slate-900 dark:text-slate-100 flex-1 break-all">
                                                                {shopUrl}
                                                            </code>
                                                            <button
                                                                onClick={copyShopUrl}
                                                                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                                            >
                                                                {copiedUrl ? (
                                                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                                                ) : (
                                                                    <Copy className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 flex gap-2 flex-wrap">
                                                        {tenant.statut === 'actif' ? (
                                                            <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                Actif
                                                            </Badge>
                                                        ) : (
                                                            <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                                En attente de vérification
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Formulaire boutique */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <ShoppingBag className="h-5 w-5" />
                                                Informations de la boutique
                                            </CardTitle>
                                            <CardDescription>
                                                Mettez à jour les détails de votre boutique
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Form
                                                {...ParametresController.update.form()}
                                                className="space-y-6"
                                                options={{ preserveScroll: true }}
                                            >
                                                {({ processing, recentlySuccessful, errors }) => (
                                                    <>
                                                        <div className="grid gap-6 md:grid-cols-2">
                                                            <div className="grid gap-2">
                                                                <Label htmlFor="raison_sociale">Raison sociale</Label>
                                                                <Input
                                                                    id="raison_sociale"
                                                                    name="raison_sociale"
                                                                    defaultValue={tenant.raison_sociale}
                                                                    placeholder="Nom de votre entreprise"
                                                                    className="h-10"
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <Label htmlFor="telephone" className="flex items-center gap-2">
                                                                    <Phone className="h-4 w-4" />
                                                                    Téléphone
                                                                </Label>
                                                                <Input
                                                                    id="telephone"
                                                                    name="telephone"
                                                                    defaultValue={tenant.telephone || ''}
                                                                    placeholder="+243 XXX XXX XXX"
                                                                    className="h-10"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="description">Description de la boutique</Label>
                                                            <Textarea
                                                                id="description"
                                                                name="description"
                                                                defaultValue={tenant.description || ''}
                                                                placeholder="Décrivez votre boutique, vos spécialités..."
                                                                className="min-h-24 resize-none"
                                                            />
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                Max 500 caractères
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-4 pt-4">
                                                            <Button
                                                                disabled={processing}
                                                                className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                                                            >
                                                                Enregistrer
                                                            </Button>
                                                            <Transition
                                                                show={recentlySuccessful}
                                                                enter="transition ease-in-out duration-200"
                                                                enterFrom="opacity-0"
                                                                leave="transition ease-in-out duration-200"
                                                                leaveTo="opacity-0"
                                                            >
                                                                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                                                                    <CheckCircle2 className="h-4 w-4" />
                                                                    Modifications sauvegardées
                                                                </p>
                                                            </Transition>
                                                        </div>
                                                    </>
                                                )}
                                            </Form>
                                        </CardContent>
                                    </Card>

                                    {/* Informations supplémentaires (spécifiques tenant) */}
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-base">Documents légaux</CardTitle>
                                            </CardHeader>
                                            {/* <CardContent className="space-y-3">
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-1">
                                                        RCCM
                                                    </p>
                                                    <p className="text-sm font-mono text-slate-900 dark:text-slate-100">
                                                        {tenant.name || 'Non renseigné'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-1">
                                                        Type d'entité
                                                    </p>
                                                    <Badge variant="outline">{tenant.type_entite}</Badge>
                                                </div>
                                            </CardContent> */}
                                        </Card>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-base">Abonnement</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-1">
                                                        Statut
                                                    </p>
                                                    <Badge className={tenant.statut === 'actif' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-slate-100 text-slate-700'}>
                                                        {tenant.statut === 'actif' ? 'Actif' : 'Inactif'}
                                                    </Badge>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-1">
                                                        Plan
                                                    </p>
                                                    <p className="text-sm text-slate-900 dark:text-slate-100">
                                                        {tenant.plan?.name ? 'Plan actif' : 'Pas de plan'}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </TabsContent>
                            )}
                        </Tabs>
                    </div>
                </SettingsLayout>
            </SidebarInset>
        </SidebarProvider>
    );
}
