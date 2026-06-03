/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/pages/Shop/Addresses/Index.tsx
import type { PageProps } from '@inertiajs/core';
import { router, useForm, usePage, Head } from '@inertiajs/react';
import {
    MapPin,
    Plus,
    Check,
    Star,
    Home,
    Briefcase,
    Trash2,
    Sparkles,
    Phone,
    Globe,
    Building2,
    Landmark,
    CheckCircle2,
    PackageCheck,
    MapPinned,
    LoaderIcon,
    Pencil,
    ChevronDown,
    Search,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AppSidebar } from '@/components/app-sidebar';
import InputError from '@/components/input-error';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
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
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import getToastStyle from '@/lib/toast-style';
import { cn } from '@/lib/utils';
import tenant from '@/routes/tenant';

// ---------- Types ----------
interface Address {
    id: string;
    rue: string;
    complement?: string | null;
    code_postal: string;
    ville: string;
    pays: string;
    telephone?: string | null;
    type: 'facturation' | 'livraison';
    est_defaut: boolean;
    adresse_complete?: string;
}

type AddressFormData = {
    rue: string;
    complement?: string | null;
    code_postal: string;
    ville: string;
    pays: string;
    telephone?: string | null;
    type: 'facturation' | 'livraison';
    est_defaut: boolean;
};

interface Country {
    id: string | number;
    name: string;
    iso2?: string;
    phone_code?: string;
}

interface City {
    id: string | number;
    name: string;
    postal_code?: string;
}

interface Props extends PageProps {
    addresses: Address[];
    defaultCountry?: string; // ex: "République Démocratique du Congo"
    defaultPhoneCode?: string; // ex: "+243"
}

// ---------- Constantes (pays par défaut si non fourni) ----------
const FALLBACK_COUNTRY = 'République Démocratique du Congo';
const FALLBACK_PHONE_CODE = '+243';

