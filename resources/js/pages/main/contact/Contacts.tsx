/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/Pages/Contact.tsx
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRightIcon,
    CheckCircle2Icon,
    Clock3Icon,
    HeadphonesIcon,
    Loader2Icon,
    MailIcon,
    MapPinIcon,
    MessageSquareTextIcon,
    PhoneIcon,
    ShieldCheckIcon,
    SparklesIcon,
    Send,
    Globe,
    Users,
    Zap,
    UserIcon,
    LoaderIcon,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import MainLayout from '@/layouts/main-layout';
import getToastStyle from '@/lib/toast-style';
import { cn } from '@/lib/utils';

type ContactExperienceProps = {
    categories: Record<string, string>;
    contactMeta: {
        appName: string;
        email: string;
        phone: string | null;
        responseTime: string;
        availability: string;
        supportHours: string;
        location: string;
    };
};

type ContactFormData = {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    categorie: string;
    sujet: string;
    message: string;
};

const categoryDetails: Record<
    string,
    {
        description: string;
        accent: string;
        icon: React.ComponentType<{ className?: string }>;
    }
> = {
    general: {
        description: 'Pour une question générale ou un premier contact.',
        accent: 'from-blue-500/10 to-indigo-500/5',
        icon: Globe,
    },
    commercial: {
        description:
            'Demandez un devis, une présentation ou un accompagnement business.',
        accent: 'from-emerald-500/10 to-teal-500/5',
        icon: Zap,
    },
    technique: {
        description: 'Signalez un besoin technique ou une intégration.',
        accent: 'from-sky-500/10 to-cyan-500/5',
        icon: ShieldCheckIcon,
    },
    support: {
        description: 'Obtenez de l’aide sur un service en cours.',
        accent: 'from-amber-500/10 to-orange-500/5',
        icon: HeadphonesIcon,
    },
    reclamation: {
        description:
            'Partagez une insatisfaction pour un traitement prioritaire.',
        accent: 'from-rose-500/10 to-red-500/5',
        icon: MessageSquareTextIcon,
    },
};

