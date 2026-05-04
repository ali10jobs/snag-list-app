import { router, usePage } from '@inertiajs/react';
import { Languages } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslations } from '@/hooks/use-translations';
import type { Locale } from '@/types/global';

const LOCALES: Array<{ value: Locale; label: string }> = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'العربية' },
];

export function LocaleToggle() {
    const { locale } = usePage().props;
    const t = useTranslations();

    const setLocale = (next: Locale) => {
        if (next === locale) return;
        router.post(
            '/locale',
            { locale: next },
            { preserveScroll: true, preserveState: false },
        );
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={t('Language')}>
                    <Languages className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {LOCALES.map((option) => (
                    <DropdownMenuItem
                        key={option.value}
                        onSelect={() => setLocale(option.value)}
                        className={
                            option.value === locale ? 'font-semibold' : undefined
                        }
                    >
                        {option.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