// ---------- Page ----------
export default function ShopAddressesPage() {
    const { addresses, defaultCountry, defaultPhoneCode } =
        usePage<Props>().props;

    // États pour les listes de pays / villes
    const [countries, setCountries] = useState<Country[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [loadingCountries, setLoadingCountries] = useState(true);
    const [loadingCities, setLoadingCities] = useState(false);

    // ID de l'adresse en cours d'édition (null = création)
    const [editingId, setEditingId] = useState<string | null>(null);

    // Charger les pays au montage
    useEffect(() => {
        fetch(route('tenant.addresses.countries'))
            .then((res) => res.json())
            .then((data: Country[]) => {
                setCountries(data);
                setLoadingCountries(false);
            })
            .catch(() => setLoadingCountries(false));
    }, []);

    // Déterminer le pays initial (par défaut fourni par le backend ou fallback)
    const initialCountry = defaultCountry || FALLBACK_COUNTRY;

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm<AddressFormData>({
        rue: '',
        complement: '',
        code_postal: '',
        ville: '',
        pays: initialCountry,
        telephone: defaultPhoneCode || FALLBACK_PHONE_CODE,
        type: 'livraison',
        est_defaut: false,
    });

    // Charger les villes quand le pays change
    useEffect(() => {
        if (!data.pays) {
            return;
        }

        setLoadingCities(true);
        fetch(route('tenant.addresses.cities', encodeURIComponent(data.pays)))
            .then((res) => res.json())
            .then((cityList: City[]) => {
                setCities(cityList);
                setLoadingCities(false);
            })
            .catch(() => {
                setCities([]);
                setLoadingCities(false);
            });
    }, [data.pays]);

    // Lorsque l'utilisateur change de pays, on réinitialise ville et code postal
    const handleCountryChange = (countryName: string) => {
        setData({
            ...data,
            pays: countryName,
            ville: '',
            code_postal: '',
            // Mettre à jour l'indicatif téléphonique si dispo
            telephone:
                countries.find((c) => c.name === countryName)?.phone_code ||
                defaultPhoneCode ||
                FALLBACK_PHONE_CODE,
        });
    };

    // Quand une ville est sélectionnée, on peut pré-remplir le code postal
    const handleCityChange = (cityName: string) => {
        const city = cities.find((c) => c.name === cityName);
        setData('ville', cityName);

        if (city?.postal_code) {
            setData('code_postal', city.postal_code);
        }
    };

    // Supprimer une adresse
    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.preventDefault();

        if (confirm('Supprimer cette adresse ?')) {
            router.delete(route('tenant.addresses.destroy', id), {
                preserveScroll: true,
                showProgress: false,
                onSuccess: () =>
                    toast.success('Adresse supprimée', {
                        style: getToastStyle(),
                    }),
                onError: () =>
                    toast.error('Erreur lors de la suppression', {
                        style: getToastStyle('error'),
                    }),
            });
        }
    };

    // Définir comme adresse par défaut
    const handleSetDefault = (id: string) => {
        router.post(
            route('tenant.addresses.default', id),
            {},
            {
                preserveScroll: true,
                showProgress: false,
                onSuccess: () =>
                    toast.success('Adresse par défaut modifiée', {
                        style: getToastStyle(),
                    }),
            },
        );
    };

    // Passer en mode édition pour une adresse
    const startEdit = (address: Address) => {
        setEditingId(address.id);
        setData({
            rue: address.rue,
            complement: address.complement ?? '',
            code_postal: address.code_postal,
            ville: address.ville,
            pays: address.pays,
            telephone: address.telephone ?? '',
            type: address.type,
            est_defaut: address.est_defaut,
        });
    };

    // Annuler l'édition et repasser en mode création
    const cancelEdit = () => {
        setEditingId(null);
        reset();
        setData('pays', initialCountry);
        setData('telephone', defaultPhoneCode || FALLBACK_PHONE_CODE);
        setData('type', 'livraison');
    };

    // Soumission (création ou mise à jour)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const onSuccess = () => {
            reset();

            if (editingId) {
                setEditingId(null);
            }

            setData('pays', initialCountry);
            setData('telephone', defaultPhoneCode || FALLBACK_PHONE_CODE);
            setData('type', 'livraison');
            toast.success(
                editingId ? 'Adresse mise à jour' : 'Adresse enregistrée',
                { style: getToastStyle() },
            );
        };

        if (editingId) {
            put(route('tenant.addresses.update', editingId), {
                preserveScroll: true,
                showProgress: false,
                onSuccess,
                onError: () =>
                    toast.error('Veuillez vérifier les champs', {
                        style: getToastStyle('error'),
                    }),
            });
        } else {
            post(route('tenant.addresses.store'), {
                preserveScroll: true,
                showProgress: false,
                onSuccess,
                onError: () =>
                    toast.error('Veuillez vérifier les champs', {
                        style: getToastStyle('error'),
                    }),
            });
        }
    };

    const livraisonAddresses = addresses.filter((a) => a.type === 'livraison');
    const facturationAddresses = addresses.filter(
        (a) => a.type === 'facturation',
    );

    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <Head title="Mes adresses" />
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                    <div className="flex flex-1 flex-col gap-6 p-4 pt-6 md:p-6 md:pt-6">
                        {/* En-tête */}
                        <div className="relative overflow-hidden rounded-lg border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/70">
                            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent dark:from-emerald-500/10" />
                            <div className="relative z-10 flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between">
                                <div className="max-w-2xl">
                                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
                                        <MapPin className="h-4 w-4" />
                                        Gestion des adresses
                                    </div>
                                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white">
                                        Mes adresses
                                    </h1>
                                    <p className="mt-3 max-w-md text-slate-500 dark:text-slate-400">
                                        Gérez facilement vos adresses de
                                        livraison et de facturation.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
                                            <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                Total adresses
                                            </p>
                                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                                {addresses.length}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/30">
                                            <Home className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                Adresse principale
                                            </p>
                                            <p className="text-xl font-bold text-slate-900 dark:text-white">
                                                {addresses.find(
                                                    (a) => a.est_defaut,
                                                )?.ville ?? 'Aucune'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Grille principale */}
                        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                            {/* Liste des adresses */}
                            <div className="space-y-6">
                                {/* Livraison */}
                                <Card className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                                            <Home className="h-5 w-5 text-emerald-500" />
                                            Adresses de livraison
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {livraisonAddresses.length > 0 ? (
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                {livraisonAddresses.map(
                                                    (address) => (
                                                        <AdresseCard
                                                            key={address.id}
                                                            address={address}
                                                            onSetDefault={
                                                                handleSetDefault
                                                            }
                                                            onDelete={
                                                                handleDelete
                                                            }
                                                            onEdit={startEdit}
                                                            isEditing={
                                                                editingId ===
                                                                address.id
                                                            }
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
                                                <MapPin className="mx-auto h-8 w-8 text-slate-400" />
                                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                                    Aucune adresse de livraison
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Facturation */}
                                <Card className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                                            <Briefcase className="h-5 w-5 text-blue-500" />
                                            Adresses de facturation
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {facturationAddresses.length > 0 ? (
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                {facturationAddresses.map(
                                                    (address) => (
                                                        <AdresseCard
                                                            key={address.id}
                                                            address={address}
                                                            onSetDefault={
                                                                handleSetDefault
                                                            }
                                                            onDelete={
                                                                handleDelete
                                                            }
                                                            onEdit={startEdit}
                                                            isEditing={
                                                                editingId ===
                                                                address.id
                                                            }
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
                                                <Briefcase className="mx-auto h-8 w-8 text-slate-400" />
                                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                                    Aucune adresse de
                                                    facturation
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Formulaire (création / modification) */}
                            <Card className="h-fit rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                                        {editingId ? (
                                            <>
                                                <Pencil className="h-5 w-5 text-amber-500" />
                                                Modifier l’adresse
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-5 w-5 text-emerald-500" />
                                                Nouvelle adresse
                                            </>
                                        )}
                                    </CardTitle>
                                    {editingId && (
                                        <button
                                            type="button"
                                            onClick={cancelEdit}
                                            className="mt-1 text-sm text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                            Annuler et créer une nouvelle
                                            adresse
                                        </button>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-5"
                                    >
                                        {/* Rue */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Adresse
                                            </label>
                                            <div className="relative">
                                                <MapPin className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                                <Input
                                                    value={data.rue}
                                                    onChange={(e) =>
                                                        setData(
                                                            'rue',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Ex : 24 Avenue de la Paix"
                                                    className="h-12 rounded-2xl border-slate-200 pl-11 shadow-sm focus-visible:ring-emerald-500 dark:border-slate-700"
                                                />
                                            </div>
                                            <InputError message={errors.rue} />
                                        </div>

                                        {/* Complément */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Complément
                                            </label>
                                            <div className="relative">
                                                <Building2 className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                                <Input
                                                    value={
                                                        data.complement ?? ''
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            'complement',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Appartement, étage..."
                                                    className="h-12 rounded-2xl border-slate-200 pl-11 shadow-sm dark:border-slate-700"
                                                />
                                            </div>
                                            <InputError
                                                message={errors.complement}
                                            />
                                        </div>

                                        {/* Pays (combobox recherchable) */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Pays
                                            </label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            'h-12 w-full justify-start rounded-2xl border-slate-200 pl-11 text-left font-normal shadow-sm',
                                                            'dark:border-slate-700',
                                                            !data.pays &&
                                                                'text-muted-foreground',
                                                        )}
                                                        disabled={
                                                            loadingCountries
                                                        }
                                                    >
                                                        <Globe className="absolute left-4 h-4 w-4 text-slate-400" />
                                                        {data.pays
                                                            ? countries.find(
                                                                  (c) =>
                                                                      c.name ===
                                                                      data.pays,
                                                              )?.name
                                                            : 'Sélectionnez un pays'}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Rechercher un pays..." />
                                                        <CommandList>
                                                            <CommandEmpty>
                                                                Aucun pays
                                                                trouvé.
                                                            </CommandEmpty>
                                                            <CommandGroup>
                                                                {countries.map(
                                                                    (c) => (
                                                                        <CommandItem
                                                                            key={
                                                                                c.id
                                                                            }
                                                                            value={
                                                                                c.name
                                                                            }
                                                                            onSelect={(
                                                                                currentValue,
                                                                            ) => {
                                                                                handleCountryChange(
                                                                                    currentValue,
                                                                                );
                                                                            }}
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    'mr-2 h-4 w-4',
                                                                                    data.pays ===
                                                                                        c.name
                                                                                        ? 'opacity-100'
                                                                                        : 'opacity-0',
                                                                                )}
                                                                            />
                                                                            {
                                                                                c.name
                                                                            }
                                                                        </CommandItem>
                                                                    ),
                                                                )}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <InputError message={errors.pays} />
                                        </div>

                                        {/* Ville (combobox recherchable) */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Ville
                                            </label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            'h-12 w-full justify-start rounded-2xl border-slate-200 pl-11 text-left font-normal shadow-sm',
                                                            'dark:border-slate-700',
                                                            !data.ville &&
                                                                'text-muted-foreground',
                                                        )}
                                                        disabled={
                                                            loadingCities ||
                                                            !data.pays
                                                        }
                                                    >
                                                        <MapPinned className="absolute left-4 h-4 w-4 text-slate-400" />
                                                        {data.ville
                                                            ? cities.find(
                                                                  (c) =>
                                                                      c.name ===
                                                                      data.ville,
                                                              )?.name
                                                            : loadingCities
                                                              ? 'Chargement...'
                                                              : 'Sélectionnez une ville'}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Rechercher une ville..." />
                                                        <CommandList>
                                                            <CommandEmpty>
                                                                Aucune ville
                                                                trouvée.
                                                            </CommandEmpty>
                                                            <CommandGroup>
                                                                {cities.map(
                                                                    (city) => (
                                                                        <CommandItem
                                                                            key={
                                                                                city.id
                                                                            }
                                                                            value={
                                                                                city.name
                                                                            }
                                                                            onSelect={(
                                                                                currentValue,
                                                                            ) => {
                                                                                handleCityChange(
                                                                                    currentValue,
                                                                                );
                                                                            }}
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    'mr-2 h-4 w-4',
                                                                                    data.ville ===
                                                                                        city.name
                                                                                        ? 'opacity-100'
                                                                                        : 'opacity-0',
                                                                                )}
                                                                            />
                                                                            {
                                                                                city.name
                                                                            }
                                                                            {city.postal_code && (
                                                                                <span className="ml-auto text-xs text-slate-400">
                                                                                    {
                                                                                        city.postal_code
                                                                                    }
                                                                                </span>
                                                                            )}
                                                                        </CommandItem>
                                                                    ),
                                                                )}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <InputError
                                                message={errors.ville}
                                            />
                                        </div>

                                        {/* Code postal */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Code postal
                                            </label>
                                            <div className="relative">
                                                <Landmark className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                                <Input
                                                    value={data.code_postal}
                                                    onChange={(e) =>
                                                        setData(
                                                            'code_postal',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Code postal"
                                                    className="h-12 rounded-2xl border-slate-200 pl-11 shadow-sm dark:border-slate-700"
                                                />
                                            </div>
                                            <InputError
                                                message={errors.code_postal}
                                            />
                                        </div>

                                        {/* Téléphone */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Téléphone
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                                <Input
                                                    value={data.telephone ?? ''}
                                                    onChange={(e) =>
                                                        setData(
                                                            'telephone',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder={
                                                        countries.find(
                                                            (c) =>
                                                                c.name ===
                                                                data.pays,
                                                        )?.phone_code
                                                            ? `${countries.find((c) => c.name === data.pays)!.phone_code} ...`
                                                            : 'Téléphone'
                                                    }
                                                    className="h-12 rounded-2xl border-slate-200 pl-11 shadow-sm dark:border-slate-700"
                                                />
                                            </div>
                                            <InputError
                                                message={errors.telephone}
                                            />
                                        </div>

                                        {/* Type (sélecteur moderne) */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setData('type', 'livraison')
                                                }
                                                className={cn(
                                                    'rounded-2xl border p-4 text-left transition-all',
                                                    data.type === 'livraison'
                                                        ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10 dark:bg-emerald-950/20'
                                                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-700',
                                                )}
                                            >
                                                <Home className="mb-2 h-5 w-5 text-emerald-500" />
                                                <p className="font-semibold text-slate-900 dark:text-white">
                                                    Livraison
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    Pour recevoir vos colis
                                                </p>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setData(
                                                        'type',
                                                        'facturation',
                                                    )
                                                }
                                                className={cn(
                                                    'rounded-2xl border p-4 text-left transition-all',
                                                    data.type === 'facturation'
                                                        ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10 dark:bg-blue-950/20'
                                                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-700',
                                                )}
                                            >
                                                <Briefcase className="mb-2 h-5 w-5 text-blue-500" />
                                                <p className="font-semibold text-slate-900 dark:text-white">
                                                    Facturation
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    Pour vos factures
                                                </p>
                                            </button>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className={cn(
                                                'h-12 w-full cursor-pointer rounded-2xl text-base font-semibold text-white transition-all hover:scale-[1.02]',
                                                editingId
                                                    ? 'bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                                                    : 'bg-linear-to-r from-emerald-600 via-teal-500 to-cyan-500 hover:from-emerald-700 hover:to-cyan-600',
                                            )}
                                        >
                                            {processing ? (
                                                <>
                                                    <LoaderIcon className="h-6 w-6 animate-spin" />
                                                    {editingId
                                                        ? 'Mise à jour...'
                                                        : 'Enregistrement...'}
                                                </>
                                            ) : (
                                                <>
                                                    {editingId ? (
                                                        <>
                                                            Mettre à jour
                                                            l’adresse
                                                            <CheckCircle2 className="ml-2 h-5 w-5" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            Enregistrer
                                                            l’adresse
                                                            <PackageCheck className="ml-2 h-5 w-5" />
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

// ---------- Composant Carte Adresse (extrait pour plus de clarté) ----------
function AdresseCard({
    address,
    onSetDefault,
    onDelete,
    onEdit,
    isEditing,
}: {
    address: Address;
    onSetDefault: (id: string) => void;
    onDelete: (id: string, e: React.MouseEvent) => void;
    onEdit: (address: Address) => void;
    isEditing: boolean;
}) {
    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/90 p-6 shadow-sm transition-all duration-300',
                'hover:-translate-y-1 hover:border-emerald-200 hover:shadow-2xl dark:border-slate-800/60 dark:bg-slate-900/80',
                isEditing && 'ring-2 ring-amber-400 dark:ring-amber-500',
            )}
        >
            {/* Glow */}
            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/0 via-emerald-500/0 to-cyan-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Badge principal + boutons d'action */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
                {address.est_defaut && (
                    <div className="flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-white shadow-lg">
                        <Star className="h-3.5 w-3.5 fill-white" />
                        Principale
                    </div>
                )}
                {/* Bouton Modifier (toujours visible) */}
                <button
                    onClick={() => onEdit(address)}
                    className={cn(
                        'rounded-full p-2 transition-colors',
                        'text-slate-400 hover:bg-amber-50 hover:text-amber-500',
                        'dark:hover:bg-slate-800 dark:hover:text-amber-400',
                        isEditing &&
                            'bg-amber-50 text-amber-500 dark:bg-slate-800',
                    )}
                    title="Modifier cette adresse"
                >
                    <Pencil className="h-4 w-4" />
                </button>
            </div>

            <div className="relative z-10">
                {/* Icône type */}
                <div className="mb-5 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className={cn(
                                'flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg',
                                address.type === 'livraison'
                                    ? 'bg-linear-to-br from-emerald-500 to-teal-500'
                                    : 'bg-linear-to-br from-blue-500 to-indigo-500',
                            )}
                        >
                            {address.type === 'livraison' ? (
                                <Home className="h-6 w-6 text-white" />
                            ) : (
                                <Briefcase className="h-6 w-6 text-white" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">
                                {address.type === 'livraison'
                                    ? 'Adresse de livraison'
                                    : 'Adresse de facturation'}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {address.ville}, {address.pays}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <MapPinned className="mt-0.5 h-4 w-4 text-slate-400" />
                        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                            {address.adresse_complete ??
                                `${address.rue}, ${address.code_postal} ${address.ville}, ${address.pays}`}
                        </p>
                    </div>
                    {address.telephone && (
                        <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-slate-400" />
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {address.telephone}
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                    {!address.est_defaut && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-2xl border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
                            onClick={() => onSetDefault(address.id)}
                        >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Définir principale
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-2xl border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400"
                        onClick={(e) => onDelete(address.id, e)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                    </Button>
                </div>
            </div>
        </div>
    );
}
