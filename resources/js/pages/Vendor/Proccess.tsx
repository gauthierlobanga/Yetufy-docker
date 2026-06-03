/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
// resources/js/Pages/Vendor/Configure.tsx
import { Head, useForm, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    ArrowRight,
    Store,
    Globe,
    Mail,
    Phone,
    Camera,
    CheckCircle,
    AlertCircle,
    Sparkles,
    ShieldCheck,
    Zap,
    Eye,
    Loader2,
    Lightbulb,
    XCircle,
    Copy,
    Check,
    FileCheck,
    FileText,
    Search,
    ChevronDown,
    ChevronsUpDown,
    CalendarIcon,
    CheckCircle2,
    Palette,
} from 'lucide-react';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

// ---------- TYPES ----------
interface Currency {
    code: string;
    symbol: string;
    name: string;
}
interface Language {
    code: string;
    name: string;
}
interface Country {
    iso2: string;
    name: string;
    phone_code: string;
}
interface TypeDocument {
    id: string;
    code: string;
    nom: string;
    description: string | null;
    est_obligatoire: boolean;
    forme_juridique?: string;
}
interface DocumentData {
    numero: string;
    date_delivrance: string;
    date_expiration: string;
}
interface DocumentPayload {
    type_document_id: string;
    numero_document: string | null;
    date_delivrance: string | null;
    date_expiration: string | null;
}
interface Props {
    plan: { id: number; name: string; formatted_price: string; price: number };
    currencies: Currency[];
    languages: Language[];
    countries: Country[];
    requiredDocuments: TypeDocument[];
    optionalDocuments: TypeDocument[];
}

const STEPS = [
    { id: 1, name: 'Identité', icon: Store },
    { id: 2, name: 'Contact', icon: Mail },
    { id: 3, name: 'Légal', icon: FileCheck },
    { id: 4, name: 'Apparence', icon: Camera },
    { id: 5, name: 'Validation', icon: ShieldCheck },
];

function getFlagUrl(iso2: string) {
    return `https://flagcdn.com/w40/${iso2}.png`;
}

function detectUserCountry(countries: Country[]): Country | null {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const city = tz.split('/')[1] || '';
    const tzMap: Record<string, string> = {
        Kinshasa: 'cd',
        Lubumbashi: 'cd',
        Paris: 'fr',
        London: 'gb',
        New_York: 'us',
        Brussels: 'be',
        Zurich: 'ch',
        Toronto: 'ca',
        Brazzaville: 'cg',
        Kigali: 'rw',
        Bujumbura: 'bi',
        Nairobi: 'ke',
        Dar_es_Salaam: 'tz',
        Kampala: 'ug',
    };

    return countries.find((c) => c.iso2 === (tzMap[city] || 'cd')) || null;
}

