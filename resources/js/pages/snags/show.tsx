import { Head, Link } from '@inertiajs/react';

import { SeverityBadge } from '@/components/severity-badge';
import { StatusBadge } from '@/components/status-badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslations } from '@/hooks/use-translations';
import * as projectRoutes from '@/routes/projects';
import type { Snag } from '@/types/domain';

interface Props {
    project: { id: string; name: string; client: string; location: string };
    snag: Snag;
}

const TRADE_LABELS: Record<string, string> = {
    electrical: 'Electrical',
    plumbing: 'Plumbing',
    mep: 'MEP',
    civil: 'Civil',
    finishing: 'Finishing',
    structural: 'Structural',
    hvac: 'HVAC',
};

export default function SnagShow({ project, snag }: Props) {
    const t = useTranslations();

    return (
        <>
            <Head title={snag.title} />

            <div className="mx-auto w-full max-w-3xl space-y-6 p-4 md:p-6">
                <div>
                    <Link
                        href={projectRoutes.show(project.id).url}
                        className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                    >
                        ← {project.name}
                    </Link>
                </div>

                <header className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={snag.status} />
                        <SeverityBadge severity={snag.severity} />
                        <span className="text-xs text-muted-foreground">
                            {t(TRADE_LABELS[snag.trade] ?? snag.trade)}
                        </span>
                    </div>
                    <h1
                        className="text-2xl font-semibold tracking-tight md:text-3xl"
                        dir="auto"
                    >
                        {snag.title}
                    </h1>
                    <p className="text-sm text-muted-foreground" dir="auto">
                        {snag.location}
                    </p>
                </header>

                {snag.photo_path && (
                    <Card className="overflow-hidden p-0">
                        <img
                            src={`/storage/${snag.photo_path}`}
                            alt=""
                            className="aspect-video w-full object-cover"
                        />
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            {t('Description')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p
                            className="whitespace-pre-line text-sm"
                            dir="auto"
                        >
                            {snag.description}
                        </p>
                    </CardContent>
                </Card>

                <div className="grid gap-3 sm:grid-cols-2">
                    <DetailRow
                        label={t('Assigned to')}
                        value={snag.assigned_to ?? '—'}
                    />
                    <DetailRow
                        label={t('Due date')}
                        value={
                            snag.due_date
                                ? new Date(
                                      snag.due_date,
                                  ).toLocaleDateString()
                                : '—'
                        }
                    />
                </div>

                <p className="text-xs text-muted-foreground">
                    {t(
                        'Status workflow and comments are coming next session.',
                    )}
                </p>
            </div>
        </>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <Card>
            <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 text-sm font-medium" dir="auto">
                    {value}
                </p>
            </CardContent>
        </Card>
    );
}
