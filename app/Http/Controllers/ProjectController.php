<?php

namespace App\Http\Controllers;

use App\Enums\Severity;
use App\Enums\SnagStatus;
use App\Enums\Trade;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(): Response
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

        return Inertia::render('projects/index', [
            'projects' => $projects,
        ]);
    }

    public function show(Request $request, Project $project): Response
    {
        $filters = $request->validate([
            'status' => ['nullable', Rule::in(SnagStatus::values())],
            'severity' => ['nullable', Rule::in(Severity::values())],
            'trade' => ['nullable', Rule::in(Trade::values())],
        ]);

        $snags = $project->snags()
            ->when($filters['status'] ?? null, fn ($q, $v) => $q->where('status', $v))
            ->when($filters['severity'] ?? null, fn ($q, $v) => $q->where('severity', $v))
            ->when($filters['trade'] ?? null, fn ($q, $v) => $q->where('trade', $v))
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('projects/show', [
            'project' => $project,
            'snags' => $snags,
            'filters' => [
                'status' => $filters['status'] ?? null,
                'severity' => $filters['severity'] ?? null,
                'trade' => $filters['trade'] ?? null,
            ],
            'options' => [
                'statuses' => SnagStatus::values(),
                'severities' => Severity::values(),
                'trades' => Trade::values(),
            ],
        ]);
    }
}
