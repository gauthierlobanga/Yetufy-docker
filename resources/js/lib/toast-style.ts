import type React from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastTheme {
    background: string;
    color: string;
    border: string;
}

const toastStyles: Record<ToastType, { light: ToastTheme; dark: ToastTheme }> =
    {
        success: {
            light: {
                background: '#ecfdf5',
                color: '#064e3b',
                border: '1px solid #a7f3d0',
            },
            dark: {
                background: '#022c22',
                color: '#d1fae5',
                border: '1px solid #065f46',
            },
        },
        error: {
            light: {
                background: '#fef2f2',
                color: '#991b1b',
                border: '1px solid #fecaca',
            },
            dark: {
                background: '#450a0a',
                color: '#fee2e2',
                border: '1px solid #7f1d1d',
            },
        },
        info: {
            light: {
                background: '#f0fdfa',
                color: '#115e59',
                border: '1px solid #99f6e4',
            },
            dark: {
                background: '#042f2e',
                color: '#ccfbf1',
                border: '1px solid #134e4a',
            },
        },
        warning: {
            light: {
                background: '#fffbeb',
                color: '#92400e',
                border: '1px solid #fde68a',
            },
            dark: {
                background: '#451a03',
                color: '#fef3c7',
                border: '1px solid #78350f',
            },
        },
    };

export default function getToastStyle(type: ToastType): React.CSSProperties {
    const isDark = document.documentElement.classList.contains('dark');

    return (
        isDark ? toastStyles[type].dark : toastStyles[type].light
    ) as React.CSSProperties;
}
