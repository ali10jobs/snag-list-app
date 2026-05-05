<?php

namespace App\Http\Controllers;

use App\Enums\Severity;
use App\Enums\SnagStatus;
use App\Models\Project;
use App\Models\Snag;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $projects = Project::query()
            ->withCount([
                'snags as snags_count',
                'snags as open_count' => fn ($q) => $q->where('status', SnagStatus::Open->value),
                'snags as in_progress_count' => fn ($q) => $q->where('status', SnagStatus::InProgress->value),
                'snags as closed_count' => fn ($q) => $q->where('status', SnagStatus::Closed->value),
            ])
            ->orderByDesc('start_date')
            ->get();

        $totals = [
            'projects' => $projects->count(),
            'snags' => Snag::count(),
            'open' => Snag::where('status', SnagStatus::Open->value)->count(),
            'in_progress' => Snag::where('status', SnagStatus::InProgress->value)->count(),
            'closed' => Snag::where('status', SnagStatus::Closed->value)->count(),
            'critical_open' => Snag::where('status', SnagStatus::Open->value)
                ->where('severity', Severity::Critical->value)
                ->count(),
        ];

        return Inertia::render('dashboard', [
            'projects' => $projects,
            'totals' => $totals,
        ]);
    }
}
