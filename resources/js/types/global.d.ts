import type { Auth } from '@/types/auth';

export type Locale = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

export interface Flash {
    success: string | null;
    error: string | null;
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            locale: Locale;
            direction: Direction;
            translations: Record<string, string>;
            demoMode: boolean;
            flash: Flash;
            [key: string]: unknown;
        };
    }
}
