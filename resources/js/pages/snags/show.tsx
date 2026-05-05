import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { type FormEvent } from 'react';

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
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from '@/hooks/use-translations';
import * as projectRoutes from '@/routes/projects';
import * as snagRoutes from '@/routes/snags';
import * as snagCommentRoutes from '@/routes/snags/comments';
import type { Comment, Snag, SnagStatus } from '@/types/domain';

interface Props {
    project: { id: string; name: string; client: string; location: string };
    snag: Snag & { comments: Comment[] };
    statuses: SnagStatus[];
}

const STATUS_LABELS: Record<SnagStatus, string> = {
    open: 'Open',
    'in-progress': 'In Progress',
    closed: 'Closed',
    rejected: 'Rejected',
};

const TRADE_LABELS: Record<string, string> = {
    electrical: 'Electrical',
    plumbing: 'Plumbing',
    mep: 'MEP',
    civil: 'Civil',
    finishing: 'Finishing',
    structural: 'Structural',
    hvac: 'HVAC',
};

export default function SnagShow({ project, snag, statuses }: Props) {
    const t = useTranslations();
    const { locale } = usePage().props;
    const comments = snag.comments ?? [];

    const handleStatusChange = (next: SnagStatus) => {
        if (next === snag.status) return;
        router.patch(
            snagRoutes.status({ project: project.id, snag: snag.id }).url,
            { status: next },
            { preserveScroll: true },
        );
    };

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

                <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-3">
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
                        <p
                            className="text-sm text-muted-foreground"
                            dir="auto"
                        >
                            {snag.location}
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link
                            href={
                                snagRoutes.edit({
                                    project: project.id,
                                    snag: snag.id,
                                }).url
                            }
                        >
                            <Pencil className="size-4" />
                            {t('Edit')}
                        </Link>
                    </Button>
                </header>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            {t('Status')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Select
                            value={snag.status}
                            onValueChange={(v) =>
                                handleStatusChange(v as SnagStatus)
                            }
                        >
                            <SelectTrigger className="w-full sm:w-[220px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map((s) => (
                                    <SelectItem key={s} value={s}>
                                        {t(STATUS_LABELS[s])}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

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
                                ? new Date(snag.due_date).toLocaleDateString(
                                      locale === 'ar' ? 'en-GB' : undefined,
                                  )
                                : '—'
                        }
                    />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            {t('Activity')} ({comments.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {comments.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                {t('No activity yet.')}
                            </p>
                        ) : (
                            <ul className="space-y-3">
                                {comments.map((c) => (
                                    <CommentItem
                                        key={c.id}
                                        comment={c}
                                        locale={locale}
                                    />
                                ))}
                            </ul>
                        )}

                        <CommentForm
                            projectId={project.id}
                            snagId={snag.id}
                        />
                    </CardContent>
                </Card>
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

function CommentItem({
    comment,
    locale,
}: {
    comment: Comment & { is_system?: boolean };
    locale: string;
}) {
    const t = useTranslations();
    const isSystem = comment.is_system === true;
    const when = new Date(comment.created_at).toLocaleString(
        locale === 'ar' ? 'en-GB' : undefined,
    );

    return (
        <li
            className={
                isSystem
                    ? 'rounded-md border border-dashed bg-muted/30 px-3 py-2 text-xs text-muted-foreground'
                    : 'rounded-md border bg-background px-3 py-2 text-sm'
            }
        >
            <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-medium" dir="auto">
                    {isSystem ? t('System') : comment.author}
                </span>
                <span className="text-xs text-muted-foreground">{when}</span>
            </div>
            <p className="mt-1 whitespace-pre-line" dir="auto">
                {isSystem ? translateSystemBody(comment.body, t) : comment.body}
            </p>
        </li>
    );
}

function translateSystemBody(
    body: string,
    t: ReturnType<typeof useTranslations>,
): string {
    // System comments are emitted with English status names; replace them
    // in-place so the activity feed reads correctly under the active locale.
    return body
        .replace('Open', t('Open'))
        .replace('In Progress', t('In Progress'))
        .replace('Closed', t('Closed'))
        .replace('Rejected', t('Rejected'))
        .replace(
            'Status changed from',
            t('Status changed from'),
        )
        .replace(' to ', ` ${t('to')} `);
}

function CommentForm({
    projectId,
    snagId,
}: {
    projectId: string;
    snagId: string;
}) {
    const t = useTranslations();
    const form = useForm<{ body: string }>({ body: '' });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        form.submit(
            'post',
            snagCommentRoutes.store({ project: projectId, snag: snagId }).url,
            {
                preserveScroll: true,
                onSuccess: () => form.reset('body'),
            },
        );
    };

    return (
        <form onSubmit={submit} className="space-y-2 pt-2" noValidate>
            <Textarea
                value={form.data.body}
                onChange={(e) => form.setData('body', e.target.value)}
                placeholder={t('Write a comment…')}
                rows={3}
                dir="auto"
            />
            {form.errors.body && (
                <p className="text-xs text-destructive">{form.errors.body}</p>
            )}
            <div className="flex justify-end">
                <Button
                    type="submit"
                    size="sm"
                    disabled={form.processing || !form.data.body.trim()}
                >
                    {t('Add comment')}
                </Button>
            </div>
        </form>
    );
}
