import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, ClipboardList, FolderKanban } from 'lucide-react';
import { type ComponentType } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from '@/hooks/use-translations';
import * as projectRoutes from '@/routes/projects';
import type { Project } from '@/types/domain';

interface Totals {
    projects: number;
    snags: number;
    open: number;
    in_progress: number;
    closed: number;
    critical_open: number;
}

interface Props {
    projects: Project[];
    totals: Totals;
}

export default function Dashboard({ projects, totals }: Props) {
    const t = useTranslations();

    return (
        <>
            <Head title={t('Dashboard')} />

            <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {t('Dashboard')}
                    </h1>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <KpiCard
                        icon={FolderKanban}
                        label={t('Projects')}
                        value={totals.projects}
                    />
                    <KpiCard
                        icon={ClipboardList}
                        label={t('Snags')}
                        value={totals.snags}
                    />
                    <KpiCard
                        icon={ClipboardList}
                        label={t('Open')}
                        value={totals.open}
                        tone="text-red-700 dark:text-red-300"
                    />
                    <KpiCard
                        icon={AlertTriangle}
                        label={`${t('Critical')} · ${t('Open')}`}
                        value={totals.critical_open}
                        tone="text-orange-700 dark:text-orange-300"
                    />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            {t('Projects')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {projects.length === 0 ? (
                            <p className="px-6 py-12 text-center text-sm text-muted-foreground">
                                {t('No projects yet')}
                            </p>
                        ) : (
                            <ul className="divide-y divide-border">
                                {projects.map((project) => (
                                    <ProjectRow
                                        key={project.id}
                                        project={project}
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

function KpiCard({
    icon: Icon,
    label,
    value,
    tone,
}: {
    icon: ComponentType<{ className?: string }>;
    label: string;
    value: number;
    tone?: string;
}) {
    return (
        <Card>
            <CardContent className="flex items-center gap-3 p-4">
                <div className="flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Icon className="size-5" />
                </div>
                <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p
                        className={`text-2xl font-semibold tabular-nums ${tone ?? ''}`}
                    >
                        {value}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

function ProjectRow({ project }: { project: Project }) {
    const t = useTranslations();

    return (
        <li>
            <Link
                href={projectRoutes.show(project.id).url}
                className="flex flex-col gap-3 px-4 py-3 transition hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
            >
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium" dir="auto">
                        {project.name}
                    </p>
                    <p
                        className="truncate text-xs text-muted-foreground"
                        dir="auto"
                    >
                        {project.client} · {project.location}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                    <Stat
                        label={t('Open')}
                        value={project.open_count ?? 0}
                        tone="text-red-700 dark:text-red-300"
                    />
                    <Stat
                        label={t('In Progress')}
                        value={project.in_progress_count ?? 0}
                        tone="text-blue-700 dark:text-blue-300"
                    />
                    <Stat
                        label={t('Closed')}
                        value={project.closed_count ?? 0}
                        tone="text-emerald-700 dark:text-emerald-300"
                    />
                </div>
            </Link>
        </li>
    );
}

function Stat({
    label,
    value,
    tone,
}: {
    label: string;
    value: number;
    tone: string;
}) {
    return (
        <span className="inline-flex items-baseline gap-1">
            <span className={`text-sm font-semibold ${tone}`}>{value}</span>
            <span className="text-muted-foreground">{label}</span>
        </span>
    );
}
