import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';

import { SeverityBadge } from '@/components/severity-badge';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTranslations } from '@/hooks/use-translations';
import * as projectRoutes from '@/routes/projects';
import * as snagRoutes from '@/routes/snags';
import type {
    Project,
    Severity,
    Snag,
    SnagStatus,
    Trade,
} from '@/types/domain';

interface Filters {
    status: SnagStatus | null;
    severity: Severity | null;
    trade: Trade | null;
}

interface Props {
    project: Project;
    snags: Snag[];
    filters: Filters;
    options: {
        statuses: SnagStatus[];
        severities: Severity[];
        trades: Trade[];
    };
}

const STATUS_LABELS: Record<SnagStatus, string> = {
    open: 'Open',
    'in-progress': 'In Progress',
    closed: 'Closed',
    rejected: 'Rejected',
};

const SEVERITY_LABELS: Record<Severity, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
};

const TRADE_LABELS: Record<Trade, string> = {
    electrical: 'Electrical',
    plumbing: 'Plumbing',
    mep: 'MEP',
    civil: 'Civil',
    finishing: 'Finishing',
    structural: 'Structural',
    hvac: 'HVAC',
};

const ANY = '__any';

export default function ProjectShow({
    project,
    snags,
    filters,
    options,
}: Props) {
    const t = useTranslations();
    const hasActiveFilter = Boolean(
        filters.status || filters.severity || filters.trade,
    );

    const setFilter = (key: keyof Filters, value: string | null) => {
        const next = { ...filters, [key]: value };
        router.get(projectRoutes.show(project.id).url, dropEmpty(next), {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        router.get(projectRoutes.show(project.id).url, {}, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    return (
        <>
            <Head title={project.name} />

            <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
                <div>
                    <Link
                        href={projectRoutes.index().url}
                        className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                    >
                        ← {t('Projects')}
                    </Link>
                </div>

                <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                        <h1
                            className="text-2xl font-semibold tracking-tight md:text-3xl"
                            dir="auto"
                        >
                            {project.name}
                        </h1>
                        <p
                            className="text-sm text-muted-foreground"
                            dir="auto"
                        >
                            {project.client} · {project.location}
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={snagRoutes.create(project.id).url}>
                            <Plus className="size-4" />
                            {t('New snag')}
                        </Link>
                    </Button>
                </header>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            {t('Snags')} ({snags.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-0">
                        <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3 sm:px-6">
                            <FilterSelect
                                placeholder={t('Status')}
                                value={filters.status}
                                values={options.statuses}
                                labels={STATUS_LABELS}
                                onChange={(v) => setFilter('status', v)}
                            />
                            <FilterSelect
                                placeholder={t('Severity')}
                                value={filters.severity}
                                values={options.severities}
                                labels={SEVERITY_LABELS}
                                onChange={(v) => setFilter('severity', v)}
                            />
                            <FilterSelect
                                placeholder={t('Trade')}
                                value={filters.trade}
                                values={options.trades}
                                labels={TRADE_LABELS}
                                onChange={(v) => setFilter('trade', v)}
                            />
                            {hasActiveFilter && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                >
                                    {t('Clear')}
                                </Button>
                            )}
                        </div>
                        {snags.length === 0 ? (
                            <p className="px-6 py-12 text-center text-sm text-muted-foreground">
                                {hasActiveFilter
                                    ? t('No snags match the current filters.')
                                    : t('No snags yet')}
                            </p>
                        ) : (
                            <ul className="divide-y divide-border">
                                {snags.map((snag) => (
                                    <SnagRow
                                        key={snag.id}
                                        projectId={project.id}
                                        snag={snag}
                                    />
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

function FilterSelect<T extends string>({
    placeholder,
    value,
    values,
    labels,
    onChange,
}: {
    placeholder: string;
    value: T | null;
    values: T[];
    labels: Record<string, string>;
    onChange: (value: T | null) => void;
}) {
    const t = useTranslations();

    return (
        <Select
            value={value ?? ANY}
            onValueChange={(v) =>
                onChange(v === ANY ? null : (v as T))
            }
        >
            <SelectTrigger className="w-[160px]">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={ANY}>{t('All')}</SelectItem>
                {values.map((v) => (
                    <SelectItem key={v} value={v}>
                        {t(labels[v] ?? v)}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

function SnagRow({
    projectId,
    snag,
}: {
    projectId: string;
    snag: Snag;
}) {
    return (
        <li>
            <Link
                href={
                    snagRoutes.show({ project: projectId, snag: snag.id }).url
                }
                className="flex flex-col gap-3 px-4 py-3 transition hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
            >
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium" dir="auto">
                        {snag.title}
                    </p>
                    <p
                        className="truncate text-xs text-muted-foreground"
                        dir="auto"
                    >
                        {snag.location}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <SeverityBadge severity={snag.severity} />
                    <StatusBadge status={snag.status} />
                </div>
            </Link>
        </li>
    );
}

function dropEmpty(filters: Filters): Record<string, string> {
    const out: Record<string, string> = {};
    if (filters.status) out.status = filters.status;
    if (filters.severity) out.severity = filters.severity;
    if (filters.trade) out.trade = filters.trade;
    return out;
}
