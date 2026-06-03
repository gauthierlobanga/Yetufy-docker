import { echo } from '@laravel/echo-react';
import { useEffect } from 'react';

export function useEcho(channel: string, event: string, callback: (data: any) => void) {
    useEffect(() => {
        // echo() retourne l'instance Echo configurée
        const instance = echo();

        if (!instance) {
            return;
        }

        const subscription = instance.channel(channel).listen(event, callback);

        return () => {
            subscription.stopListening(event);
        };
    }, [channel, event, callback]);
}
