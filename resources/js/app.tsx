/* eslint-disable import/order */
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import '../css/app.css';
import { initializeTheme } from '@/hooks/use-appearance';
import { configureEcho, echo } from '@laravel/echo-react';

configureEcho({
    broadcaster: 'reverb',
});

const reverbScheme =
    import.meta.env.VITE_REVERB_SCHEME ??
    (typeof window !== 'undefined' && window.location.protocol === 'https:'
        ? 'https'
        : 'http');
const reverbUsesTls = reverbScheme === 'https';
const reverbHost =
    import.meta.env.VITE_REVERB_HOST &&
    import.meta.env.VITE_REVERB_HOST !== '0.0.0.0'
        ? import.meta.env.VITE_REVERB_HOST
        : typeof window !== 'undefined'
          ? window.location.hostname
          : 'localhost';
const reverbPort = Number(
    import.meta.env.VITE_REVERB_PORT || (reverbUsesTls ? 443 : 8081),
);

configureEcho({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: reverbHost,
    wsPort: reverbPort,
    wssPort: reverbPort,
    forceTLS: reverbUsesTls,
    encrypted: reverbUsesTls,
    enabledTransports: [reverbUsesTls ? 'wss' : 'ws'],
});

if (typeof window !== 'undefined') {
    window.Echo = echo();
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <StrictMode>
                <TooltipProvider delayDuration={0}>
                    <App {...props} />
                </TooltipProvider>
            </StrictMode>,
        );
    },
    progress: {
        color: '#069f41',
    },
});

// This will set light / dark mode on load...
initializeTheme();
