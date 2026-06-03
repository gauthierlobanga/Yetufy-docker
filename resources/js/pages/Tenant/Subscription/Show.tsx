/* eslint-disable @typescript-eslint/no-unused-vars */
import { Head, Link, router } from '@inertiajs/react';
import {
    CreditCard,
    Calendar,
    AlertCircle,
    CheckCircle,
    Clock,
    FileText,
    Zap,
    RotateCw,
    Pause,
    Play,
    XCircle,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';
import { useState } from 'react';

interface Plan {
    id: string;
    name: string;
    price: number;
    currency: string;
    interval: string;
    formatted_price: string;
    description: string;
    features: string[];
}

interface Subscription {
    id: string;
    status: string;
    is_active: boolean;
    is_expired: boolean;
    is_blocked: boolean;
    trial_started_at: string | null;
    trial_ends_at: string | null;
    current_period_start: string | null;
    current_period_end: string | null;
    grace_period_ends_at: string | null;
    auto_renewal: boolean;
    canceled_at: string | null;
}

interface Invoice {
    id: string;
    number: string;
    status: string;
    amount_due: number;
    amount_paid: number;
    issued_at: string;
    paid_at: string | null;
    pdf_url: string | null;
}

type Props = {
    subscription: Subscription;
    plan: Plan;
    availablePlans: Plan[];
    invoices: Invoice[];
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

function daysUntil(date: string | null): number | null {
    if (!date) {
return null;
}

    const diff = new Date(date).getTime() - new Date().getTime();

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function SubscriptionShow({
    subscription,
    plan,
    availablePlans,
    invoices,
}: Props) {
    const [cancelModal, setCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [loading, setLoading] = useState(false);

    const graceDaysLeft = daysUntil(subscription.grace_period_ends_at);
    const trialDaysLeft = daysUntil(subscription.trial_ends_at);
    const periodDaysLeft = daysUntil(subscription.current_period_end);

    const handleCancel = () => {
        setLoading(true);
        router.post(
            route('subscription.cancel'),
            { reason: cancelReason },
            {
                onFinish: () => {
                    setLoading(false);
                    setCancelModal(false);
                },
            }
        );
    };

    const handlePause = () => {
        router.post(route('subscription.pause'));
    };

    const handleResume = () => {
        router.post(route('subscription.resume'));
    };

    return (
        <>
            <Head title="Mon abonnement" />

            <div className="space-y-6 p-6">
                {/* En-tête */}
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Mon abonnement
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Gestion et suivi de votre subscription
                    </p>
                </div>

                {/* Alertes */}
                {subscription.is_blocked && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                        <div className="flex items-start gap-3">
                            <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                            <div>
                                <h3 className="font-semibold">
                                    Votre accès est bloqué
                                </h3>
                                <p className="mt-1 text-sm">
                                    Votre abonnement a expiré et la période de
                                    grâce est terminée. Contactez notre support
                                    pour plus d'informations.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {subscription.is_expired && !subscription.is_blocked && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                            <div>
                                <h3 className="font-semibold">
                                    Abonnement expiré
                                </h3>
                                <p className="mt-1 text-sm">
                                    Vous avez accès jusqu'au{' '}
                                    <strong>
                                        {formatDate(
                                            subscription.grace_period_ends_at
                                        )}
                                    </strong>
                                    . Après cette date, votre accès sera bloqué.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {subscription.is_active && graceDaysLeft && graceDaysLeft < 7 && (
                    <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 text-orange-800">
                        <div className="flex items-start gap-3">
                            <Clock className="mt-0.5 h-5 w-5 shrink-0" />
                            <div>
                                <h3 className="font-semibold">
                                    Abonnement expire bientôt
                                </h3>
                                <p className="mt-1 text-sm">
                                    Il vous reste{' '}
                                    <strong>{graceDaysLeft} jour(s)</strong>
                                    avant le blocage.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {subscription.is_active && subscription.status === 'paused' && (
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-800">
                        <div className="flex items-start gap-3">
                            <Pause className="mt-0.5 h-5 w-5 shrink-0" />
                            <div>
                                <h3 className="font-semibold">
                                    Abonnement en pause
                                </h3>
                                <p className="mt-1 text-sm">
                                    Votre abonnement est actuellement en pause.
                                    Vous pouvez le réactiver à tout moment.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {subscription.is_active && !subscription.is_expired && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
                            <div>
                                <h3 className="font-semibold">
                                    Abonnement actif
                                </h3>
                                <p className="mt-1 text-sm">
                                    Votre abonnement est actif et à jour.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Plan actuel */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-lg border border-border bg-card p-6">
                        <h2 className="mb-4 text-lg font-bold text-foreground">
                            Plan actuel
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Plan
                                </p>
                                <p className="text-2xl font-bold text-primary">
                                    {plan.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Prix
                                </p>
                                <p className="text-xl font-semibold text-foreground">
                                    {plan.formatted_price}
                                </p>
                            </div>

                            {subscription.trial_ends_at &&
                                trialDaysLeft &&
                                trialDaysLeft > 0 && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Période d'essai
                                        </p>
                                        <p className="font-semibold text-foreground">
                                            {trialDaysLeft} jour(s) restant(s)
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Jusqu'au{' '}
                                            {formatDate(
                                                subscription.trial_ends_at
                                            )}
                                        </p>
                                    </div>
                                )}

                            {subscription.current_period_end && (
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Prochaine facturation
                                    </p>
                                    <p className="font-semibold text-foreground">
                                        {formatDate(
                                            subscription.current_period_end
                                        )}
                                    </p>
                                    {periodDaysLeft && (
                                        <p className="text-xs text-muted-foreground">
                                            {periodDaysLeft} jour(s)
                                        </p>
                                    )}
                                </div>
                            )}

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Renouvellement automatique
                                </p>
                                <p className="font-semibold text-foreground">
                                    {subscription.auto_renewal
                                        ? '✓ Activé'
                                        : '✗ Désactivé'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Dates importantes */}
                    <div className="rounded-lg border border-border bg-card p-6">
                        <h2 className="mb-4 text-lg font-bold text-foreground">
                            Dates importantes
                        </h2>
                        <div className="space-y-4">
                            {subscription.trial_started_at && (
                                <div className="flex items-center justify-between border-b border-border pb-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            Essai commencé
                                        </span>
                                    </div>
                                    <span className="font-medium text-foreground">
                                        {formatDate(
                                            subscription.trial_started_at
                                        )}
                                    </span>
                                </div>
                            )}

                            {subscription.trial_ends_at && (
                                <div className="flex items-center justify-between border-b border-border pb-4">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-orange-500" />
                                        <span className="text-sm text-muted-foreground">
                                            Essai se termine
                                        </span>
                                    </div>
                                    <span className="font-medium text-foreground">
                                        {formatDate(
                                            subscription.trial_ends_at
                                        )}
                                    </span>
                                </div>
                            )}

                            {subscription.current_period_start && (
                                <div className="flex items-center justify-between border-b border-border pb-4">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            Période commencée
                                        </span>
                                    </div>
                                    <span className="font-medium text-foreground">
                                        {formatDate(
                                            subscription.current_period_start
                                        )}
                                    </span>
                                </div>
                            )}

                            {subscription.current_period_end && (
                                <div className="flex items-center justify-between border-b border-border pb-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-blue-500" />
                                        <span className="text-sm text-muted-foreground">
                                            Période se termine
                                        </span>
                                    </div>
                                    <span className="font-medium text-foreground">
                                        {formatDate(
                                            subscription.current_period_end
                                        )}
                                    </span>
                                </div>
                            )}

                            {subscription.grace_period_ends_at && (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-red-500" />
                                        <span className="text-sm text-muted-foreground">
                                            Période de grâce expire
                                        </span>
                                    </div>
                                    <span className="font-medium text-foreground">
                                        {formatDate(
                                            subscription.grace_period_ends_at
                                        )}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                {!subscription.is_blocked && (
                    <div className="rounded-lg border border-border bg-card p-6">
                        <h2 className="mb-4 text-lg font-bold text-foreground">
                            Actions
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {availablePlans.length > 0 && (
                                <Link
                                    href={route('subscription.upgrade')}
                                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition hover:bg-primary/90"
                                >
                                    <ArrowUpRight className="h-4 w-4" />
                                    Changer de plan
                                </Link>
                            )}

                            <Link
                                href={route('subscription.invoices')}
                                className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-foreground transition hover:bg-muted"
                            >
                                <FileText className="h-4 w-4" />
                                Factures
                            </Link>

                            {subscription.status !== 'paused' && (
                                <button
                                    onClick={handlePause}
                                    className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-foreground transition hover:bg-muted"
                                >
                                    <Pause className="h-4 w-4" />
                                    Mettre en pause
                                </button>
                            )}

                            {subscription.status === 'paused' && (
                                <button
                                    onClick={handleResume}
                                    className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-foreground transition hover:bg-muted"
                                >
                                    <Play className="h-4 w-4" />
                                    Réactiver
                                </button>
                            )}

                            <button
                                onClick={() => setCancelModal(true)}
                                className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-red-700 transition hover:bg-red-100"
                            >
                                <XCircle className="h-4 w-4" />
                                Annuler
                            </button>
                        </div>
                    </div>
                )}

                {/* Dernières factures */}
                {invoices.length > 0 && (
                    <div className="rounded-lg border border-border bg-card p-6">
                        <h2 className="mb-4 text-lg font-bold text-foreground">
                            Dernières factures
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="px-4 py-2 text-left font-semibold text-muted-foreground">
                                            Numéro
                                        </th>
                                        <th className="px-4 py-2 text-left font-semibold text-muted-foreground">
                                            Émise
                                        </th>
                                        <th className="px-4 py-2 text-left font-semibold text-muted-foreground">
                                            Montant
                                        </th>
                                        <th className="px-4 py-2 text-left font-semibold text-muted-foreground">
                                            Statut
                                        </th>
                                        <th className="px-4 py-2 text-left font-semibold text-muted-foreground">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.map((invoice) => (
                                        <tr
                                            key={invoice.id}
                                            className="border-b border-border"
                                        >
                                            <td className="px-4 py-3 font-medium text-foreground">
                                                {invoice.number}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {formatDate(invoice.issued_at)}
                                            </td>
                                            <td className="px-4 py-3 text-foreground">
                                                {invoice.amount_due}
                                                {plan.currency}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-block rounded px-2 py-1 text-xs font-semibold ${
                                                        invoice.status ===
                                                        'paid'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-amber-100 text-amber-800'
                                                    }`}
                                                >
                                                    {invoice.status ===
                                                    'paid'
                                                        ? 'Payée'
                                                        : 'En attente'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {invoice.pdf_url && (
                                                    <a
                                                        href={
                                                            invoice.pdf_url
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:underline"
                                                    >
                                                        Télécharger
                                                    </a>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Link
                            href={route('subscription.invoices')}
                            className="mt-4 inline-block text-primary hover:underline"
                        >
                            Voir toutes les factures →
                        </Link>
                    </div>
                )}
            </div>

            {/* Modal d'annulation */}
            {cancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-lg bg-card p-6">
                        <h3 className="text-lg font-bold text-foreground">
                            Annuler votre abonnement?
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Êtes-vous sûr de vouloir annuler votre abonnement?
                            Vous aurez accès pendant 14 jours supplémentaires
                            (période de grâce).
                        </p>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-foreground">
                                Raison (optionnel)
                            </label>
                            <textarea
                                value={cancelReason}
                                onChange={(e) =>
                                    setCancelReason(e.target.value)
                                }
                                className="mt-2 w-full rounded border border-border bg-muted p-2 text-foreground"
                                rows={3}
                                placeholder="Dites-nous pourquoi vous annulez..."
                            />
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => setCancelModal(false)}
                                className="flex-1 rounded border border-border bg-card px-4 py-2 text-foreground transition hover:bg-muted"
                            >
                                Continuer
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                className="flex-1 rounded bg-red-600 px-4 py-2 text-white transition hover:bg-red-700 disabled:opacity-50"
                            >
                                {loading
                                    ? 'Annulation...'
                                    : 'Annuler mon abonnement'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
