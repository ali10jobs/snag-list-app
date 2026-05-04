import { Badge } from '@/components/ui/badge';
import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';
import type { SnagStatus } from '@/types/domain';

const STYLES: Record<SnagStatus, string> = {
    open: 'border-red-300 bg-red-100 text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200',
    'in-progress':
        'border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200',
    closed: 'border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200',
    rejected:
        'border-neutral-300 bg-neutral-100 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
};

const LABELS: Record<SnagStatus, string> = {
    open: 'Open',
    'in-progress': 'In Progress',
    closed: 'Closed',
    rejected: 'Rejected',
};

export function StatusBadge({ status }: { status: SnagStatus }) {
    const t = useTranslations();

    return (
        <Badge
            variant="outline"
            className={cn('font-medium', STYLES[status])}
        >
            {t(LABELS[status])}
        </Badge>
    );
}
