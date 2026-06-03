import { ArrowRight } from 'lucide-react';
import {  FaFacebook, FaMicrosoft, FaInstagram } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Provider = {
    name: string;
    label: string;
    icon: React.ReactNode;
    iconClassName?: string;
};

const providers: Provider[] = [
    {
        name: 'google',
        label: 'Google',
        icon: <FcGoogle className="h-10 w-10" />,
    },
    {
        name: 'facebook',
        label: 'Facebook',
        icon: <FaFacebook className="h-10 w-10 text-[#1877F2]" />,
    },
    {
        name: 'instagram',
        label: 'Instagram',
        icon: <FaInstagram className="h-10 w-10 text-[#E4405F]" />,
    },
    {
        name: 'microsoft',
        label: 'Microsoft',
        icon: <FaMicrosoft className="h-10 w-10 text-[#1a7fcd] dark:text-white" />,
    },
];

export function SocialLoginButtons() {
    const getSocialUrl = (provider: string): string | null => {
        try {
            return route('tenant.socialitie.redirect', provider);
        } catch {
            return null;
        }
    };

    // Filtrer les providers disponibles
    const availableProviders = providers.filter(
        (provider) => getSocialUrl(provider.name) !== null
    );

    // Si aucun provider n'est disponible, ne pas afficher les boutons
    if (availableProviders.length === 0) {
        return null;
    }

    const gridCols = availableProviders.length <= 2 ? 'grid-cols-2' : 'grid-cols-4';

    return (
        <div className={cn('grid gap-3', gridCols)}>
            {availableProviders.map((provider) => {
                const url = getSocialUrl(provider.name);

                return (
                    <a
                        key={provider.name}
                        href={url ?? undefined}
                        aria-label={`Continuer avec ${provider.label}`}
                        title={`Continuer avec ${provider.label}`}
                    >
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            className={cn(
                                'group relative h-12 w-full border border-slate-200/80 bg-white/80 px-1.5 transition-all duration-300',
                                'hover:-translate-y-0.5 hover:border-emerald-300/60 hover:bg-white hover:shadow-lg hover:shadow-emerald-500/10',
                                'dark:border-slate-700/80 dark:bg-slate-900/70',
                                'dark:hover:border-emerald-500/40 dark:hover:bg-slate-900'
                            )}
                        >
                            {/* Glow subtil */}
                            <span className="absolute inset-0 rounded-2xl bg-linear-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                            {/* Contenu */}
                            <span className="relative flex items-center justify-center gap-2">
                                {provider.icon}
                                {/* <span className="hidden text-sm font-medium sm:inline">
                                    {provider.label}
                                </span> */}
                            </span>

                            {/* Indicateur discret au hover */}
                            <span className="absolute top-2 right-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                                <ArrowRight className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            </span>
                        </Button>
                    </a>
                );
            })}
        </div>
    );
}
