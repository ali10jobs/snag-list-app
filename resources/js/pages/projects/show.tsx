import { Head, Link } from '@inertiajs/react';
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
import { useTranslations } from '@/hooks/use-translations';
import * as projectRoutes from '@/routes/projects';
import * as snagRoutes from '@/routes/snags';
import type { Project, Snag } from '@/types/domain';

interface Props {
    project: Project;
}

export default function ProjectShow({ project }: Props) {
    const t = useTranslations();
    const snags = project.snags ?? [];

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

                <div className="grid gap-3 sm:grid-cols-3">
                    <SummaryCard
                        label={t('Open')}
                        value={
                            snags.filter((s) => s.status === 'open').length
                        }
                    />
                    <SummaryCard
                        label={t('In Progress')}
                        value={
                            snags.filter((s) => s.status === 'in-progress')
                                .length
                        }
                    />
                    <SummaryCard
                        label={t('Closed')}
                        value={
                            snags.filter((s) => s.status === 'closed').length
                        }
                    />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            {t('Snags')} ({snags.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {snags.length === 0 ? (
                            <p className="px-6 py-12 text-center text-sm text-muted-foreground">
                                {t('No snags yet')}
                            </p>
                        ) : (
                            <ul className="divide-y divide-border">
                                {snags.map((snag) => (
                                    <SnagRow key={snag.id} snag={snag} />
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
    return (
        <Card>
            <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">
                    {value}
                </p>
            </CardContent>
        </Card>
    );
}

function SnagRow({ snag }: { snag: Snag }) {
    return (
        <li className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
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
        </li>
    );
}
