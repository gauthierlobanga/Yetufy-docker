/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/pages/Shop/Returns/Create.tsx
import type { PageProps } from '@inertiajs/core';
import { useForm, usePage, Head } from '@inertiajs/react';
import { RotateCcw, Package, AlertCircle, Send, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import tenant from '@/routes/tenant';

// ---------- Types ----------
interface CommandeLine {
    id: string;
    quantite: number;
    prix_total: number | string;
    produit?: {
        nom?: string;
    } | null;
}

interface Props extends PageProps {
    commande: {
        id: string;
        numero_commande: string;
        lignes: CommandeLine[];
    };
}

export default function ShopReturnCreatePage() {
    const { commande } = usePage<Props>().props;
    const form = useForm<{
        commande_id: string;
        motif: string;
        lignes: Array<{
            ligne_commande_id: string;
            quantite: number;
            etat: 'conforme' | 'defectueux' | 'endommage' | 'incomplet';
        }>;
    }>({
        commande_id: commande.id,
        motif: '',
        lignes: commande.lignes.map((line) => ({
            ligne_commande_id: line.id,
            quantite: 1,
            etat: 'conforme' as const,
        })),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('return.store'), {
            preserveScroll: true,
            onSuccess: () => toast.success('Demande de retour envoyée'),
            onError: () => toast.error('Veuillez vérifier les champs'),
        });
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
            <Head title={`Retour - ${commande.numero_commande}`} />
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                    <div className="flex flex-1 flex-col gap-6 p-4 pt-0 md:p-6 md:pt-0">
                        {/* Retour */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-fit rounded-xl"
                            asChild
                        >
                            <a href={tenant.orders.show(commande.id).url}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Retour à la commande
                            </a>
                        </Button>

                        {/* En-tête */}
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Demande de retour – {commande.numero_commande}
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Sélectionnez les articles concernés et précisez
                                le motif.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                                        <Package className="h-5 w-5 text-emerald-500" />
                                        Produits concernés
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    {commande.lignes.map((line, index) => (
                                        <div
                                            key={line.id}
                                            className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-[minmax(0,1fr)_100px_180px] dark:border-slate-800 dark:bg-slate-900/60"
                                        >
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">
                                                    {line.produit?.nom ??
                                                        'Produit'}
                                                </p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    Quantité commandée :{' '}
                                                    {line.quantite}
                                                </p>
                                            </div>
                                            <Input
                                                type="number"
                                                min="1"
                                                max={line.quantite}
                                                value={
                                                    form.data.lignes[index]
                                                        ?.quantite ?? 1
                                                }
                                                onChange={(event) => {
                                                    const lignes = [
                                                        ...form.data.lignes,
                                                    ];
                                                    lignes[index] = {
                                                        ...lignes[index],
                                                        quantite: Number(
                                                            event.target.value,
                                                        ),
                                                    };
                                                    form.setData(
                                                        'lignes',
                                                        lignes,
                                                    );
                                                }}
                                                className="h-10 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800/80"
                                            />
                                            <Select
                                                value={
                                                    form.data.lignes[index]
                                                        ?.etat
                                                }
                                                onValueChange={(value) => {
                                                    const lignes = [
                                                        ...form.data.lignes,
                                                    ];
                                                    lignes[index] = {
                                                        ...lignes[index],
                                                        etat: value as any,
                                                    };
                                                    form.setData(
                                                        'lignes',
                                                        lignes,
                                                    );
                                                }}
                                            >
                                                <SelectTrigger className="h-10 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800/80">
                                                    <SelectValue placeholder="État" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="conforme">
                                                        Conforme
                                                    </SelectItem>
                                                    <SelectItem value="defectueux">
                                                        Défectueux
                                                    </SelectItem>
                                                    <SelectItem value="endommage">
                                                        Endommagé
                                                    </SelectItem>
                                                    <SelectItem value="incomplet">
                                                        Incomplet
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ))}

                                    <Textarea
                                        value={form.data.motif}
                                        onChange={(e) =>
                                            form.setData(
                                                'motif',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Expliquez le motif du retour"
                                        className="min-h-25 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800/80"
                                    />

                                    <Button
                                        type="submit"
                                        disabled={form.processing}
                                        className="w-full rounded-xl bg-linear-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-700 hover:to-emerald-600"
                                    >
                                        <Send className="mr-2 h-4 w-4" />
                                        Envoyer la demande
                                    </Button>
                                </CardContent>
                            </Card>
                        </form>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
