import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, Home, Mail } from 'lucide-react';

export default function NoSubscription() {
    return (
        <>
            <Head title="Pas d'abonnement" />

            <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-blue-100 p-4">
                <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-blue-100 p-3">
                            <AlertTriangle className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>

                    <h1 className="mt-4 text-center text-3xl font-bold text-blue-900">
                        Pas d'abonnement
                    </h1>

                    <p className="mt-3 text-center text-blue-700">
                        Aucune subscription n'a été trouvée pour votre compte.
                    </p>

                    <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                        <p className="font-semibold">Que faire?</p>
                        <ul className="mt-2 list-inside list-disc space-y-1">
                            <li>Vérifiez votre accès au compte</li>
                            <li>Contactez notre support</li>
                            <li>Créez une nouvelle boutique</li>
                        </ul>
                    </div>

                    <div className="mt-8 space-y-3">
                        <Link
                            href={route('tenant.home')}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                        >
                            <Home className="h-4 w-4" />
                            Retour à l'accueil
                        </Link>

                        <a
                            href="mailto:support@yetu.cd"
                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-blue-600 transition hover:bg-blue-100"
                        >
                            <Mail className="h-4 w-4" />
                            Contacter le support
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
