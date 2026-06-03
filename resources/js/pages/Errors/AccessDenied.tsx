import { Head, Link } from '@inertiajs/react';
import { XCircle, ArrowLeft, Mail } from 'lucide-react';

type Props = {
    message: string;
};

export default function AccessDenied({ message }: Props) {
    return (
        <>
            <Head title="Accès refusé" />

            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
                <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-red-100 p-3">
                            <XCircle className="h-8 w-8 text-red-600" />
                        </div>
                    </div>

                    <h1 className="mt-4 text-center text-3xl font-bold text-red-900">
                        Accès refusé
                    </h1>

                    <p className="mt-3 text-center text-red-700">
                        {message ||
                            'Votre accès a été bloqué. Veuillez contacter notre support.'}
                    </p>

                    <div className="mt-8 space-y-3">
                        <a
                            href="mailto:support@yetu.cd"
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
                        >
                            <Mail className="h-4 w-4" />
                            Contacter le support
                        </a>

                        <Link
                            href={route('tenant.home')}
                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-red-600 transition hover:bg-red-100"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Retour à l'accueil
                        </Link>
                    </div>

                    <div className="mt-6 border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
                        <p>Besoin d'aide?</p>
                        <a
                            href={route('tenant.page.help')}
                            className="text-red-600 hover:underline"
                        >
                            Centre d'aide
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
