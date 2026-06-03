import { Link } from '@inertiajs/react';
import {  LogIn } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { login } from '@/routes/tenant';
import type { User } from '@/types';

interface UserNavigationProps {
    user: User | null;
}

export function UserNavigation({ user }: UserNavigationProps) {
    const getInitials = useInitials();

    if (!user) {
        return (
            <Button
                variant="ghost"
                size="sm"
                asChild
                className="group h-10 rounded-full border border-slate-200 bg-white/80 px-4 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition-all hover:border-emerald-300 hover:bg-white hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-emerald-600 dark:hover:text-emerald-400"
            >
                <Link href={login()}>
                    <LogIn className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                    Connexion
                </Link>
            </Button>
        );
    }

    const avatarUrl =
        user.avatar_url?.startsWith('http') || user.avatar_url?.startsWith('/')
            ? user.avatar_url
            : undefined;
    const userName = user.name || 'Utilisateur';
    const userInitials = getInitials(userName);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className={cn(
                        'group relative h-10 rounded-full px-1.5 pr-2',
                        'bg-white/80',
                        'transition-all duration-300',
                        'hover:bg-white',
                        'dark:bg-slate-900/80',
                        'dark:hover:bg-slate-900',
                    )}
                >
                    <Avatar className="h-8 w-8">
                        {avatarUrl ? (
                            <AvatarImage src={avatarUrl} alt={userName} />
                        ) : (
                            <AvatarFallback className="bg-linear-to-br from-emerald-500 to-emerald-600 text-xs font-semibold text-white">
                                {userInitials}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    {/* <ChevronDown className="ml-2 h-4 w-4 text-slate-400 transition-all duration-300 group-hover:rotate-180 group-hover:text-emerald-500" /> */}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                sideOffset={12}
                className={cn(
                    'w-80 overflow-hidden rounded-3xl border border-slate-200/70 bg-white/95 shadow-2xl backdrop-blur-xl',
                    'dark:border-slate-800/70 dark:bg-slate-950/95 dark:shadow-black/40',
                    'animate-in duration-200 fade-in-0 zoom-in-95 slide-in-from-top-2',
                )}
            >
                <UserMenuContent user={user} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
