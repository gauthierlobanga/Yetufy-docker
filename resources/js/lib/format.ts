/**
 * Formate un prix selon la devise et la locale
 */
export function formatPrice(
    price: number,
    currency: string = 'EUR',
    locale: string = 'fr-FR'
): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(price);
}

/**
 * Formate un nombre avec séparateurs de milliers
 */
export function formatNumber(num: number, locale: string = 'fr-FR'): string {
    return new Intl.NumberFormat(locale).format(num);
}

/**
 * Formate un pourcentage
 */
export function formatPercent(value: number, locale: string = 'fr-FR'): string {
    return new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(value / 100);
}

/**
 * Formate une date relative
 */
export function formatRelativeDate(date: string | Date, locale: string = 'fr'): string {
    const now = new Date();
    const target = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

    const intervals = {
        année: 31536000,
        mois: 2592000,
        semaine: 604800,
        jour: 86400,
        heure: 3600,
        minute: 60,
    };

    for (const [unit, seconds] of Object.entries(intervals)) {
        const interval = Math.floor(diffInSeconds / seconds);
        if (interval >= 1) {
            return `Il y a ${interval} ${unit}${interval > 1 ? 's' : ''}`;
        }
    }

    return "À l'instant";
}

/**
 * Tronque un texte à une longueur maximale
 */
export function truncateText(text: string, maxLength: number = 100): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Génère un slug à partir d'un texte
 */
export function slugify(text: string): string {
    return text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
}

/**
 * Calcule le prix avec réduction
 */
export function calculateDiscountedPrice(
    originalPrice: number,
    discountPercentage: number
): number {
    return originalPrice * (1 - discountPercentage / 100);
}

/**
 * Calcule le pourcentage de réduction
 */
export function calculateDiscountPercentage(
    originalPrice: number,
    discountedPrice: number
): number {
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}
