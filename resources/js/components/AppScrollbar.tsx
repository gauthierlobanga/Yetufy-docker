// resources/js/Components/AppScrollbar.tsx
import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbars } from 'overlayscrollbars';
import { useEffect, useRef } from 'react';

export default function AppScrollbar({
    children,
}: {
    children: React.ReactNode;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const osInstanceRef = useRef<OverlayScrollbars | null>(null);

    useEffect(() => {
        if (containerRef.current) {
            osInstanceRef.current = OverlayScrollbars(containerRef.current, {
                scrollbars: {
                    theme: 'os-theme-light', // ou 'os-theme-dark' si tu gères le dark mode manuellement
                    visibility: 'auto', // visible uniquement au survol / scroll
                    autoHide: 'leave', // disparaît quand la souris quitte la zone (ou 'move')
                    autoHideDelay: 600, // délai avant disparition (ms)
                },
                overflow: {
                    x: 'hidden',
                    y: 'scroll',
                },
            });
        }

        return () => {
            osInstanceRef.current?.destroy();
        };
    }, []);

    return (
        <div ref={containerRef} className="h-screen w-full">
            {children}
        </div>
    );
}