export default function ContactPage({
    categories,
    contactMeta,
}: ContactExperienceProps) {
    const defaultCategory = Object.keys(categories)[0] ?? 'general';

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm<ContactFormData>({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        categorie: defaultCategory,
        sujet: '',
        message: '',
    });

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        post(route('tenant.page.contact.store'), {
            preserveScroll: true,
            showProgress: false,
            onSuccess: () => {
                reset();
                toast.success('Votre message a été envoyé avec succès.',{
                    style: getToastStyle('success')
                });
            },
            onError: () => {
                toast.error('Veuillez corriger les erreurs du formulaire.',{
                    style: getToastStyle('error')
                });
            },
        });
    }

    const SelectedCategoryIcon = categoryDetails[data.categorie]?.icon || Globe;

    return (
        <MainLayout>
            <Head title={`Contactez ${contactMeta.appName}`} />

            {/* HERO SECTION */}
            <section className="relative overflow-hidden border-b border-border/40 bg-linear-to-b from-background via-background to-muted/20 px-4 py-20 lg:py-28">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute -top-40 -left-40 h-125 w-125 rounded-full bg-primary/5 blur-[120px]" />
                    <div className="absolute -right-40 -bottom-40 h-125 w-125 rounded-full bg-secondary/5 blur-[120px]" />
                </div>

                <div className="mx-auto max-w-6xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-5"
                    >
                        <Badge className="gap-1.5 border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
                            <SparklesIcon className="h-3.5 w-3.5" />
                            Contact & Support
                        </Badge>
                        <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                            Parlons de votre projet,
                            <span className="mt-2 block bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                construisons-le ensemble
                            </span>
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                            Une question, un projet ou simplement envie
                            d’échanger ? Notre équipe est à votre écoute.
                        </p>
                    </motion.div>

                    {/* Quick contact cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-12 grid gap-4 sm:grid-cols-3"
                    >
                        {[
                            {
                                icon: MailIcon,
                                label: 'Email',
                                value: contactMeta.email,
                            },
                            {
                                icon: MailIcon,
                                label: 'Email',
                                value: contactMeta.email,
                            },
                            ...(contactMeta.phone
                                ? [
                                      {
                                          icon: PhoneIcon,
                                          label: 'Téléphone',
                                          value: contactMeta.phone,
                                      },
                                  ]
                                : []),
                            {
                                icon: MapPinIcon,
                                label: 'Localisation',
                                value: contactMeta.location,
                            },
                        ].map((item, idx) => (
                            <Card
                                key={idx}
                                className="border-border/60 bg-card/60 backdrop-blur-sm"
                            >
                                <CardContent className="flex items-center gap-4 p-4">
                                    <div className="rounded-full bg-primary/10 p-2.5 text-primary">
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            {item.label}
                                        </p>
                                        <p className="text-sm font-semibold">
                                            {item.value}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* FORM + INFO */}
            <section className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
                <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
                    {/* Left column: Information & commitments */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <Badge variant="outline" className="gap-1">
                                <HeadphonesIcon className="h-3.5 w-3.5" />
                                Support Premium
                            </Badge>
                            <h2 className="font-heading text-3xl font-bold">
                                Un accompagnement sur mesure
                            </h2>
                            <p className="text-muted-foreground">
                                Notre équipe traite chaque demande avec
                                attention. Réponse rapide, suivi personnalisé et
                                solutions adaptées à vos besoins.
                            </p>
                        </div>

                        <div className="grid gap-4">
                            {[
                                {
                                    icon: Clock3Icon,
                                    title: 'Réponse rapide',
                                    description: `Première réponse en ${contactMeta.responseTime}.`,
                                },
                                {
                                    icon: ShieldCheckIcon,
                                    title: 'Suivi structuré',
                                    description:
                                        'Chaque message est classé et suivi jusqu’à résolution.',
                                },
                                {
                                    icon: Users,
                                    title: 'Équipe dédiée',
                                    description:
                                        'Commercial, support et technique travaillent ensemble.',
                                },
                                {
                                    icon: Users,
                                    title: 'Équipe dédiée',
                                    description:
                                        'Commercial, support et technique travaillent ensemble.',
                                },
                            ].map((item, i) => (
                                <Card
                                    key={i}
                                    className="border-border/60 bg-card/60 backdrop-blur-sm"
                                >
                                    <CardContent className="flex gap-4 p-5">
                                        <div className="rounded-full bg-primary/10 p-2.5 text-primary">
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {item.description}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Availability card */}
                        <Card className="border-primary/20 bg-primary/5">
                            <CardContent className="p-5">
                                <div className="flex items-center gap-3">
                                    <Clock3Icon className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="font-medium">
                                            Disponibilité
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {contactMeta.supportHours} ·{' '}
                                            {contactMeta.availability}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Right column: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="overflow-hidden border-border/60 shadow-xl">
                            <CardHeader className="border-b border-border/40 bg-muted/30 px-6 py-5">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <MessageSquareTextIcon className="h-5 w-5 text-primary" />
                                    Envoyez-nous un message
                                </CardTitle>
                                <CardDescription>
                                    Remplissez le formulaire ci-dessous, nous
                                    vous répondrons dans les plus brefs délais.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                {recentlySuccessful ? (
                                    <div className="flex items-start gap-3 rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-green-700 dark:text-green-400">
                                        <CheckCircle2Icon className="mt-0.5 h-5 w-5 shrink-0" />
                                        <p className="text-sm">
                                            Votre message a bien été envoyé.
                                            Nous revenons vers vous rapidement.
                                        </p>
                                    </div>
                                ) : (
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                    >
                                        {/* Catégories – Sélection horizontale avec animation subtile */}
                                        <div className="space-y-3">
                                            <Label className="text-sm font-medium">
                                                Catégorie
                                            </Label>
                                            <div className="relative grid">
                                                <Carousel
                                                    opts={{
                                                        align: 'start',
                                                        dragFree: true,
                                                        containScroll:
                                                            'trimSnaps',
                                                    }}
                                                    className="w-full"
                                                >
                                                    <CarouselContent className="-ml-2 py-1">
                                                        {Object.entries(
                                                            categories,
                                                        ).map(
                                                            ([key, label]) => {
                                                                const CategoryIcon =
                                                                    categoryDetails[
                                                                        key
                                                                    ]?.icon ||
                                                                    Globe;
                                                                const isActive =
                                                                    data.categorie ===
                                                                    key;

                                                                return (
                                                                    <CarouselItem
                                                                        key={
                                                                            key
                                                                        }
                                                                        className="basis-auto pl-2"
                                                                    >
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                setData(
                                                                                    'categorie',
                                                                                    key,
                                                                                )
                                                                            }
                                                                            className={cn(
                                                                                'flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200',
                                                                                isActive
                                                                                    ? 'border-transparent bg-linear-to-r from-primary/90 to-primary text-primary-foreground shadow-sm'
                                                                                    : 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted/30',
                                                                            )}
                                                                            aria-pressed={
                                                                                isActive
                                                                            }
                                                                        >
                                                                            <CategoryIcon
                                                                                className={cn(
                                                                                    'h-4 w-4 transition-colors duration-200',
                                                                                    isActive
                                                                                        ? 'text-primary-foreground'
                                                                                        : 'text-muted-foreground',
                                                                                )}
                                                                            />
                                                                            <span>
                                                                                {
                                                                                    label
                                                                                }
                                                                            </span>
                                                                            {isActive && (
                                                                                <CheckCircle2Icon className="h-3.5 w-3.5 text-green-400" />
                                                                            )}
                                                                        </button>
                                                                    </CarouselItem>
                                                                );
                                                            },
                                                        )}
                                                    </CarouselContent>
                                                    <CarouselPrevious className="absolute top-1/2 -left-4 h-8 w-8 -translate-y-1/2 border-0 bg-background/80 shadow-md backdrop-blur-sm hover:bg-background" />
                                                    <CarouselNext className="absolute top-1/2 -right-4 h-8 w-8 -translate-y-1/2 border-0 bg-background/80 shadow-md backdrop-blur-sm hover:bg-background" />
                                                </Carousel>
                                            </div>
                                            <InputError
                                                message={errors.categorie}
                                            />
                                        </div>
                                        {/* Nom & Prénom */}
                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="nom"
                                                    className="text-sm font-medium"
                                                >
                                                    Nom
                                                </Label>
                                                <div className="relative">
                                                    <UserIcon className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                    <Input
                                                        id="nom"
                                                        value={data.nom}
                                                        onChange={(e) =>
                                                            setData(
                                                                'nom',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Dupont"
                                                        className="h-12 pl-10 text-base transition-all duration-200 focus:border-primary focus:shadow-[0_0_0_2px_hsl(var(--primary)/0.1)]"
                                                    />
                                                </div>
                                                <InputError
                                                    message={errors.nom}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="prenom"
                                                    className="text-sm font-medium"
                                                >
                                                    Prénom
                                                </Label>
                                                <div className="relative">
                                                    <UserIcon className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                    <Input
                                                        id="prenom"
                                                        value={data.prenom}
                                                        onChange={(e) =>
                                                            setData(
                                                                'prenom',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Jean"
                                                        className="h-12 pl-10 text-base transition-all duration-200 focus:border-primary focus:shadow-[0_0_0_2px_hsl(var(--primary)/0.1)]"
                                                    />
                                                </div>
                                                <InputError
                                                    message={errors.prenom}
                                                />
                                            </div>
                                        </div>

                                        {/* Email & Téléphone */}
                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="email"
                                                    className="text-sm font-medium"
                                                >
                                                    Email
                                                </Label>
                                                <div className="relative">
                                                    <MailIcon className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={data.email}
                                                        onChange={(e) =>
                                                            setData(
                                                                'email',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="jean@exemple.com"
                                                        className="h-12 pl-10 text-base transition-all duration-200 focus:border-primary focus:shadow-[0_0_0_2px_hsl(var(--primary)/0.1)]"
                                                    />
                                                </div>
                                                <InputError
                                                    message={errors.email}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="telephone"
                                                    className="text-sm font-medium"
                                                >
                                                    Téléphone
                                                </Label>
                                                <div className="relative">
                                                    <PhoneIcon className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                    <Input
                                                        id="telephone"
                                                        value={data.telephone}
                                                        onChange={(e) =>
                                                            setData(
                                                                'telephone',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="+33 6 12 34 56 78"
                                                        className="h-12 pl-10 text-base transition-all duration-200 focus:border-primary focus:shadow-[0_0_0_2px_hsl(var(--primary)/0.1)]"
                                                    />
                                                </div>
                                                <InputError
                                                    message={errors.telephone}
                                                />
                                            </div>
                                        </div>

                                        {/* Sujet */}
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="sujet"
                                                className="text-sm font-medium"
                                            >
                                                Sujet
                                            </Label>
                                            <div className="relative">
                                                <MessageSquareTextIcon className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    id="sujet"
                                                    value={data.sujet}
                                                    onChange={(e) =>
                                                        setData(
                                                            'sujet',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Demande de renseignements"
                                                    className="h-12 pl-10 text-base transition-all duration-200 focus:border-primary focus:shadow-[0_0_0_2px_hsl(var(--primary)/0.1)]"
                                                />
                                            </div>
                                            <InputError
                                                message={errors.sujet}
                                            />
                                        </div>

                                        {/* Message */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label
                                                    htmlFor="message"
                                                    className="text-sm font-medium"
                                                >
                                                    Message
                                                </Label>
                                                <motion.span
                                                    key={data.message.length}
                                                    initial={{ scale: 0.9 }}
                                                    animate={{ scale: 1 }}
                                                    className="text-xs text-muted-foreground"
                                                >
                                                    {data.message.length}/5000
                                                </motion.span>
                                            </div>
                                            <div className="relative">
                                                <Textarea
                                                    id="message"
                                                    value={data.message}
                                                    onChange={(e) =>
                                                        setData(
                                                            'message',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Décrivez votre demande en détail..."
                                                    rows={7}
                                                    className="min-h-40 resize-none pl-10 text-base transition-all duration-200 focus:border-primary focus:shadow-[0_0_0_2px_hsl(var(--primary)/0.1)]"
                                                />
                                            </div>
                                            <InputError
                                                message={errors.message}
                                            />
                                        </div>

                                        {/* Selected category hint – animation légère */}
                                        <motion.div
                                            key={data.categorie}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.25,
                                                ease: 'easeOut',
                                            }}
                                            className="flex items-center gap-3 rounded-lg bg-muted/40 p-3 text-sm"
                                        >
                                            <SelectedCategoryIcon className="h-5 w-5 text-primary" />
                                            <span className="text-muted-foreground">
                                                {
                                                    categoryDetails[
                                                        data.categorie
                                                    ]?.description
                                                }
                                            </span>
                                        </motion.div>

                                        <Separator />

                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="h-12 w-full cursor-pointer rounded-full bg-primary/95 text-base font-semibold hover:bg-primary"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <>
                                                    <LoaderIcon className="h-6 w-6 animate-spin" />
                                                    Envoi en cours...
                                                </>
                                            ) : (
                                                <>
                                                    Envoyer le message
                                                    <Send className="h-6 w-6" />
                                                </>
                                            )}
                                        </Button>
                                        <p className="text-center text-xs text-muted-foreground">
                                            Vos données sont traitées avec la
                                            plus grande confidentialité.
                                        </p>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="border-t border-border/40 bg-muted/20 px-4 py-16 lg:py-20">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-10 text-center">
                        <Badge className="mb-4">FAQ</Badge>
                        <h2 className="font-heading text-3xl font-bold">
                            Questions fréquentes
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            Tout ce que vous devez savoir avant de nous
                            contacter.
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {[
                            {
                                q: 'Quel est le délai de réponse ?',
                                a: `Nous répondons généralement en ${contactMeta.responseTime}.`,
                            },
                            {
                                q: 'Puis-je demander un devis ?',
                                a: 'Oui, sélectionnez la catégorie "Commercial" et décrivez votre projet.',
                            },
                            {
                                q: 'Le support est-il gratuit ?',
                                a: 'Oui, le support client est inclus pour tous nos services.',
                            },
                            {
                                q: 'Comment suivre ma demande ?',
                                a: 'Vous recevrez un email de confirmation avec un numéro de ticket.',
                            },
                        ].map((item, i) => (
                            <Card key={i} className="border-border/60">
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        {item.q}
                                    </CardTitle>
                                    <CardDescription>{item.a}</CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
