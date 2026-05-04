<?php

namespace App\Http\Controllers;

use App\Enums\SnagStatus;
use App\Models\Project;
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

    public function show(Project $project): Response
    {
        $project->load([
            'snags' => fn ($q) => $q->orderByDesc('created_at'),
        ]);

        return Inertia::render('projects/show', [
            'project' => $project,
        ]);
    }
}
