import { Head, Link } from '@inertiajs/react';
import { Download, FileText } from 'lucide-react';

interface Invoice {
    id: string;
    number: string;
    status: string;
    amount_due: number;
    amount_paid: number;
    issued_at: string;
    due_at: string | null;
    paid_at: string | null;
    pdf_url: string | null;
}

type Props = {
    invoices: {
        data: Invoice[];
        links: any;
        meta: any;
    };
};

function formatDate(date: string | null): string {
    if (!date) {
return '—';
}

    return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function formatAmount(amount: number, currency: string): string {
    return `${amount.toFixed(2)} ${currency}`;
}

export default function Invoices({ invoices }: Props) {
    return (
        <>
            <Head title="Factures" />

            <div className="space-y-6 p-6">
                {/* En-tête */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Factures
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Historique complet de vos factures
                        </p>
                    </div>
                </div>

                {/* Liste des factures */}
                {invoices.data.length > 0 ? (
                    <div className="rounded-lg border border-border bg-card shadow">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border bg-muted/50">
                                        <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                                            Numéro de facture
                                        </th>
                                        <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                                            Émise le
                                        </th>
                                        <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                                            Montant
                                        </th>
                                        <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                                            Statut
                                        </th>
                                        <th className="px-6 py-4 text-right font-semibold text-muted-foreground">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {invoices.data.map((invoice) => (
                                        <tr
                                            key={invoice.id}
                                            className="hover:bg-muted/50 transition"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium text-foreground">
                                                        {invoice.number}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {formatDate(
                                                    invoice.issued_at
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-foreground">
                                                {formatAmount(
                                                    invoice.amount_due,
                                                    'CDF'
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                                        invoice.status ===
                                                        'paid'
                                                            ? 'bg-green-100 text-green-800'
                                                            : invoice.status ===
                                                              'open'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    {invoice.status ===
                                                    'paid'
                                                        ? 'Payée'
                                                        : invoice.status ===
                                                          'open'
                                                        ? 'En attente'
                                                        : invoice.status.charAt(
                                                              0
                                                          ).toUpperCase() +
                                                          invoice.status.slice(
                                                              1
                                                          )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {invoice.pdf_url && (
                                                    <a
                                                        href={
                                                            invoice.pdf_url
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 rounded bg-primary/10 px-3 py-2 text-primary transition hover:bg-primary/20"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                        <span className="text-sm font-medium">
                                                            Télécharger
                                                        </span>
                                                    </a>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {invoices.meta?.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2 border-t border-border px-6 py-4">
                                {invoices.links?.prev && (
                                    <Link
                                        href={invoices.links.prev}
                                        className="rounded border border-border px-3 py-1 text-sm hover:bg-muted"
                                    >
                                        Précédent
                                    </Link>
                                )}
                                <span className="text-sm text-muted-foreground">
                                    Page {invoices.meta?.current_page} sur{' '}
                                    {invoices.meta?.last_page}
                                </span>
                                {invoices.links?.next && (
                                    <Link
                                        href={invoices.links.next}
                                        className="rounded border border-border px-3 py-1 text-sm hover:bg-muted"
                                    >
                                        Suivant
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="rounded-lg border border-dashed border-border bg-muted/50 p-8 text-center">
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mt-4 font-semibold text-foreground">
                            Aucune facture
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Vous n'avez pas encore de facture. Elles
                            apparaîtront ici une fois votre abonnement actif.
                        </p>
                    </div>
                )}

                {/* Retour */}
                <div>
                    <Link
                        href={route('subscription.show')}
                        className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                        ← Retour à mon abonnement
                    </Link>
                </div>
            </div>
        </>
    );
}
