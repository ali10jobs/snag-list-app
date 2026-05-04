import { usePage } from '@inertiajs/react';

import { useTranslations } from '@/hooks/use-translations';

export function DemoBanner() {
    const { demoMode } = usePage().props;
    const t = useTranslations();

    if (!demoMode) return null;

    return (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200">
            {t('Demo data — sign in as demo@snags.test / password')}
        </div>
    );
}
