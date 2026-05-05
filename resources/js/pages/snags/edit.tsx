import { Head, Link } from '@inertiajs/react';

import { SnagForm, type SnagFormInitial } from '@/components/snag-form';
import { useTranslations } from '@/hooks/use-translations';
import * as snagRoutes from '@/routes/snags';
import type { Severity, Trade } from '@/types/domain';

interface Props {
    project: { id: string; name: string; client: string; location: string };
    snag: SnagFormInitial & { id: string };
    trades: Trade[];
    severities: Severity[];
}

export default function SnagsEdit({ project, snag, trades, severities }: Props) {
    const t = useTranslations();
    const cancelHref = snagRoutes.show({
        project: project.id,
        snag: snag.id,
    }).url;

    return (
        <>
            <Head title={t('Edit')} />

            <div className="mx-auto w-full max-w-2xl space-y-6 p-4 md:p-6">
                <div>
                    <Link
                        href={cancelHref}
                        className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                    >
                        ← {snag.title}
                    </Link>
                </div>

                <header>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {t('Edit snag')}
                    </h1>
                </header>

                <SnagForm
                    method="patch"
                    action={
                        snagRoutes.update({
                            project: project.id,
                            snag: snag.id,
                        }).url
                    }
                    initial={snag}
                    trades={trades}
                    severities={severities}
                    cancelHref={cancelHref}
                    submitLabel={t('Save')}
                />
            </div>
        </>
    );
}
