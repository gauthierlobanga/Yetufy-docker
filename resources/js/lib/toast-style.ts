export default function getToastStyle(type: 'success' | 'error' = 'success') {
    const isDark = document.documentElement.classList.contains('dark');

    const styles = {
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
    };

    return isDark ? styles[type].dark : styles[type].light;
}


type ToastType = 'success' | 'error' | 'warning' | 'info';

export function getToastStyles(type: ToastType = 'success') {
    const isDark = document.documentElement.classList.contains('dark');

    const lightStyles: Record<ToastType, React.CSSProperties> = {
        success: {
            background: '#ecfdf5',
            color: '#064e3b',
            border: '1px solid #a7f3d0',
        },
        error: {
            background: '#fef2f2',
            color: '#991b1b',
            border: '1px solid #fecaca',
        },
        warning: {
            background: '#fffbeb',
            color: '#92400e',
            border: '1px solid #fde68a',
        },
        info: {
            background: '#eff6ff',
            color: '#1e3a8a',
            border: '1px solid #bfdbfe',
        },
    };

    const darkStyles: Record<ToastType, React.CSSProperties> = {
        success: {
            background: '#022c22',
            color: '#d1fae5',
            border: '1px solid #065f46',
        },
        error: {
            background: '#450a0a',
            color: '#fee2e2',
            border: '1px solid #7f1d1d',
        },
        warning: {
            background: '#422006',
            color: '#fef3c7',
            border: '1px solid #78350f',
        },
        info: {
            background: '#172554',
            color: '#dbeafe',
            border: '1px solid #1e3a8a',
        },
    };

    return isDark ? darkStyles[type] : lightStyles[type];
}
