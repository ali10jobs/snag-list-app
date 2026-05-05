import { type FormEvent, useState } from 'react';
import { useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from '@/hooks/use-translations';
import type { Severity, Trade } from '@/types/domain';

const TRADE_LABELS: Record<Trade, string> = {
    electrical: 'Electrical',
    plumbing: 'Plumbing',
    mep: 'MEP',
    civil: 'Civil',
    finishing: 'Finishing',
    structural: 'Structural',
    hvac: 'HVAC',
};

const SEVERITY_LABELS: Record<Severity, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
};

export interface SnagFormInitial {
    title?: string;
    description?: string;
    location?: string;
    trade?: Trade | '';
    severity?: Severity | '';
    assigned_to?: string | null;
    due_date?: string | null;
    photo_path?: string | null;
}

interface FormData {
    title: string;
    description: string;
    location: string;
    trade: Trade | '';
    severity: Severity | '';
    assigned_to: string;
    due_date: string;
    photo: File | null;
    remove_photo: boolean;
    /** Laravel reads the HTTP method from this when forceFormData spoofs POST. */
    _method?: 'patch';
}

interface Props {
    method: 'post' | 'patch';
    action: string;
    initial?: SnagFormInitial;
    trades: Trade[];
    severities: Severity[];
    cancelHref: string;
    submitLabel: string;
}

export function SnagForm({
    method,
    action,
    initial,
    trades,
    severities,
    cancelHref,
    submitLabel,
}: Props) {
    const t = useTranslations();
    const existingPhoto = initial?.photo_path ?? null;

    const form = useForm<FormData>({
        title: initial?.title ?? '',
        description: initial?.description ?? '',
        location: initial?.location ?? '',
        trade: (initial?.trade ?? '') as Trade | '',
        severity: (initial?.severity ?? '') as Severity | '',
        assigned_to: initial?.assigned_to ?? '',
        due_date: (initial?.due_date ?? '').slice(0, 10),
        photo: null,
        remove_photo: false,
        ...(method === 'patch' ? { _method: 'patch' as const } : {}),
    });

    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        // PATCH multipart isn't natively supported by browsers, so we POST
        // with method spoofing whenever there's a file involved.
        form.submit('post', action, { forceFormData: true });
    };

    const handlePhoto = (file: File | null) => {
        form.setData((current) => ({
            ...current,
            photo: file,
            remove_photo: file ? false : current.remove_photo,
        }));
        setPhotoPreview(file ? URL.createObjectURL(file) : null);
    };

    return (
        <form onSubmit={submit} className="space-y-6" noValidate>
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">{t('Snag')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Field
                        id="title"
                        label={t('Title')}
                        error={form.errors.title}
                    >
                        <Input
                            id="title"
                            autoFocus
                            required
                            value={form.data.title}
                            onChange={(e) =>
                                form.setData('title', e.target.value)
                            }
                            dir="auto"
                        />
                    </Field>

                    <Field
                        id="description"
                        label={t('Description')}
                        error={form.errors.description}
                    >
                        <Textarea
                            id="description"
                            required
                            rows={4}
                            value={form.data.description}
                            onChange={(e) =>
                                form.setData('description', e.target.value)
                            }
                            dir="auto"
                        />
                    </Field>

                    <Field
                        id="location"
                        label={t('Location')}
                        error={form.errors.location}
                    >
                        <Input
                            id="location"
                            required
                            placeholder="Level 3, Unit 304, Master Bathroom"
                            value={form.data.location}
                            onChange={(e) =>
                                form.setData('location', e.target.value)
                            }
                            dir="auto"
                        />
                    </Field>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field
                            id="trade"
                            label={t('Trade')}
                            error={form.errors.trade}
                        >
                            <Select
                                value={form.data.trade}
                                onValueChange={(v) =>
                                    form.setData('trade', v as Trade)
                                }
                            >
                                <SelectTrigger id="trade">
                                    <SelectValue placeholder={t('Trade')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {trades.map((tr) => (
                                        <SelectItem key={tr} value={tr}>
                                            {t(TRADE_LABELS[tr])}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field
                            id="severity"
                            label={t('Severity')}
                            error={form.errors.severity}
                        >
                            <Select
                                value={form.data.severity}
                                onValueChange={(v) =>
                                    form.setData('severity', v as Severity)
                                }
                            >
                                <SelectTrigger id="severity">
                                    <SelectValue
                                        placeholder={t('Severity')}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {severities.map((sv) => (
                                        <SelectItem key={sv} value={sv}>
                                            {t(SEVERITY_LABELS[sv])}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field
                            id="assigned_to"
                            label={t('Assigned to')}
                            error={form.errors.assigned_to}
                        >
                            <Input
                                id="assigned_to"
                                placeholder="ABC Electrical Contractors"
                                value={form.data.assigned_to}
                                onChange={(e) =>
                                    form.setData(
                                        'assigned_to',
                                        e.target.value,
                                    )
                                }
                                dir="auto"
                            />
                        </Field>

                        <Field
                            id="due_date"
                            label={t('Due date')}
                            error={form.errors.due_date}
                        >
                            <Input
                                id="due_date"
                                type="date"
                                value={form.data.due_date}
                                onChange={(e) =>
                                    form.setData('due_date', e.target.value)
                                }
                            />
                        </Field>
                    </div>

                    <Field
                        id="photo"
                        label={t('Photo')}
                        error={form.errors.photo}
                    >
                        <Input
                            id="photo"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) =>
                                handlePhoto(e.target.files?.[0] ?? null)
                            }
                        />

                        {photoPreview ? (
                            <img
                                src={photoPreview}
                                alt=""
                                className="mt-2 h-40 w-full rounded-md border object-cover"
                            />
                        ) : existingPhoto && !form.data.remove_photo ? (
                            <div className="mt-2 space-y-2">
                                <img
                                    src={`/storage/${existingPhoto}`}
                                    alt=""
                                    className="h-40 w-full rounded-md border object-cover"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        form.setData('remove_photo', true)
                                    }
                                >
                                    {t('Remove photo')}
                                </Button>
                            </div>
                        ) : null}
                    </Field>
                </CardContent>
            </Card>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                    type="button"
                    variant="ghost"
                    asChild
                    disabled={form.processing}
                >
                    <a href={cancelHref}>{t('Cancel')}</a>
                </Button>
                <Button type="submit" disabled={form.processing}>
                    {form.processing ? '…' : submitLabel}
                </Button>
            </div>
        </form>
    );
}

function Field({
    id,
    label,
    error,
    children,
}: {
    id: string;
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={id}>{label}</Label>
            {children}
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}
