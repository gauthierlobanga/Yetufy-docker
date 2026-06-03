/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
// resources/js/Components/AddressModal.tsx
import {
    Loader2,
    MapPin,
    Phone,
    Building,
    Home,
    CheckCircle2,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface AddressFormData {
    rue: string;
    complement: string;
    code_postal: string;
    ville: string;
    pays: string;
    telephone: string;
    type: 'facturation' | 'livraison';
    est_defaut: boolean;
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: AddressFormData) => void;
    initialData?: Partial<AddressFormData>;
    isSaving?: boolean;
}

const defaultData: AddressFormData = {
    rue: '',
    complement: '',
    code_postal: '',
    ville: '',
    pays: 'CD',
    telephone: '',
    type: 'livraison',
    est_defaut: false,
};

export default function AddressModal({
    open,
    onOpenChange,
    onSave,
    initialData,
    isSaving = false,
}: Props) {
    const [form, setForm] = useState<AddressFormData>({
        ...defaultData,
        ...initialData,
    });
    const [countries, setCountries] = useState<
        { id: number; iso2: string; name: string; emoji: string }[]
    >([]);
    const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
    const [loadingCities, setLoadingCities] = useState(false);

    // Détection automatique du pays si non fourni
    useEffect(() => {
        if (!initialData?.pays) {
            const parts = navigator.language.split('-');

            if (parts.length === 2) {
                const countryCode = parts[1].toUpperCase();
                setForm((prev) => ({ ...prev, pays: countryCode }));
            }
        }
    }, [initialData]);

    // Charger les pays
    useEffect(() => {
        fetch('/api/countries')
            .then((res) => res.json())
            .then((data) => setCountries(data))
            .catch(console.error);
    }, []);

    // Charger les villes quand le pays change
    useEffect(() => {
        if (!form.pays) {
            setCities([]);

            return;
        }

        setLoadingCities(true);
        const country = countries.find((c) => c.iso2 === form.pays);

        if (!country) {
            setLoadingCities(false);

            return;
        }

        fetch(`/api/countries/${country.id}/cities`)
            .then((res) => res.json())
            .then((data) => {
                setCities(data);
                setLoadingCities(false);
            })
            .catch(() => setLoadingCities(false));
    }, [form.pays, countries]);

    const handleCountryChange = (code: string) => {
        setForm((prev) => ({ ...prev, pays: code, ville: '' }));
    };

    const handleSubmit = () => {
        onSave(form);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl overflow-hidden rounded-3xl border-0 bg-white/95 p-0 shadow-2xl backdrop-blur-xl dark:bg-slate-900/95">
                <DialogHeader className="px-8 pt-8 pb-2">
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
                        <MapPin className="h-5 w-5 text-emerald-500" />
                        {initialData?.rue
                            ? "Modifier l'adresse"
                            : 'Nouvelle adresse'}
                    </DialogTitle>
                </DialogHeader>

                <div className="max-h-[70vh] space-y-6 overflow-y-auto px-8 py-4">
                    {/* Rue */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="rue"
                            className="text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                            Rue <span className="text-rose-500">*</span>
                        </Label>
                        <div className="relative">
                            <MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                id="rue"
                                value={form.rue}
                                onChange={(e) =>
                                    setForm({ ...form, rue: e.target.value })
                                }
                                placeholder="Ex: 12 Avenue de la Paix"
                                className="h-11 rounded-xl border-slate-200 bg-white/80 pr-4 pl-9 text-sm shadow-sm backdrop-blur-sm transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800/80"
                            />
                        </div>
                    </div>

                    {/* Complément */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="complement"
                            className="text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                            Complément
                        </Label>
                        <div className="relative">
                            <Building className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                id="complement"
                                value={form.complement}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        complement: e.target.value,
                                    })
                                }
                                placeholder="Appartement, étage..."
                                className="h-11 rounded-xl border-slate-200 bg-white/80 pr-4 pl-9 text-sm shadow-sm backdrop-blur-sm transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800/80"
                            />
                        </div>
                    </div>

                    {/* Pays & Ville */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Pays <span className="text-rose-500">*</span>
                            </Label>
                            <Select
                                value={form.pays}
                                onValueChange={handleCountryChange}
                            >
                                <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800/80">
                                    <SelectValue placeholder="Choisir un pays" />
                                </SelectTrigger>
                                <SelectContent className="max-h-60 rounded-xl">
                                    {countries.map((country) => (
                                        <SelectItem
                                            key={country.id}
                                            value={country.iso2}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span>{country.emoji}</span>
                                                <span>{country.name}</span>
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Ville <span className="text-rose-500">*</span>
                            </Label>
                            {loadingCities ? (
                                <div className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-800/80">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Chargement...
                                </div>
                            ) : (
                                <Select
                                    value={form.ville}
                                    onValueChange={(ville) =>
                                        setForm({ ...form, ville })
                                    }
                                    disabled={!form.pays}
                                >
                                    <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800/80">
                                        <SelectValue placeholder="Choisir une ville" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-60 rounded-xl">
                                        {cities.map((city) => (
                                            <SelectItem
                                                key={city.id}
                                                value={city.name}
                                            >
                                                {city.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </div>

                    {/* Code postal */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="code_postal"
                            className="text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                            Code postal <span className="text-rose-500">*</span>
                        </Label>
                        <div className="relative">
                            <Home className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                id="code_postal"
                                value={form.code_postal}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        code_postal: e.target.value,
                                    })
                                }
                                placeholder="Code postal"
                                className="h-11 rounded-xl border-slate-200 bg-white/80 pr-4 pl-9 text-sm shadow-sm backdrop-blur-sm transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800/80"
                            />
                        </div>
                    </div>

                    {/* Téléphone */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Téléphone
                        </Label>
                        <PhoneInput
                            country={form.pays?.toLowerCase() ?? 'cd'}
                            value={form.telephone}
                            onChange={(phone) =>
                                setForm({ ...form, telephone: phone })
                            }
                            inputClass="!w-full !h-11 !rounded-xl !border-slate-200 !bg-white/80 !pl-12 !text-sm !shadow-sm !backdrop-blur-sm !transition-all focus:!border-emerald-500 focus:!ring-4 focus:!ring-emerald-500/10 dark:!border-slate-700 dark:!bg-slate-800/80"
                            buttonClass="!rounded-xl !border-slate-200 !bg-white/80 dark:!border-slate-700 dark:!bg-slate-800/80"
                            placeholder="+243 xxx xxx xxx"
                        />
                        <p className="text-xs text-slate-400">
                            Format international automatique.
                        </p>
                    </div>

                    {/* Type d'adresse */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Type d'adresse
                        </Label>
                        <Select
                            value={form.type}
                            onValueChange={(val) =>
                                setForm({
                                    ...form,
                                    type: val as 'facturation' | 'livraison',
                                })
                            }
                        >
                            <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800/80">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="livraison">
                                    Livraison
                                </SelectItem>
                                <SelectItem value="facturation">
                                    Facturation
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Défaut */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="est_defaut"
                            checked={form.est_defaut}
                            onCheckedChange={(checked) =>
                                setForm({
                                    ...form,
                                    est_defaut: checked === true,
                                })
                            }
                        />
                        <Label
                            htmlFor="est_defaut"
                            className="cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                            Définir comme adresse par défaut
                        </Label>
                    </div>
                </div>

                <DialogFooter className="border-t border-slate-200 px-8 py-6 dark:border-slate-800">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="rounded-xl border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:bg-white dark:border-slate-700 dark:bg-slate-800/80 dark:hover:bg-slate-800"
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-emerald-500 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition-all hover:from-emerald-700 hover:to-emerald-600 hover:shadow-lg disabled:opacity-50 dark:shadow-emerald-900/30"
                    >
                        {isSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <CheckCircle2 className="h-4 w-4" />
                        )}
                        {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
