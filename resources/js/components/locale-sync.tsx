import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

/**
 * Keeps <html lang> and <html dir> in sync with the locale shared by Laravel,
 * so RTL flips immediately when the user toggles language without a full reload.
 */
export function LocaleSync() {
    const { locale, direction } = usePage().props;

    useEffect(() => {
        document.documentElement.lang = locale;
        document.documentElement.dir = direction;
    }, [locale, direction]);

    return null;
}
