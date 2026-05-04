import { Head, Link } from '@inertiajs/react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from '@/hooks/use-translations';
import * as projectRoutes from '@/routes/projects';
import type { Project } from '@/types/domain';

interface Props {
    projects: Project[];
}

export default function ProjectsIndex({ projects }: Props) {
    const t = useTranslations();

    return (
        <>
            <Head title={t('Projects')} />

            <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {t('Projects')}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {projects.length}{' '}
                        {projects.length === 1 ? t('Project') : t('Projects')}
                    </p>
                </div>

                {projects.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-sm text-muted-foreground">
                            {t('No projects yet')}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

function ProjectCard({ project }: { project: Project }) {
    const t = useTranslations();

    return (
        <Link
            href={projectRoutes.show(project.id).url}
            className="group block rounded-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
            <Card className="h-full transition group-hover:border-foreground/30">
                <CardHeader className="space-y-1">
                    <CardTitle
                        className="line-clamp-2 text-base"
                        dir="auto"
                    >
                        {project.name}
                    </CardTitle>
                    <p
                        className="text-sm text-muted-foreground"
                        dir="auto"
                    >
                        {project.client}
                    </p>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <p
                        className="text-muted-foreground"
                        dir="auto"
                    >
                        {project.location}
                    </p>
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
                </CardContent>
            </Card>
        </Link>
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
