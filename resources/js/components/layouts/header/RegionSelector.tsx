import { usePage, router } from '@inertiajs/react';
import { Globe } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from '@/components/ui/combobox';
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemTitle,
} from '@/components/ui/item';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from '@/components/ui/sheet';

interface Country {
    code: string;
    name: string;
    continent?: string;
    currency?: string;
    phone_code?: string;
}

interface Currency {
    code: string;
    name: string;
    symbol?: string;
}

interface Language {
    code: string;
    name: string;
}

export function RegionSelector() {
    const { props } = usePage();
    const {
        countries = [],
        currencies = [],
        languages = [],
        currentCountry,
        currentCurrency,
        currentLanguage,
    } = props as any;

    // Initialiser les valeurs à partir des props backend ou détection automatique
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(
        () =>
            currentCountry
                ? { code: currentCountry, name: currentCountry }
                : null,
    );
    const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
        () =>
            currentCurrency
                ? { code: currentCurrency, name: currentCurrency }
                : null,
    );
    const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
        () =>
            currentLanguage
                ? { code: currentLanguage, name: currentLanguage }
                : null,
    );

    const [countrySearch, setCountrySearch] = useState('');
    const [currencySearch, setCurrencySearch] = useState('');
    const [languageSearch, setLanguageSearch] = useState('');

    // Filtrer les listes
    const filteredCountries = useMemo(() => {
        if (!Array.isArray(countries)) {
            return [];
        }

        return countries.filter((country: Country) =>
            country.name.toLowerCase().includes(countrySearch.toLowerCase()),
        );
    }, [countries, countrySearch]);

    const filteredCurrencies = useMemo(() => {
        if (!Array.isArray(currencies)) {
            return [];
        }

        return currencies.filter((currency: Currency) =>
            currency.name.toLowerCase().includes(currencySearch.toLowerCase()),
        );
    }, [currencies, currencySearch]);

    const filteredLanguages = useMemo(() => {
        if (!Array.isArray(languages)) {
            return [];
        }

        return languages.filter((language: Language) =>
            language.name.toLowerCase().includes(languageSearch.toLowerCase()),
        );
    }, [languages, languageSearch]);

    // Mettre à jour les sélections initiales si les props changent
    useEffect(() => {
        if (currentCountry && !selectedCountry) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedCountry({ code: currentCountry, name: currentCountry });
        }

        if (currentCurrency && !selectedCurrency) {
            setSelectedCurrency({
                code: currentCurrency,
                name: currentCurrency,
            });
        }

        if (currentLanguage && !selectedLanguage) {
            setSelectedLanguage({
                code: currentLanguage,
                name: currentLanguage,
            });
        }
    }, [
        currentCountry,
        currentCurrency,
        currentLanguage,
        selectedCountry,
        selectedCurrency,
        selectedLanguage,
    ]);

    const handleSubmit = () => {
        router.post(
            route('preferences.update'),
            {
                country: selectedCountry?.code,
                currency: selectedCurrency?.code,
                locale: selectedLanguage?.code,
            },
            {
                onSuccess: () => {
                    toast.success('Préférences mises à jour.');
                },
                onError: (errors) => {
                    toast.error('Erreur lors de la mise à jour.');
                    console.error(errors);
                },
            },
        );
    };

    const itemToStringValue = (item: any) => item?.name || '';

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Globe className="h-4 w-4" />
                </Button>
            </SheetTrigger>

            <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Préférences régionales</SheetTitle>
                    <SheetDescription>
                        Ajustez votre pays, langue et devise pour personnaliser
                        votre expérience.
                    </SheetDescription>
                </SheetHeader>

                <div className="grid gap-6 p-6">
                    {/* Pays */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-foreground">
                            Pays
                        </label>
                        <Combobox
                            items={filteredCountries}
                            value={selectedCountry}
                            onValueChange={(val) => setSelectedCountry(val)}
                            itemToStringValue={itemToStringValue}
                            inputValue={countrySearch}
                            onInputValueChange={setCountrySearch}
                        >
                            <ComboboxInput
                                placeholder="Rechercher un pays..."
                                className="h-10"
                            />
                            <ComboboxContent>
                                <ComboboxEmpty>
                                    Aucun pays trouvé.
                                </ComboboxEmpty>
                                <ComboboxList>
                                    {(country: Country) => (
                                        <ComboboxItem
                                            key={country.code}
                                            value={country}
                                        >
                                            <Item size="xs" className="p-0">
                                                <ItemContent>
                                                    <ItemTitle>
                                                        {country.name}
                                                    </ItemTitle>
                                                    <ItemDescription>
                                                        {country.continent ||
                                                            ''}{' '}
                                                        (
                                                        {country.code?.toUpperCase()}
                                                        )
                                                    </ItemDescription>
                                                </ItemContent>
                                            </Item>
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </div>

                    {/* Devise */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-foreground">
                            Devise
                        </label>
                        <Combobox
                            items={filteredCurrencies}
                            value={selectedCurrency}
                            onValueChange={(val) => setSelectedCurrency(val)}
                            itemToStringValue={itemToStringValue}
                            inputValue={currencySearch}
                            onInputValueChange={setCurrencySearch}
                        >
                            <ComboboxInput
                                placeholder="Choisir une devise..."
                                className="h-10"
                            />
                            <ComboboxContent>
                                <ComboboxEmpty>
                                    Aucune devise trouvée.
                                </ComboboxEmpty>
                                <ComboboxList>
                                    {(currency: Currency) => (
                                        <ComboboxItem
                                            key={currency.code}
                                            value={currency}
                                        >
                                            <Item size="xs" className="p-0">
                                                <ItemContent>
                                                    <ItemTitle>
                                                        {currency.name}
                                                    </ItemTitle>
                                                    <ItemDescription>
                                                        {currency.code?.toUpperCase()}{' '}
                                                        {currency.symbol
                                                            ? `(${currency.symbol})`
                                                            : ''}
                                                    </ItemDescription>
                                                </ItemContent>
                                            </Item>
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </div>

                    {/* Langue */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-foreground">
                            Langue
                        </label>
                        <Combobox
                            items={filteredLanguages}
                            value={selectedLanguage}
                            onValueChange={(val) => setSelectedLanguage(val)}
                            itemToStringValue={itemToStringValue}
                            inputValue={languageSearch}
                            onInputValueChange={setLanguageSearch}
                        >
                            <ComboboxInput
                                placeholder="Choisir une langue..."
                                className="h-10"
                            />
                            <ComboboxContent>
                                <ComboboxEmpty>
                                    Aucune langue trouvée.
                                </ComboboxEmpty>
                                <ComboboxList>
                                    {(lang: Language) => (
                                        <ComboboxItem
                                            key={lang.code}
                                            value={lang}
                                        >
                                            <Item size="xs" className="p-0">
                                                <ItemContent>
                                                    <ItemTitle>
                                                        {lang.name}
                                                    </ItemTitle>
                                                    <ItemDescription>
                                                        {lang.code?.toUpperCase()}
                                                    </ItemDescription>
                                                </ItemContent>
                                            </Item>
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </div>
                </div>

                <SheetFooter className="px-6 pb-6">
                    <Button className="w-full" onClick={handleSubmit}>
                        Enregistrer les modifications
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
