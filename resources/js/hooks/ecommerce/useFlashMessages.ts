import { router, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import getToastStyle from '@/lib/toast-style';

export function useFlashMessages() {
    const { flash } = usePage().props as any;
    const processed = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (!flash) {
            return;
        }

        const messages = [
            { type: 'success', content: flash.success },
            { type: 'error', content: flash.error },
        ];

        messages.forEach(({ type, content }) => {
            if (content && !processed.current.has(content)) {
                processed.current.add(content);

                if (type === 'success') {
                    toast.success(content, { style: getToastStyle('success') });
                } else if (type === 'error') {
                    toast.error(content, { style: getToastStyle('error') });
                }
            }
        });

        // Effacer les messages flash de la session via une requête silencieuse
        if (flash.success || flash.error) {
            router.post('/flash/clear', {}, { preserveState: true, replace: true });
        }
    }, [flash]);
}
