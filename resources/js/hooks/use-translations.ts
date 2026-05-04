import { usePage } from '@inertiajs/react';

/**
 * Returns a translator that looks up keys in the locale bundle shared by Laravel.
 * Falls back to the key itself when no translation exists, and substitutes
 * `:placeholder` tokens with values from the second argument.
 */
export function useTranslations() {
    const { translations } = usePage().props;

    return function t(
        key: string,
        replacements: Record<string, string | number> = {},
    ): string {
        let value = translations[key] ?? key;

        for (const [token, replacement] of Object.entries(replacements)) {
            value = value.replaceAll(`:${token}`, String(replacement));
        }

        return value;
    };
}
