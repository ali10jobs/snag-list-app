<?php

namespace App\Observers;

use App\Enums\SnagStatus;
use App\Models\Snag;
use Illuminate\Support\Facades\Auth;

class SnagObserver
{
    public function updated(Snag $snag): void
    {
        if (! $snag->wasChanged('status')) {
            return;
        }

        $original = $snag->getOriginal('status');
        $next = $snag->status;

        $from = $original instanceof SnagStatus
            ? $original->value
            : (string) $original;
        $to = $next instanceof SnagStatus ? $next->value : (string) $next;

        $snag->comments()->create([
            'author' => Auth::user()?->name ?? 'System',
            'body' => sprintf(
                'Status changed from %s to %s.',
                $this->humanize($from),
                $this->humanize($to),
            ),
            'is_system' => true,
        ]);
    }

    private function humanize(string $status): string
    {
        return match ($status) {
            SnagStatus::Open->value => 'Open',
            SnagStatus::InProgress->value => 'In Progress',
            SnagStatus::Closed->value => 'Closed',
            SnagStatus::Rejected->value => 'Rejected',
            default => ucfirst($status),
        };
    }
}