export default function VendorConfigure({
    plan,
    currencies,
    languages,
    countries,
    requiredDocuments,
    optionalDocuments,
}: Props) {
    const detectedCountry = useMemo(
        () => detectUserCountry(countries),
        [countries],
    );

    const [currentStep, setCurrentStep] = useState(1);
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
    const [slugStatus, setSlugStatus] = useState<
        'idle' | 'checking' | 'available' | 'unavailable'
    >('idle');
    const [slugChecking, setSlugChecking] = useState(false);
    const [slugErrors, setSlugErrors] = useState<string[]>([]);
    const [slugSuggestions, setSlugSuggestions] = useState<string[]>([]);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [selectedPhoneCountry, setSelectedPhoneCountry] =
        useState<Country | null>(detectedCountry);
    const [phoneSearch, setPhoneSearch] = useState('');
    const [submitProgress, setSubmitProgress] = useState(0);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { data, setData, post, processing, errors, recentlySuccessful } =
        useForm({
            plan_id: plan.id,
            shop_name: '',
            shop_slug: '',
            shop_description: '',
            contact_email: '',
            contact_phone: '' as string | null,
            password: 'password',
            phone_code: detectedCountry?.phone_code || '+243',
            currency: 'CDF',
            language: 'fr',
            logo: null as File | null,
            facebook_url: '',
            instagram_url: '',
            twitter_url: '',
            youtube_url: '',
            tiktok_url: '',
            accept_terms: false,
            forme_juridique: 'societe_commerciale',
            legal_documents: {} as Record<string, DocumentData>,
            documents: [] as DocumentPayload[],
        });

    const selectedCurrency = useMemo(
        () => currencies.find((c) => c.code === data.currency),
        [currencies, data.currency],
    );
    const selectedLanguage = useMemo(
        () => languages.find((l) => l.code === data.language),
        [languages, data.language],
    );
    const selectedLegalDocuments = useMemo(
        () =>
            [...requiredDocuments, ...optionalDocuments].filter(
                (doc) =>
                    doc.forme_juridique === data.forme_juridique ||
                    doc.forme_juridique === 'toutes',
            ),
        [requiredDocuments, optionalDocuments, data.forme_juridique],
    );

    const cleanSlug = (v: string) => v.toLowerCase().replace(/[^a-z0-9-]/g, '');
    const generateBaseSlug = (name: string) =>
        name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

    useEffect(() => {
        if (!slugManuallyEdited && data.shop_name) {
            setData('shop_slug', generateBaseSlug(data.shop_name));
        }
    }, [data.shop_name, slugManuallyEdited, setData]);

    const checkSlug = useCallback(
        async (slug: string) => {
            if (!slug || slug.length < 3) {
                setSlugStatus('idle');
                setSlugErrors([]);
                setSlugSuggestions([]);

                return;
            }

            setSlugChecking(true);
            setSlugStatus('checking');

            try {
                const res = await fetch('/devenir-vendeur/check-domain', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({ slug }),
                });
                const json = await res.json();

                if (json.errors?.length) {
                    setSlugStatus('unavailable');
                    setSlugErrors(json.errors);
                } else if (json.available) {
                    setSlugStatus('available');
                    setSlugErrors([]);

                    if (json.cleaned_slug && json.cleaned_slug !== slug) {
                        setData('shop_slug', json.cleaned_slug);
                    }
                } else {
                    setSlugStatus('unavailable');
                    setSlugErrors(['Ce sous-domaine est déjà pris.']);
                    setSlugSuggestions(json.suggestions || []);
                }
            } catch {
                setSlugStatus('idle');
            } finally {
                setSlugChecking(false);
            }
        },
        [setData],
    );

    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        if (data.shop_slug.length >= 3) {
            debounceTimer.current = setTimeout(
                () => checkSlug(data.shop_slug),
                500,
            );
        } else {
            setSlugStatus('idle');
            setSlugSuggestions([]);
        }

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [data.shop_slug, checkSlug]);

    // Progression simulée pendant la soumission
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        if (processing) {
            setSubmitProgress(0);
            timer = setInterval(() => {
                setSubmitProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(timer);

                        return 90;
                    }

                    return prev + Math.random() * 15;
                });
            }, 800);
        } else {
            setSubmitProgress(100);
        }

        return () => clearInterval(timer);
    }, [processing]);

    // Redirection après succès
    useEffect(() => {
        if (recentlySuccessful) {
            router.visit(route('vendor.success', { tenant: data.shop_slug }));
        }
    }, [recentlySuccessful, data.shop_slug]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setData('logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const isFormValid = () => {
        if (
            !data.shop_name.trim() ||
            !data.shop_slug.trim() ||
            slugStatus !== 'available'
        ) {
            return false;
        }

        if (!data.contact_email.trim()) {
            return false;
        }

        if (!data.password || data.password.length < 8) {
            return false;
        }

        if (!data.accept_terms) {
            return false;
        }

        // Documents légaux : plus de blocage
        return true;
    };

    const buildDocumentsPayload = (): DocumentPayload[] =>
        selectedLegalDocuments
            .map((doc) => {
                const docData = data.legal_documents[doc.code];

                return {
                    type_document_id: doc.id,
                    numero_document: docData?.numero?.trim() || null,
                    date_delivrance: docData?.date_delivrance || null,
                    date_expiration: docData?.date_expiration || null,
                };
            })
            .filter(
                (doc) =>
                    doc.numero_document ||
                    doc.date_delivrance ||
                    doc.date_expiration,
            );

    const handleSubmit = (
        e: React.BaseSyntheticEvent<
            SubmitEvent,
            HTMLFormElement,
            HTMLFormElement
        >,
    ) => {
        e.preventDefault();

        if (!isFormValid()) {
            return;
        }

        setData('contact_phone', data.contact_phone?.trim() || '');
        (data as any).documents = buildDocumentsPayload();

        post(route('vendor.store'), {
            forceFormData: true,
            preserveScroll: true,
            onError: (formErrors) => {
                const firstKey = Object.keys(formErrors)[0] ?? '';

                if (firstKey.startsWith('shop_')) {
                    setCurrentStep(1);
                } else if (
                    firstKey.startsWith('contact_') ||
                    firstKey.startsWith('phone_') ||
                    firstKey === 'currency' ||
                    firstKey === 'language'
                ) {
                    setCurrentStep(2);
                } else if (firstKey.startsWith('documents')) {
                    setCurrentStep(3);
                } else if (firstKey === 'logo' || firstKey.endsWith('_url')) {
                    setCurrentStep(4);
                }
            },
        });
    };

    // Vue de progression
    if (processing || recentlySuccessful) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950">
                <div className="space-y-8 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: 'spring',
                            stiffness: 200,
                            damping: 15,
                        }}
                        className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-teal-600 shadow-2xl shadow-emerald-500/20"
                    >
                        {recentlySuccessful ? (
                            <CheckCircle className="h-12 w-12 text-white" />
                        ) : (
                            <Loader2 className="h-12 w-12 animate-spin text-white" />
                        )}
                    </motion.div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {recentlySuccessful
                            ? 'Boutique créée avec succès !'
                            : 'Création de votre boutique en cours...'}
                    </h2>
                    {!recentlySuccessful && (
                        <div className="mx-auto w-80">
                            <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                                <motion.div
                                    className="h-full rounded-full bg-linear-to-r from-emerald-500 to-teal-600"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${submitProgress}%` }}
                                />
                            </div>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Veuillez patienter pendant que nous configurons
                                votre espace...
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Sinon, formulaire normal
    return (
        <>
            <Head title="Configurez votre boutique" />
            <div className="min-h-screen bg-white dark:bg-gray-950">
                {/* Barre de progression */}
                <div className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-2xl supports-backdrop-filter:bg-white/75 dark:border-slate-800 dark:bg-slate-950/80">
                    {/* Subtle linear highlight */}
                    <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-500/40 to-transparent" />

                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Desktop Header */}
                        <div className="flex h-18 items-center justify-between gap-4">
                            {/* Back Button */}
                            <Link
                                href={route('vendor.register')}
                                className="group inline-flex items-center gap-2 rounded-2xl border border-transparent px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:border-slate-800 dark:hover:bg-slate-900 dark:hover:text-white"
                            >
                                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-hover:bg-emerald-100 group-hover:text-emerald-600 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-emerald-950/40 dark:group-hover:text-emerald-400">
                                    <ArrowLeft className="h-4 w-4" />
                                </span>
                                <span className="hidden sm:inline">Retour</span>
                            </Link>

                            {/* Step Navigation - Desktop */}
                            <div className="hidden items-center gap-2 lg:flex">
                                {STEPS.map((step, idx) => {
                                    const isActive = currentStep === step.id;
                                    const isCompleted = currentStep > step.id;
                                    const isAccessible =
                                        isCompleted || isActive;
                                    const StepIcon = step.icon;

                                    return (
                                        <div
                                            key={step.id}
                                            className="flex items-center"
                                        >
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (isAccessible) {
                                                        setCurrentStep(step.id);
                                                    }
                                                }}
                                                disabled={!isAccessible}
                                                className={cn(
                                                    'group relative inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold transition-all duration-300',
                                                    isActive &&
                                                        'bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20',
                                                    isCompleted &&
                                                        'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300 dark:hover:bg-emerald-950/50',
                                                    !isActive &&
                                                        !isCompleted &&
                                                        'cursor-not-allowed border border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500',
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        'flex h-6 w-6 items-center justify-center rounded-full transition-colors',
                                                        isActive &&
                                                            'bg-white/20 text-white',
                                                        isCompleted &&
                                                            'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
                                                        !isActive &&
                                                            !isCompleted &&
                                                            'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
                                                    )}
                                                >
                                                    {isCompleted ? (
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                    ) : (
                                                        <StepIcon className="h-3.5 w-3.5" />
                                                    )}
                                                </span>

                                                <span className="hidden xl:inline">
                                                    {step.name}
                                                </span>
                                            </button>

                                            {idx < STEPS.length - 1 && (
                                                <div className="mx-1 flex items-center">
                                                    <div className="relative h-px w-8 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                                                        <motion.div
                                                            className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-emerald-500 to-teal-500"
                                                            initial={{
                                                                width: 0,
                                                            }}
                                                            animate={{
                                                                width:
                                                                    currentStep >
                                                                    step.id
                                                                        ? '100%'
                                                                        : '0%',
                                                            }}
                                                            transition={{
                                                                duration: 0.35,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Plan Badge */}
                            <div className="flex items-center gap-3">
                                <Badge className="border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-700 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
                                    <Zap className="mr-1.5 h-3.5 w-3.5" />
                                    <span className="font-semibold">
                                        Plan {plan.name}
                                    </span>
                                </Badge>
                            </div>
                        </div>

                        {/* Mobile Progress */}
                        <div className="pb-4 lg:hidden">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                        {(() => {
                                            const CurrentIcon =
                                                STEPS[currentStep - 1]?.icon;

                                            return CurrentIcon ? (
                                                <CurrentIcon className="h-4 w-4" />
                                            ) : null;
                                        })()}
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                            {STEPS[currentStep - 1]?.name}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Étape {currentStep} sur{' '}
                                            {STEPS.length}
                                        </p>
                                    </div>
                                </div>

                                <Badge
                                    variant="outline"
                                    className="rounded-full border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                                >
                                    {Math.round(
                                        (currentStep / STEPS.length) * 100,
                                    )}
                                    %
                                </Badge>
                            </div>

                            <div className="relative h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                                <motion.div
                                    className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-emerald-500 to-teal-600 shadow-sm"
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: `${(currentStep / STEPS.length) * 100}%`,
                                    }}
                                    transition={{
                                        duration: 0.4,
                                        ease: 'easeInOut',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <AnimatePresence mode="wait">
                            {/* =========== ÉTAPE 1 : IDENTITÉ =============== */}
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -24 }}
                                    transition={{ duration: 0.35 }}
                                    className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/20"
                                >
                                    {/* Header */}
                                    <div className="border-b border-slate-100 bg-linear-to-r from-emerald-50 via-white to-white px-6 py-6 dark:border-slate-800 dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
                                                <Store className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="mb-2 flex items-center gap-3">
                                                    <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
                                                        Étape 1 sur 5
                                                    </Badge>
                                                </div>
                                                <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                                                    Identité de la boutique
                                                </h2>
                                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                    Définissez le nom commercial
                                                    et l'adresse web de votre
                                                    boutique.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-8 p-6">
                                        {/* Shop Name */}
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="shop_name"
                                                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                                            >
                                                Nom de la boutique
                                                <span className="ml-1 text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <div className="relative">
                                                <Store className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                                <Input
                                                    id="shop_name"
                                                    value={data.shop_name}
                                                    onChange={(e) =>
                                                        setData(
                                                            'shop_name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Ma Boutique Artisanale"
                                                    required
                                                    className="h-12 rounded-2xl border-slate-200 bg-white pr-10 pl-12 text-sm shadow-sm transition-all duration-200 placeholder:text-slate-400 focus-visible:border-emerald-500 focus-visible:ring-4 focus-visible:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900"
                                                />
                                                {data.shop_name.length >= 3 && (
                                                    <CheckCircle className="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-emerald-500" />
                                                )}
                                            </div>
                                            {errors.shop_name && (
                                                <p className="flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.shop_name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Shop Slug */}
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="shop_slug"
                                                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                                            >
                                                Adresse web
                                                <span className="ml-1 text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900">
                                                <div className="flex">
                                                    <div className="relative flex-1">
                                                        <Globe className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                                        <Input
                                                            id="shop_slug"
                                                            value={
                                                                data.shop_slug
                                                            }
                                                            onChange={(e) => {
                                                                setSlugManuallyEdited(
                                                                    true,
                                                                );
                                                                setData(
                                                                    'shop_slug',
                                                                    cleanSlug(
                                                                        e.target
                                                                            .value,
                                                                    ),
                                                                );
                                                            }}
                                                            placeholder="ma-boutique"
                                                            required
                                                            className="h-12 rounded-none border-0 bg-transparent pr-12 pl-12 shadow-none focus-visible:ring-0"
                                                        />
                                                        <div className="absolute top-1/2 right-4 -translate-y-1/2">
                                                            {slugChecking ? (
                                                                <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                                                            ) : slugStatus ===
                                                              'available' ? (
                                                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                                                            ) : slugStatus ===
                                                              'unavailable' ? (
                                                                <XCircle className="h-4 w-4 text-red-500" />
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center border-l border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
                                                        .
                                                        {
                                                            window.location
                                                                .hostname
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status */}
                                            {slugStatus === 'available' && (
                                                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
                                                    <CheckCircle className="h-4 w-4" />
                                                    Cette adresse est
                                                    disponible.
                                                </div>
                                            )}
                                            {slugErrors.map((error) => (
                                                <p
                                                    key={error}
                                                    className="flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400"
                                                >
                                                    <AlertCircle className="h-4 w-4" />
                                                    {error}
                                                </p>
                                            ))}
                                            {errors.shop_slug && (
                                                <p className="flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.shop_slug}
                                                </p>
                                            )}
                                            {slugSuggestions.length > 0 && (
                                                <div className="space-y-2 pt-2">
                                                    <p className="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                                                        Suggestions disponibles
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {slugSuggestions.map(
                                                            (suggestion) => (
                                                                <button
                                                                    key={
                                                                        suggestion
                                                                    }
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setSlugManuallyEdited(
                                                                            true,
                                                                        );
                                                                        setData(
                                                                            'shop_slug',
                                                                            suggestion,
                                                                        );
                                                                    }}
                                                                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300"
                                                                >
                                                                    {suggestion}
                                                                </button>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Footer */}
                                        <div className="flex justify-end border-t border-slate-100 pt-6 dark:border-slate-800">
                                            <Button
                                                type="button"
                                                size="lg"
                                                onClick={() =>
                                                    setCurrentStep((prev) =>
                                                        Math.min(prev + 1, 5),
                                                    )
                                                }
                                                className="h-12 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 px-6 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700"
                                            >
                                                Continuer
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* =========== ÉTAPE 2 : CONTACT ================ */}
                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -24 }}
                                    transition={{ duration: 0.35 }}
                                    className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/20"
                                >
                                    {/* Header */}
                                    <div className="border-b border-slate-100 bg-linear-to-r from-emerald-50 via-white to-white px-6 py-6 dark:border-slate-800 dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
                                                <Mail className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1">
                                                <Badge className="mb-2 border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
                                                    Étape 2 sur 5
                                                </Badge>
                                                <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                                                    Contact & localisation
                                                </h2>
                                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                    Configurez les informations
                                                    de contact et les paramètres
                                                    régionaux.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8 p-6">
                                        <div className="grid gap-6 md:grid-cols-2">
                                            {/* Email */}
                                            <div className="space-y-2">
                                                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                    Email
                                                    <span className="ml-1 text-red-500">
                                                        *
                                                    </span>
                                                </Label>
                                                <div className="relative">
                                                    <Mail className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                                    <Input
                                                        type="email"
                                                        value={
                                                            data.contact_email
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                'contact_email',
                                                                e.target.value,
                                                            )
                                                        }
                                                        required
                                                        className="h-12 rounded-2xl border-slate-200 bg-white pl-12 shadow-sm focus-visible:border-emerald-500 focus-visible:ring-4 focus-visible:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900"
                                                    />
                                                </div>
                                                {errors.contact_email && (
                                                    <p className="flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors.contact_email}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Password (seul, sans confirmation) */}
                                            <div className="space-y-2">
                                                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                    Mot de passe
                                                    <span className="ml-1 text-red-500">
                                                        *
                                                    </span>
                                                </Label>
                                                <Input
                                                    type="password"
                                                    value={data.password}
                                                    onChange={(e) =>
                                                        setData(
                                                            'password',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="••••••••"
                                                    required
                                                    className="h-12 rounded-2xl border-slate-200 bg-white shadow-sm focus-visible:border-emerald-500 focus-visible:ring-4 focus-visible:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900"
                                                />
                                                {errors.password && (
                                                    <p className="flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors.password}
                                                    </p>
                                                )}
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    Minimum 8 caractères
                                                </p>
                                            </div>
                                            {/* Champ password_confirmation supprimé */}
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between border-t border-slate-100 pt-6 dark:border-slate-800">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="lg"
                                                onClick={() =>
                                                    setCurrentStep(1)
                                                }
                                                className="h-12 rounded-2xl"
                                            >
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Retour
                                            </Button>
                                            <Button
                                                type="button"
                                                size="lg"
                                                onClick={() =>
                                                    setCurrentStep((prev) =>
                                                        Math.min(prev + 1, 5),
                                                    )
                                                }
                                                className="h-12 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 px-6 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700"
                                            >
                                                Continuer
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* =========== ÉTAPE 3 : DOCUMENTS LÉGAUX ======= */}
                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -24 }}
                                    transition={{ duration: 0.35 }}
                                    className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/90 shadow-[0_20px_80px_-20px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90"
                                >
                                    {/* Header */}
                                    <div className="border-b border-slate-100 bg-linear-to-r from-emerald-50 via-white to-teal-50 px-8 py-7 dark:border-slate-800 dark:from-emerald-950/20 dark:via-slate-900 dark:to-teal-950/20">
                                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="flex items-start gap-4">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
                                                    <FileCheck className="h-7 w-7" />
                                                </div>
                                                <div>
                                                    <div className="mb-2 flex items-center gap-3">
                                                        <Badge className="border-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                                            Étape 3 sur 5
                                                        </Badge>
                                                    </div>
                                                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                                        Documents légaux{' '}
                                                        <span className="text-sm font-normal text-slate-500">
                                                            (optionnel)
                                                        </span>
                                                    </h2>
                                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                                                        Vous pouvez renseigner
                                                        vos documents maintenant
                                                        ou après la création de
                                                        la boutique.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                                                <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                                    <ShieldCheck className="h-4 w-4" />
                                                    Vérification sécurisée
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-8 p-8">
                                        {/* Forme juridique */}
                                        <div className="rounded-3xl border border-slate-200/70 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-950/30">
                                            <Label className="mb-3 block text-sm font-semibold text-slate-900 dark:text-white">
                                                Forme juridique
                                                <span className="ml-1 text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Select
                                                value={data.forme_juridique}
                                                onValueChange={(v) => {
                                                    setData(
                                                        'forme_juridique',
                                                        v,
                                                    );
                                                    setData(
                                                        'legal_documents',
                                                        {},
                                                    );
                                                }}
                                            >
                                                <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white shadow-sm transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900">
                                                    <SelectValue placeholder="Sélectionnez votre forme juridique" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95">
                                                    <SelectItem value="societe_commerciale">
                                                        Société commerciale
                                                        (RCCM)
                                                    </SelectItem>
                                                    <SelectItem value="petit_commercant">
                                                        Petit commerçant
                                                        individuel (Patente)
                                                    </SelectItem>
                                                    <SelectItem value="organisation_sans_but_lucratif">
                                                        Organisation sans but
                                                        lucratif (ASBL/ONG)
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Documents (obligatoires + facultatifs) */}
                                        <div className="space-y-4">
                                            {selectedLegalDocuments.map(
                                                (doc) => (
                                                    <DocumentCard
                                                        key={doc.id}
                                                        doc={doc}
                                                        data={data}
                                                        setData={setData}
                                                    />
                                                ),
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="border-t border-slate-100 bg-slate-50/80 px-8 py-6 dark:border-slate-800 dark:bg-slate-950/40">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="lg"
                                                onClick={() =>
                                                    setCurrentStep(2)
                                                }
                                                className="h-12 rounded-2xl"
                                            >
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Retour
                                            </Button>
                                            <Button
                                                type="button"
                                                size="lg"
                                                onClick={() =>
                                                    setCurrentStep((prev) =>
                                                        Math.min(prev + 1, 5),
                                                    )
                                                }
                                                className="h-12 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 px-8 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-700 hover:to-teal-700"
                                            >
                                                Continuer
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ========== ÉTAPE 4 : APPARENCE ================= */}
                            {currentStep === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -24 }}
                                    transition={{ duration: 0.35 }}
                                    className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/90 shadow-[0_20px_80px_-20px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90"
                                >
                                    {/* ... (contenu inchangé) ... */}
                                    {/* Header */}
                                    <div className="border-b border-slate-100 bg-linear-to-r from-violet-50 via-white to-pink-50 px-8 py-7 dark:border-slate-800 dark:from-violet-950/20 dark:via-slate-900 dark:to-pink-950/20">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-linear-to-br from-violet-500 to-pink-600 text-white shadow-lg shadow-violet-500/25">
                                                <Palette className="h-7 w-7" />
                                            </div>
                                            <div>
                                                <Badge className="mb-2 border-0 bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
                                                    Étape 4 sur 5
                                                </Badge>
                                                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                                    Apparence & réseaux sociaux
                                                </h2>
                                                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                                                    Personnalisez l’identité
                                                    visuelle de votre boutique.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-8 p-8">
                                        {/* Logo */}
                                        <div className="rounded-3xl border border-slate-200/70 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-950/30">
                                            <Label className="mb-4 block text-sm font-semibold text-slate-900 dark:text-white">
                                                Logo de la boutique
                                            </Label>
                                            <div className="flex flex-col gap-6 md:flex-row md:items-center">
                                                <div className="relative h-28 w-28 overflow-hidden rounded-3xl border-2 border-dashed border-slate-300 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                                                    {logoPreview ? (
                                                        <img
                                                            src={logoPreview}
                                                            alt="Logo"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                                                            <Camera className="h-9 w-9" />
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={
                                                            handleLogoChange
                                                        }
                                                        className="absolute inset-0 cursor-pointer opacity-0"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="font-semibold text-slate-900 dark:text-white">
                                                        Téléchargez votre logo
                                                    </p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                                        Format recommandé : 500
                                                        × 500 px. PNG, JPG ou
                                                        WebP. Taille maximale :
                                                        2 Mo.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Social Inputs */}
                                        <div className="grid gap-6 sm:grid-cols-2">
                                            {[
                                                [
                                                    'Facebook',
                                                    data.facebook_url,
                                                    (v: string) =>
                                                        setData(
                                                            'facebook_url',
                                                            v,
                                                        ),
                                                ],
                                                [
                                                    'Instagram',
                                                    data.instagram_url,
                                                    (v: string) =>
                                                        setData(
                                                            'instagram_url',
                                                            v,
                                                        ),
                                                ],
                                                [
                                                    'Twitter / X',
                                                    data.twitter_url,
                                                    (v: string) =>
                                                        setData(
                                                            'twitter_url',
                                                            v,
                                                        ),
                                                ],
                                                [
                                                    'YouTube',
                                                    data.youtube_url,
                                                    (v: string) =>
                                                        setData(
                                                            'youtube_url',
                                                            v,
                                                        ),
                                                ],
                                                [
                                                    'TikTok',
                                                    data.tiktok_url,
                                                    (v: string) =>
                                                        setData(
                                                            'tiktok_url',
                                                            v,
                                                        ),
                                                ],
                                            ].map(
                                                ([label, value, onChange]) => (
                                                    <SocialInput
                                                        key={label as string}
                                                        label={label as string}
                                                        value={value as string}
                                                        onChange={
                                                            onChange as (
                                                                v: string,
                                                            ) => void
                                                        }
                                                    />
                                                ),
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="border-t border-slate-100 bg-slate-50/80 px-8 py-6 dark:border-slate-800 dark:bg-slate-950/40">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="lg"
                                                onClick={() =>
                                                    setCurrentStep(3)
                                                }
                                                className="h-12 rounded-2xl"
                                            >
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Retour
                                            </Button>
                                            <Button
                                                type="button"
                                                size="lg"
                                                onClick={() =>
                                                    setCurrentStep((prev) =>
                                                        Math.min(prev + 1, 5),
                                                    )
                                                }
                                                className="h-12 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 px-8 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-700 hover:to-teal-700"
                                            >
                                                Continuer
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ========== ÉTAPE 5 : RÉCAPITULATIF & VALIDATION ================== */}
                            {currentStep === 5 && (
                                <motion.div
                                    key="step5"
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -24 }}
                                    transition={{ duration: 0.35 }}
                                    className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/90 shadow-[0_20px_80px_-20px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90"
                                >
                                    {/* Header */}
                                    <div className="border-b border-slate-100 bg-linear-to-r from-amber-50 via-white to-orange-50 px-8 py-7 dark:border-slate-800 dark:from-amber-950/20 dark:via-slate-900 dark:to-orange-950/20">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-linear-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25">
                                                <Sparkles className="h-7 w-7" />
                                            </div>
                                            <div>
                                                <Badge className="mb-2 border-0 bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                                                    Étape 5 sur 5
                                                </Badge>
                                                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                                    Récapitulatif & validation
                                                </h2>
                                                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                                                    Vérifiez vos informations
                                                    avant de finaliser la
                                                    création de votre boutique.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-8 p-8">
                                        {/* Summary */}
                                        <div className="rounded-3xl border border-slate-200/70 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-950/30">
                                            <h3 className="mb-5 text-sm font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                                                Résumé de votre configuration
                                            </h3>
                                            <dl className="space-y-4">
                                                {[
                                                    [
                                                        'Plan',
                                                        `${plan.name} (${plan.formatted_price})`,
                                                    ],
                                                    [
                                                        'Nom',
                                                        data.shop_name || '—',
                                                    ],
                                                    [
                                                        'Adresse',
                                                        `${data.shop_slug}.${window.location.hostname}`,
                                                    ],
                                                    [
                                                        'Email',
                                                        data.contact_email ||
                                                            '—',
                                                    ],
                                                    [
                                                        'Devise',
                                                        data.currency || '—',
                                                    ],
                                                    [
                                                        'Langue',
                                                        selectedLanguage?.name ||
                                                            data.language,
                                                    ],
                                                ].map(([label, value]) => (
                                                    <div
                                                        key={label}
                                                        className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 dark:bg-slate-900"
                                                    >
                                                        <dt className="text-sm text-slate-500 dark:text-slate-400">
                                                            {label}
                                                        </dt>
                                                        <dd className="text-sm font-semibold text-slate-900 dark:text-white">
                                                            {value}
                                                        </dd>
                                                    </div>
                                                ))}
                                            </dl>
                                        </div>

                                        {/* Terms */}
                                        <div className="rounded-3xl border border-slate-200/70 bg-white p-6 dark:border-slate-800 dark:bg-slate-950/30">
                                            <div className="flex items-start gap-4">
                                                <input
                                                    type="checkbox"
                                                    id="terms"
                                                    checked={data.accept_terms}
                                                    onChange={(e) =>
                                                        setData(
                                                            'accept_terms',
                                                            e.target.checked,
                                                        )
                                                    }
                                                    className="mt-1 h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                                />
                                                <label
                                                    htmlFor="terms"
                                                    className="text-sm leading-6 text-slate-600 dark:text-slate-400"
                                                >
                                                    J’accepte les{' '}
                                                    <Link
                                                        href="/conditions"
                                                        target="_blank"
                                                        className="font-semibold text-emerald-600 hover:text-emerald-700"
                                                    >
                                                        conditions générales
                                                    </Link>{' '}
                                                    et la{' '}
                                                    <Link
                                                        href="/confidentialite"
                                                        target="_blank"
                                                        className="font-semibold text-emerald-600 hover:text-emerald-700"
                                                    >
                                                        politique de
                                                        confidentialité
                                                    </Link>
                                                    .
                                                </label>
                                            </div>
                                        </div>

                                        {/* Security Notice */}
                                        <div className="flex items-center justify-center gap-3 rounded-3xl border border-emerald-200 bg-emerald-50 px-6 py-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                                            <ShieldCheck className="h-5 w-5 text-emerald-600" />
                                            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                                Vos données sont protégées par
                                                chiffrement SSL.
                                            </span>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="border-t border-slate-100 bg-slate-50/80 px-8 py-6 dark:border-slate-800 dark:bg-slate-950/40">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="lg"
                                                onClick={() =>
                                                    setCurrentStep(4)
                                                }
                                                className="h-12 rounded-2xl"
                                            >
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Retour
                                            </Button>
                                            <Button
                                                type="submit"
                                                size="lg"
                                                disabled={
                                                    processing || !isFormValid()
                                                }
                                                className="h-12 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 px-8 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50"
                                            >
                                                {processing ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Création en cours...
                                                    </>
                                                ) : plan.price > 0 ? (
                                                    <>
                                                        <ShieldCheck className="mr-2 h-4 w-4" />
                                                        Payer{' '}
                                                        {plan.formatted_price}{' '}
                                                        et créer
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="mr-2 h-4 w-4" />
                                                        Créer ma boutique
                                                        gratuitement
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>
            </div>
        </>
    );
}

// ------------------------------------------------------------------
// Composant DocumentCard modernisé
// ------------------------------------------------------------------
function DocumentCard({
    doc,
    data,
    setData,
}: {
    doc: TypeDocument;
    data: any;
    setData: (field: string, value: any) => void;
}) {
    const docData = data.legal_documents?.[doc.code] || {
        numero: '',
        date_delivrance: '',
        date_expiration: '',
    };

    const updateDoc = (field: string, value: string) =>
        setData('legal_documents', {
            ...data.legal_documents,
            [doc.code]: {
                ...docData,
                [field]: value,
            },
        });

    return (
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90">
            {/* Glow decoratif */}
            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500" />
            <div className="p-6">
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm dark:bg-emerald-950/40 dark:text-emerald-400">
                        <FileCheck className="h-6 w-6" />
                    </div>
                    {/* Content */}
                    <div className="min-w-0 flex-1 space-y-5">
                        {/* Header */}
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
                                    {doc.nom}
                                </h4>
                                {doc.est_obligatoire && (
                                    <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-red-600 uppercase dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
                                        Obligatoire
                                    </span>
                                )}
                            </div>
                            {doc.description && (
                                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                    {doc.description}
                                </p>
                            )}
                        </div>
                        {/* Fields */}
                        <div className="grid gap-4 xl:grid-cols-3">
                            {/* Numéro */}
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                                    Numéro du document
                                </Label>
                                <Input
                                    type="text"
                                    value={docData.numero}
                                    onChange={(e) =>
                                        updateDoc('numero', e.target.value)
                                    }
                                    placeholder="Ex. RCCM-2025-001"
                                    className="h-12 rounded-2xl border-slate-200 bg-white/80 shadow-sm transition-all duration-200 placeholder:text-slate-400 hover:border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-emerald-700 dark:focus:border-emerald-500"
                                />
                            </div>
                            {/* Date de délivrance */}
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                                    Date de délivrance
                                </Label>
                                <DatePickerField
                                    value={docData.date_delivrance}
                                    onChange={(v) =>
                                        updateDoc('date_delivrance', v)
                                    }
                                    placeholder="Sélectionner une date"
                                />
                            </div>
                            {/* Date d'expiration */}
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                                    Date d'expiration
                                </Label>
                                <DatePickerField
                                    value={docData.date_expiration}
                                    onChange={(v) =>
                                        updateDoc('date_expiration', v)
                                    }
                                    placeholder="Sélectionner une date"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ------------------------------------------------------------------
// Composant SocialInput modernisé
// ------------------------------------------------------------------
function SocialInput({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {label}
            </Label>
            <Input
                type="url"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={`https://${label
                    .toLowerCase()
                    .replace(' / x', '')}.com/votreboutique`}
                className="h-12 rounded-2xl border-slate-200 bg-white/80 px-4 shadow-sm transition-all duration-200 placeholder:text-slate-400 hover:border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-emerald-700 dark:focus:border-emerald-500"
            />
        </div>
    );
}

// ------------------------------------------------------------------
// DatePickerField modernisé
// ------------------------------------------------------------------
function DatePickerField({
    value,
    onChange,
    placeholder,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
}) {
    const [date, setDate] = useState<Date | undefined>(
        value ? new Date(value) : undefined,
    );
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setDate(value ? new Date(value) : undefined);
    }, [value]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className={cn(
                        `h-12 w-full justify-start rounded-2xl border-slate-200 bg-white/80 px-4 text-left font-medium shadow-sm transition-all duration-200 hover:border-emerald-300 hover:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-emerald-700 dark:hover:bg-slate-800 dark:focus:border-emerald-500`,
                        !date && 'text-slate-400 dark:text-slate-500',
                    )}
                >
                    <CalendarIcon className="mr-3 h-4 w-4 text-emerald-500" />
                    {date ? (
                        <span className="truncate text-slate-900 dark:text-white">
                            {format(date, 'PPP', { locale: fr })}
                        </span>
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="w-auto rounded-2xl border border-slate-200 p-0 shadow-2xl dark:border-slate-800"
            >
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                        if (!d) {
                            return;
                        }

                        setDate(d);
                        onChange(format(d, 'yyyy-MM-dd'));
                        setOpen(false);
                    }}
                    initialFocus
                    locale={fr}
                />
            </PopoverContent>
        </Popover>
    );
}
