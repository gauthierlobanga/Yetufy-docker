/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/Pages/Shop/Checkout/Index.tsx
import { Head, usePage, useForm, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight,
    ChevronLeft,
    Plus,
    Check,
    Truck,
    CreditCard,
    ShieldCheck,
    MapPin,
    Package,
    Clock,
    Building,
    Loader2,
    Pencil,
    Trash2,
    Home,
    Briefcase,
    AlertCircle,
    CheckCircle2,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import AddressModal from '@/components/ecommerce/AddressModal'; // si existant, sinon remplacer par le Dialog commenté
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import MainLayout from '@/layouts/main-layout';
import { handleImageFallback, resolveImageUrl } from '@/lib/media';
import { cn } from '@/lib/utils';
import type { Cart, Address, PageProps } from '@/types/ecommerce/products';

// Types locaux
interface ShippingMethod {
    id: string;
    name: string;
    description: string;
    price: number;
    estimatedDays: string;
}

interface PaymentMethod {
    id: string;
    name: string;
    description?: string;
}

interface Props extends Record<string, unknown> {
    cart: Cart;
    addresses: Address[];
    shippingMethods?: ShippingMethod[];
    paymentMethods?: PaymentMethod[];
}

const steps = [
    { id: 'address', name: 'Adresse', icon: MapPin },
    { id: 'shipping', name: 'Livraison', icon: Truck },
    { id: 'payment', name: 'Paiement', icon: CreditCard },
    { id: 'review', name: 'Confirmation', icon: ShieldCheck },
] as const;

type Step = (typeof steps)[number]['id'];

// Helpers
const formatCurrency = (amount: number, currency = 'CDF') => {
    try {
        return new Intl.NumberFormat('fr-CD', {
            style: 'currency',
            currency,
            minimumFractionDigits: 2,
        }).format(amount);
    } catch {
        return `${amount.toFixed(2)} ${currency}`;
    }
};

const safeNumber = (val: unknown): number =>
    typeof val === 'number' ? val : Number(val) || 0;

// Valeurs par défaut si non fournies par le backend
const defaultShipping: ShippingMethod[] = [
    {
        id: 'standard',
        name: 'Standard',
        description: 'Livraison à domicile sous 5-7 jours',
        price: 0,
        estimatedDays: '5-7 jours',
    },
    {
        id: 'express',
        name: 'Express',
        description: 'Livraison prioritaire sous 24-48h',
        price: 15000,
        estimatedDays: '1-2 jours',
    },
];

const defaultPayment: PaymentMethod[] = [
    {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'M-Pesa, Airtel Money, Orange Money',
    },
    { id: 'card', name: 'Carte bancaire', description: 'Visa, Mastercard' },
    { id: 'cash', name: 'Paiement à la livraison' },
];

export default function CheckoutIndex() {
    const { props } = usePage<Props>();
    const { cart, addresses: initialAddresses = [] } = props;

    const shippingMethods = props.shippingMethods?.length
        ? props.shippingMethods
        : defaultShipping;
    const paymentMethods = props.paymentMethods?.length
        ? props.paymentMethods
        : defaultPayment;

    // État
    const [currentStep, setCurrentStep] = useState<Step>('address');
    const [selectedShipping, setSelectedShipping] = useState(
        shippingMethods[0].id,
    );
    const [selectedPayment, setSelectedPayment] = useState(
        paymentMethods[0].id,
    );
    const [sameAsShipping, setSameAsShipping] = useState(false);
    const [addressDialogOpen, setAddressDialogOpen] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState<number | null>(
        null,
    );
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        adresse_facturation_id: '',
        adresse_livraison_id: '',
        shipping_method_id: shippingMethods[0].id,
        payment_method_id: paymentMethods[0].id,
        notes: '',
        same_as_shipping: false,
        new_address: {
            id: null as number | null,
            rue: '',
            complement: '',
            code_postal: '',
            ville: '',
            pays: 'RDCongo',
            telephone: '',
            type: 'livraison' as 'facturation' | 'livraison',
            est_defaut: false,
        },
    });

    // Sync
    useEffect(
        () => setData('shipping_method_id', selectedShipping),
        [selectedShipping, setData],
    );
    useEffect(
        () => setData('payment_method_id', selectedPayment),
        [selectedPayment, setData],
    );
    useEffect(() => {
        setData('same_as_shipping', sameAsShipping);

        if (sameAsShipping && data.adresse_livraison_id) {
            setData('adresse_facturation_id', data.adresse_livraison_id);
        }
    }, [sameAsShipping, data.adresse_livraison_id, setData]);

    // Calculs
    const subtotal = safeNumber(cart.sous_total);
    const taxes = safeNumber(cart.total_taxes);
    const shippingPrice =
        shippingMethods.find((m) => m.id === selectedShipping)?.price ?? 0;
    const discounts = safeNumber(cart.total_remises);
    const total = Math.max(0, subtotal + taxes + shippingPrice - discounts);

    // Gestion des adresses
    const handleSaveAddress = () => {
        const addrData = data.new_address;
        const url = editingAddressId
            ? route('tenant.addresses.update', editingAddressId)
            : route('tenant.addresses.store');
        const method = editingAddressId ? 'put' : 'post';

        setIsLoadingAddresses(true);
        router.visit(url, {
            method,
            data: addrData,
            preserveState: true,
            preserveScroll: true,
            showProgress: false,
            only: ['addresses'],
            onSuccess: () => {
                toast.success(
                    editingAddressId
                        ? 'Adresse mise à jour'
                        : 'Adresse ajoutée',
                );
                setAddressDialogOpen(false);
                resetNewAddress();
            },
            onError: (err) => {
                toast.error("Erreur lors de l'enregistrement");
                console.error(err);
            },
            onFinish: () => setIsLoadingAddresses(false),
        });
    };

    const resetNewAddress = () => {
        setData('new_address', {
            id: null,
            rue: '',
            complement: '',
            code_postal: '',
            ville: '',
            pays: 'RDCongo',
            telephone: '',
            type: 'livraison',
            est_defaut: false,
        });
        setEditingAddressId(null);
    };

    const editAddress = (addr: Address) => {
        setData('new_address', {
            id: addr.id,
            rue: addr.rue,
            complement: addr.complement || '',
            code_postal: addr.code_postal,
            ville: addr.ville,
            pays: addr.pays,
            telephone: addr.telephone || '',
            type: addr.type,
            est_defaut: addr.est_defaut,
        });
        setEditingAddressId(addr.id);
        setAddressDialogOpen(true);
    };

    const deleteAddress = (id: number) => {
        if (confirm('Supprimer cette adresse ?')) {
            router.delete(route('tenant.addresses.destroy', id), {
                preserveState: true,
                preserveScroll: false,
                only: ['addresses'],
                onSuccess: () => toast.success('Adresse supprimée'),
            });
        }
    };

    // Progression
    const canProceed = (): boolean => {
        switch (currentStep) {
            case 'address':
                return (
                    !!data.adresse_livraison_id &&
                    (sameAsShipping || !!data.adresse_facturation_id)
                );
            case 'shipping':
                return !!selectedShipping;
            case 'payment':
                return !!selectedPayment;
            default:
                return true;
        }
    };

    const nextStep = () => {
        if (canProceed()) {
            const idx = steps.findIndex((s) => s.id === currentStep);

            if (idx < steps.length - 1) {
                setCurrentStep(steps[idx + 1].id);
            }
        } else {
            toast.error('Veuillez compléter toutes les informations requises');
        }
    };
    const prevStep = () => {
        const idx = steps.findIndex((s) => s.id === currentStep);

        if (idx > 0) {
            setCurrentStep(steps[idx - 1].id);
        }
    };

    const getStepStatus = (stepId: Step) => {
        const curIdx = steps.findIndex((s) => s.id === currentStep);
        const stepIdx = steps.findIndex((s) => s.id === stepId);

        if (stepIdx < curIdx) {
            return 'completed';
        }

        if (stepIdx === curIdx) {
            return 'current';
        }

        return 'upcoming';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tenant.checkout.process'), {
            preserveScroll: true,
            showProgress: false,
            onSuccess: () =>
                toast.success('Commande confirmée ! Redirection...'),
            onError: () => toast.error('Une erreur est survenue'),
        });
    };

    const selectedShippingAddr = initialAddresses.find(
        (a) => String(a.id) === data.adresse_livraison_id,
    );
    const selectedBillingAddr = sameAsShipping
        ? selectedShippingAddr
        : initialAddresses.find(
              (a) => String(a.id) === data.adresse_facturation_id,
          );

    return (
        <MainLayout>
            <Head title="Finaliser la commande" />
            <TooltipProvider>
                <div className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
                    {/* Stepper */}
                    <div className="mb-12">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white">
                            Finaliser votre commande
                        </h1>
                        <p className="mt-2 text-slate-500 dark:text-slate-400">
                            Complétez les informations ci-dessous pour confirmer
                            votre achat
                        </p>

                        <div className="mt-8 flex items-center justify-between">
                            {steps.map((step, idx) => {
                                const status = getStepStatus(step.id);
                                const Icon = step.icon;

                                return (
                                    <div
                                        key={step.id}
                                        className="flex items-center"
                                    >
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="flex flex-col items-center">
                                                    <motion.div
                                                        animate={{
                                                            scale:
                                                                status ===
                                                                'current'
                                                                    ? 1.1
                                                                    : 1,
                                                        }}
                                                        className={cn(
                                                            'flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md transition-colors',
                                                            status ===
                                                                'completed' &&
                                                                'bg-emerald-500',
                                                            status ===
                                                                'current' &&
                                                                'bg-emerald-600',
                                                            status ===
                                                                'upcoming' &&
                                                                'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-300',
                                                        )}
                                                    >
                                                        {status ===
                                                        'completed' ? (
                                                            <Check className="h-5 w-5" />
                                                        ) : (
                                                            <Icon className="h-5 w-5" />
                                                        )}
                                                    </motion.div>
                                                    <span
                                                        className={cn(
                                                            'mt-2 text-xs font-medium',
                                                            status ===
                                                                'upcoming' &&
                                                                'text-slate-400 dark:text-slate-500',
                                                        )}
                                                    >
                                                        {step.name}
                                                    </span>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {status === 'completed'
                                                    ? 'Étape validée'
                                                    : status === 'current'
                                                      ? 'En cours'
                                                      : 'À venir'}
                                            </TooltipContent>
                                        </Tooltip>
                                        {idx < steps.length - 1 && (
                                            <div
                                                className={cn(
                                                    'mx-2 h-0.5 w-12 rounded-full md:w-20',
                                                    getStepStatus(
                                                        steps[idx + 1].id,
                                                    ) === 'upcoming'
                                                        ? 'bg-slate-200 dark:bg-slate-700'
                                                        : 'bg-emerald-300 dark:bg-emerald-600',
                                                )}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Formulaire */}
                        <div className="lg:col-span-2">
                            <AnimatePresence mode="wait">
                                {currentStep === 'address' && (
                                    <AddressStep
                                        addresses={initialAddresses}
                                        data={data}
                                        setData={setData}
                                        errors={errors}
                                        sameAsShipping={sameAsShipping}
                                        setSameAsShipping={setSameAsShipping}
                                        addressDialogOpen={addressDialogOpen}
                                        setAddressDialogOpen={
                                            setAddressDialogOpen
                                        }
                                        editingAddressId={editingAddressId}
                                        isLoadingAddresses={isLoadingAddresses}
                                        onSaveAddress={handleSaveAddress}
                                        onEditAddress={editAddress}
                                        onDeleteAddress={deleteAddress}
                                        resetNewAddress={resetNewAddress}
                                    />
                                )}
                                {currentStep === 'shipping' && (
                                    <ShippingStep
                                        methods={shippingMethods}
                                        selected={selectedShipping}
                                        onSelect={setSelectedShipping}
                                    />
                                )}
                                {currentStep === 'payment' && (
                                    <PaymentStep
                                        methods={paymentMethods}
                                        selected={selectedPayment}
                                        onSelect={setSelectedPayment}
                                    />
                                )}
                                {currentStep === 'review' && (
                                    <ReviewStep
                                        cart={cart}
                                        shippingAddress={selectedShippingAddr}
                                        billingAddress={selectedBillingAddr}
                                        shippingMethod={
                                            shippingMethods.find(
                                                (m) =>
                                                    m.id === selectedShipping,
                                            )!
                                        }
                                        paymentMethod={
                                            paymentMethods.find(
                                                (m) => m.id === selectedPayment,
                                            )!
                                        }
                                        notes={data.notes}
                                        setNotes={(v: string) =>
                                            setData('notes', v)
                                        }
                                        onEditStep={setCurrentStep}
                                    />
                                )}
                            </AnimatePresence>

                            {/* Navigation */}
                            <div className="mt-8 flex justify-between">
                                {currentStep !== 'address' && (
                                    <Button
                                        variant="outline"
                                        onClick={prevStep}
                                    >
                                        <ChevronLeft className="mr-2 h-4 w-4" />{' '}
                                        Retour
                                    </Button>
                                )}
                                <div className="flex-1" />
                                {currentStep !== 'review' ? (
                                    <Button
                                        onClick={nextStep}
                                        disabled={!canProceed()}
                                        className="gap-2"
                                    >
                                        Continuer{' '}
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={processing}
                                        size="lg"
                                        className="min-w-40 gap-2"
                                    >
                                        {processing ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <ShieldCheck className="h-4 w-4" />
                                        )}
                                        {processing
                                            ? 'Traitement...'
                                            : 'Confirmer la commande'}
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Récapitulatif */}
                        <OrderSummary
                            cart={cart}
                            subtotal={subtotal}
                            taxes={taxes}
                            shipping={shippingPrice}
                            discounts={discounts}
                            total={total}
                            shippingMethodName={
                                shippingMethods.find(
                                    (m) => m.id === selectedShipping,
                                )?.name
                            }
                        />
                    </div>
                </div>
            </TooltipProvider>
        </MainLayout>
    );
}

// ---------- Sous-composants (style modernisé) ----------

function AddressStep({
    addresses,
    data,
    setData,
    sameAsShipping,
    setSameAsShipping,
    addressDialogOpen,
    setAddressDialogOpen,
    editingAddressId,
    isLoadingAddresses,
    onSaveAddress,
    onEditAddress,
    onDeleteAddress,
    resetNewAddress,
}: any) {
    return (
        <motion.div
            key="address"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <Card className="rounded-2xl border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white">
                        <Truck className="h-5 w-5 text-emerald-500" /> Adresse
                        de livraison
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <RadioGroup
                        value={data.adresse_livraison_id}
                        onValueChange={(v) =>
                            setData('adresse_livraison_id', v)
                        }
                    >
                        <div className="space-y-3">
                            {addresses
                                .filter((a: Address) => a.type === 'livraison')
                                .map((addr: Address) => (
                                    <AddressCard
                                        key={addr.id}
                                        address={addr}
                                        selected={
                                            data.adresse_livraison_id ===
                                            String(addr.id)
                                        }
                                        onSelect={() =>
                                            setData(
                                                'adresse_livraison_id',
                                                String(addr.id),
                                            )
                                        }
                                        onEdit={() => onEditAddress(addr)}
                                        onDelete={() =>
                                            onDeleteAddress(addr.id)
                                        }
                                    />
                                ))}
                        </div>
                    </RadioGroup>
                    <Dialog
                        open={addressDialogOpen}
                        onOpenChange={setAddressDialogOpen}
                    >
                        <DialogTrigger asChild>
                            <Button variant="outline" className="mt-4 w-full">
                                <Plus className="mr-2 h-4 w-4" />{' '}
                                {editingAddressId
                                    ? "Modifier l'adresse"
                                    : 'Ajouter une nouvelle adresse'}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingAddressId ? 'Modifier' : 'Nouvelle'}{' '}
                                    adresse
                                </DialogTitle>
                                <DialogDescription>
                                    Remplissez les informations ci-dessous
                                </DialogDescription>
                            </DialogHeader>
                            <AddressForm
                                data={data.new_address}
                                onChange={(field: string, value: any) =>
                                    setData('new_address', {
                                        ...data.new_address,
                                        [field]: value,
                                    })
                                }
                                isLoading={isLoadingAddresses}
                                onSave={onSaveAddress}
                                onCancel={() => setAddressDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white">
                        <Building className="h-5 w-5 text-emerald-500" />{' '}
                        Adresse de facturation
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Checkbox
                        id="sameAsShipping"
                        checked={sameAsShipping}
                        onCheckedChange={(c) => setSameAsShipping(!!c)}
                    />
                    <Label
                        htmlFor="sameAsShipping"
                        className="ml-2 cursor-pointer"
                    >
                        Identique à l'adresse de livraison
                    </Label>
                    {!sameAsShipping && (
                        <RadioGroup
                            value={data.adresse_facturation_id}
                            onValueChange={(v) =>
                                setData('adresse_facturation_id', v)
                            }
                        >
                            <div className="mt-4 space-y-3">
                                {addresses
                                    .filter(
                                        (a: Address) =>
                                            a.type === 'facturation',
                                    )
                                    .map((addr: Address) => (
                                        <AddressCard
                                            key={addr.id}
                                            address={addr}
                                            selected={
                                                data.adresse_facturation_id ===
                                                String(addr.id)
                                            }
                                            onSelect={() =>
                                                setData(
                                                    'adresse_facturation_id',
                                                    String(addr.id),
                                                )
                                            }
                                            onEdit={() => onEditAddress(addr)}
                                            onDelete={() =>
                                                onDeleteAddress(addr.id)
                                            }
                                        />
                                    ))}
                            </div>
                        </RadioGroup>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}

function AddressCard({ address, selected, onSelect, onEdit, onDelete }: any) {
    return (
        <label
            className={cn(
                'relative flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all',
                selected
                    ? 'border-emerald-400 bg-emerald-50/50 shadow-sm dark:border-emerald-600 dark:bg-emerald-900/10'
                    : 'border-slate-200 hover:border-emerald-300 dark:border-slate-700',
            )}
        >
            <RadioGroupItem
                value={String(address.id)}
                id={`addr-${address.id}`}
                className="mt-0.5"
            />
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    {address.type === 'livraison' ? (
                        <Home className="h-4 w-4 text-slate-400" />
                    ) : (
                        <Briefcase className="h-4 w-4 text-slate-400" />
                    )}
                    <p className="font-medium text-slate-800 dark:text-white">
                        {address.rue}
                    </p>
                    {address.est_defaut && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                            Par défaut
                        </Badge>
                    )}
                </div>
                {address.complement && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {address.complement}
                    </p>
                )}
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {address.code_postal} {address.ville}, {address.pays}
                </p>
                {address.telephone && (
                    <p className="text-sm text-slate-500">
                        {address.telephone}
                    </p>
                )}
            </div>
            <div className="flex gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                        e.preventDefault();
                        onEdit();
                    }}
                >
                    <Pencil className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-rose-500 hover:text-rose-600"
                    onClick={(e) => {
                        e.preventDefault();
                        onDelete();
                    }}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </label>
    );
}

function AddressForm({ data, onChange, isLoading, onSave, onCancel }: any) {
    return (
        <div className="grid gap-4 py-4">
            <Input
                placeholder="Rue *"
                value={data.rue}
                onChange={(e) => onChange('rue', e.target.value)}
            />
            <Input
                placeholder="Complément"
                value={data.complement}
                onChange={(e) => onChange('complement', e.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
                <Input
                    placeholder="Code postal *"
                    value={data.code_postal}
                    onChange={(e) => onChange('code_postal', e.target.value)}
                />
                <Input
                    placeholder="Ville *"
                    value={data.ville}
                    onChange={(e) => onChange('ville', e.target.value)}
                />
            </div>
            <Input
                placeholder="Pays"
                value={data.pays}
                onChange={(e) => onChange('pays', e.target.value)}
            />
            <Input
                placeholder="Téléphone"
                value={data.telephone}
                onChange={(e) => onChange('telephone', e.target.value)}
            />
            <Checkbox
                id="est_defaut"
                checked={data.est_defaut}
                onCheckedChange={(c) => onChange('est_defaut', !!c)}
            />
            <Label htmlFor="est_defaut">Définir comme adresse par défaut</Label>
            <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onCancel}>
                    Annuler
                </Button>
                <Button onClick={onSave} disabled={isLoading}>
                    {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Enregistrer
                </Button>
            </div>
        </div>
    );
}

function ShippingStep({ methods, selected, onSelect }: any) {
    return (
        <motion.div
            key="shipping"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
        >
            <Card className="rounded-2xl border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
                <CardHeader>
                    <CardTitle className="text-slate-800 dark:text-white">
                        Mode de livraison
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <RadioGroup value={selected} onValueChange={onSelect}>
                        <div className="space-y-3">
                            {methods.map((m: ShippingMethod) => (
                                <label
                                    key={m.id}
                                    className={cn(
                                        'flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all',
                                        selected === m.id
                                            ? 'border-emerald-400 bg-emerald-50/50 dark:border-emerald-600 dark:bg-emerald-900/10'
                                            : 'border-slate-200 hover:border-emerald-300 dark:border-slate-700',
                                    )}
                                >
                                    <RadioGroupItem
                                        value={m.id}
                                        id={m.id}
                                        className="mt-0.5"
                                    />
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <span className="font-medium text-slate-800 dark:text-white">
                                                {m.name}
                                            </span>
                                            <Badge variant="outline">
                                                {m.price === 0
                                                    ? 'Gratuit'
                                                    : formatCurrency(
                                                          m.price,
                                                          'CDF',
                                                      )}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            {m.description}
                                        </p>
                                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                                            <Clock className="h-3 w-3" />{' '}
                                            {m.estimatedDays}
                                        </p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>
        </motion.div>
    );
}

function PaymentStep({ methods, selected, onSelect }: any) {
    return (
        <motion.div
            key="payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
        >
            <Card className="rounded-2xl border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
                <CardHeader>
                    <CardTitle className="text-slate-800 dark:text-white">
                        Mode de paiement
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <RadioGroup value={selected} onValueChange={onSelect}>
                        <div className="space-y-3">
                            {methods.map((m: PaymentMethod) => (
                                <label
                                    key={m.id}
                                    className={cn(
                                        'flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all',
                                        selected === m.id
                                            ? 'border-emerald-400 bg-emerald-50/50 dark:border-emerald-600 dark:bg-emerald-900/10'
                                            : 'border-slate-200 hover:border-emerald-300 dark:border-slate-700',
                                    )}
                                >
                                    <RadioGroupItem
                                        value={m.id}
                                        id={m.id}
                                        className="mt-0.5"
                                    />
                                    <CreditCard className="h-5 w-5 text-emerald-500" />
                                    <div className="flex-1">
                                        <span className="font-medium text-slate-800 dark:text-white">
                                            {m.name}
                                        </span>
                                        {m.description && (
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                {m.description}
                                            </p>
                                        )}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>
        </motion.div>
    );
}

function ReviewStep({
    cart,
    shippingAddress,
    billingAddress,
    shippingMethod,
    paymentMethod,
    notes,
    setNotes,
    onEditStep,
}: any) {
    return (
        <motion.div
            key="review"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <Card className="rounded-2xl border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
                <CardHeader>
                    <CardTitle className="text-slate-800 dark:text-white">
                        Récapitulatif
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <ReviewSection
                            title="Adresse de livraison"
                            onEdit={() => onEditStep('address')}
                        >
                            {shippingAddress ? (
                                <AddressSummary address={shippingAddress} />
                            ) : (
                                <p className="text-sm text-slate-500">
                                    Non définie
                                </p>
                            )}
                        </ReviewSection>
                        <ReviewSection
                            title="Adresse de facturation"
                            onEdit={() => onEditStep('address')}
                        >
                            {billingAddress ? (
                                <AddressSummary address={billingAddress} />
                            ) : (
                                <p className="text-sm text-slate-500">
                                    Non définie
                                </p>
                            )}
                        </ReviewSection>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <ReviewSection
                            title="Livraison"
                            onEdit={() => onEditStep('shipping')}
                        >
                            <p className="font-medium text-slate-800 dark:text-white">
                                {shippingMethod.name}
                            </p>
                            <p className="text-sm text-slate-500">
                                {shippingMethod.description}
                            </p>
                        </ReviewSection>
                        <ReviewSection
                            title="Paiement"
                            onEdit={() => onEditStep('payment')}
                        >
                            <p className="font-medium text-slate-800 dark:text-white">
                                {paymentMethod.name}
                            </p>
                        </ReviewSection>
                    </div>
                    <div>
                        <h4 className="mb-2 font-medium text-slate-800 dark:text-white">
                            Articles ({cart.nb_articles})
                        </h4>
                        <ScrollArea className="max-h-48">
                            <div className="space-y-2">
                                {cart.items.map((item: any) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-3 text-sm"
                                    >
                                        <img
                                            src={resolveImageUrl(
                                                item.produit.image,
                                            )}
                                            alt=""
                                            className="h-10 w-10 rounded-md object-cover"
                                            onError={handleImageFallback()}
                                        />
                                        <span className="flex-1 text-slate-700 dark:text-slate-300">
                                            {item.produit.nom}
                                        </span>
                                        <span className="text-slate-500">
                                            {item.quantite} ×{' '}
                                            {formatCurrency(
                                                safeNumber(item.prix_unitaire),
                                                'CDF',
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                    <div>
                        <Label htmlFor="notes">Notes (optionnel)</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="mt-1"
                        />
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

function ReviewSection({ title, children, onEdit }: any) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/50">
            <div className="mb-2 flex items-center justify-between">
                <h4 className="font-medium text-slate-800 dark:text-white">
                    {title}
                </h4>
                <Button variant="ghost" size="sm" onClick={onEdit}>
                    <Pencil className="mr-1 h-3 w-3" /> Modifier
                </Button>
            </div>
            {children}
        </div>
    );
}

function AddressSummary({ address }: { address: Address }) {
    return (
        <div className="text-sm text-slate-600 dark:text-slate-400">
            <p className="font-medium text-slate-800 dark:text-white">
                {address.rue}
            </p>
            {address.complement && <p>{address.complement}</p>}
            <p>
                {address.code_postal} {address.ville}
            </p>
            <p>{address.pays}</p>
            {address.telephone && <p>{address.telephone}</p>}
        </div>
    );
}

function OrderSummary({
    cart,
    subtotal,
    taxes,
    shipping,
    discounts,
    total,
    shippingMethodName,
}: any) {
    return (
        <div className="lg:col-span-1">
            <Card className="sticky top-24 rounded-2xl border-slate-200/80 bg-white/80 shadow-lg backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-slate-800 dark:text-white">
                        <Package className="h-5 w-5 text-emerald-500" /> Votre
                        commande
                    </CardTitle>
                    <CardDescription>
                        {cart.nb_articles} article
                        {cart.nb_articles > 1 ? 's' : ''}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ScrollArea className="max-h-64">
                        <div className="space-y-3">
                            {cart.items.slice(0, 6).map((item: any) => (
                                <div key={item.id} className="flex gap-3">
                                    <img
                                        src={resolveImageUrl(
                                            item.produit.image,
                                        )}
                                        alt=""
                                        className="h-12 w-12 rounded-lg border border-slate-200 object-cover dark:border-slate-700"
                                        onError={handleImageFallback()}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-slate-800 dark:text-white">
                                            {item.produit.nom}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Qté: {item.quantite} ×{' '}
                                            {formatCurrency(
                                                safeNumber(item.prix_unitaire),
                                                'CDF',
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {cart.items.length > 6 && (
                                <p className="text-xs text-slate-400">
                                    + {cart.items.length - 6} autre(s)
                                    article(s)
                                </p>
                            )}
                        </div>
                    </ScrollArea>
                    <Separator />
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                            <span>Sous-total</span>
                            <span>{formatCurrency(subtotal, 'CDF')}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                            <span>Taxes</span>
                            <span>{formatCurrency(taxes, 'CDF')}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                            <span>Livraison</span>
                            {shipping === 0 ? (
                                <Badge variant="secondary">Gratuite</Badge>
                            ) : (
                                <span>{formatCurrency(shipping, 'CDF')}</span>
                            )}
                        </div>
                        {discounts > 0 && (
                            <div className="flex justify-between font-medium text-emerald-600">
                                <span>Remises</span>
                                <span>-{formatCurrency(discounts, 'CDF')}</span>
                            </div>
                        )}
                        <Separator />
                        <div className="flex justify-between text-base font-bold text-slate-800 dark:text-white">
                            <span>Total</span>
                            <span>{formatCurrency(total, 'CDF')}</span>
                        </div>
                        {shippingMethodName && (
                            <p className="text-xs text-slate-400">
                                Livraison : {shippingMethodName}
                            </p>
                        )}
                    </div>
                    <div className="rounded-lg bg-emerald-50 p-3 text-xs dark:bg-emerald-900/20">
                        <div className="flex items-center gap-2 font-medium text-emerald-700 dark:text-emerald-400">
                            <ShieldCheck className="h-4 w-4" /> Paiement 100%
                            sécurisé
                        </div>
                        <p className="mt-1 text-slate-600 dark:text-slate-400">
                            Vos données sont protégées par cryptage SSL.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
