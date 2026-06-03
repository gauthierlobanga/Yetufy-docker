import type { SyntheticEvent } from 'react';

export const DEFAULT_MEDIA_FALLBACK = '/storage/images/Vue-Storefront.png';

export function resolveImageUrl(
    image?: string | null,
    fallback = DEFAULT_MEDIA_FALLBACK,
): string {
    if (!image) {
        return fallback;
    }

    if (image.startsWith('http://') || image.startsWith('https://')) {
        return image;
    }

    if (image.startsWith('/')) {
        return image;
    }

    return `/storage/${image.replace(/^\//, '')}`;
}

export function handleImageFallback(
    fallback = DEFAULT_MEDIA_FALLBACK,
): (event: SyntheticEvent<HTMLImageElement>) => void {
    return (event) => {
        const image = event.currentTarget;

        if (image.dataset.fallbackApplied === 'true') {
            return;
        }

        image.dataset.fallbackApplied = 'true';
        image.src = fallback;
    };
}
