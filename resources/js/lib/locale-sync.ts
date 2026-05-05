import { router } from '@inertiajs/core';

/**
 * Keep <html lang> and <html dir> in sync with the locale shared by Laravel
 * across Inertia partial visits. The blade root template already sets the
 * correct lang/dir on first paint; this listener handles subsequent visits
 * (e.g. when the user toggles language) where blade is not re-rendered.
 *
 * Lives outside the React tree so it doesn't depend on usePage(), which is
 * only available inside the Inertia <App />.
 */
export function initializeLocaleSync(): void {
    router.on('success', (event) => {
        const props = event.detail.page.props as {
            locale?: unknown;
            direction?: unknown;
        };

        if (typeof props.locale === 'string') {
            document.documentElement.lang = props.locale;
        }
        if (props.direction === 'ltr' || props.direction === 'rtl') {
            document.documentElement.dir = props.direction;
        }
    });
}
