import { LoaderIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
    return (
        <LoaderIcon
            className={cn('size-5 animate-spin', className)}
            {...props}
        />
    );
}

export function SpinnerCard() {
    return (
        <div className="flex items-center gap-4">
            <Spinner />
        </div>
    );
}
