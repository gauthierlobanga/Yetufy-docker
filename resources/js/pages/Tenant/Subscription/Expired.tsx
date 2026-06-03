import { Head, Link } from '@inertiajs/react';
import { AlertCircle, Clock, ArrowLeft } from 'lucide-react';

export default function SubscriptionExpired() {
    return (
        <>
            <Head title="Abonnement expiré" />

            <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-amber-50 to-amber-100 p-4">
                <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-amber-100 p-3">
                            <Clock className="h-8 w-8 text-amber-600" />
                        </div>
                    </div>

                    <h1 className="mt-4 text-center text-3xl font-bold text-amber-900">
                        Abonnement expiré
                    </h1>

                    <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                        <div className="flex gap-2">
                            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
                            <div className="text-sm text-amber-800">
                                <p className="font-semibold">
                                    Votre période de grâce est terminée
                                </p>
                                <p className="mt-1">
                                    Votre accès a été bloqué automatiquement.
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-gray-600">
                        Pour réactiver votre accès, veuillez:
                    </p>

                    <ol className="mt-4 space-y-2 text-sm text-gray-700">
                        <li className="flex gap-2">
                            <span className="font-semibold">1.</span>
                            <span>Contactez notre équipe support</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-semibold">2.</span>
                            <span>Renouvelez votre abonnement</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-semibold">3.</span>
                            <span>Votre accès sera restauré immédiatement</span>
                        </li>
                    </ol>

                    <div className="mt-8 space-y-3">
                        <a
                            href="mailto:support@yetu.cd"
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-white transition hover:bg-amber-700"
                        >
                            Contacter le support
                        </a>

                        <Link
                            href={route('tenant.home')}
                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-amber-600 transition hover:bg-amber-100"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Retour à l'accueil
                        </Link>
                    </div>

                    <div className="mt-6 border-t border-gray-200 pt-6 text-center text-xs text-gray-500">
                        <p>support@yetu.cd • +243 (0)XX XXX XXXX</p>
                    </div>
                </div>
            </div>
        </>
    );
}
