import { Badge } from '@/components/ui/badge';
import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';
import type { Severity } from '@/types/domain';

const STYLES: Record<Severity, string> = {
    critical:
        'border-red-300 bg-red-100 text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200',
    high: 'border-orange-300 bg-orange-100 text-orange-800 dark:border-orange-900/60 dark:bg-orange-950/40 dark:text-orange-200',
    medium: 'border-yellow-300 bg-yellow-100 text-yellow-800 dark:border-yellow-900/60 dark:bg-yellow-950/40 dark:text-yellow-200',
    low: 'border-neutral-300 bg-neutral-100 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
};

const LABELS: Record<Severity, string> = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
};

export function SeverityBadge({ severity }: { severity: Severity }) {
    const t = useTranslations();

    return (
        <Badge
            variant="outline"
            className={cn('font-medium', STYLES[severity])}
        >
            {t(LABELS[severity])}
        </Badge>
    );
}
