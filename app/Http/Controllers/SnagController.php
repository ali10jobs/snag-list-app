<?php

namespace App\Http\Controllers;

use App\Enums\Severity;
use App\Enums\SnagStatus;
use App\Enums\Trade;
use App\Http\Requests\StoreSnagRequest;
use App\Models\Project;
use App\Models\Snag;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SnagController extends Controller
{
    public function create(Project $project): Response
    {
        return Inertia::render('snags/create', [
            'project' => $project->only(['id', 'name', 'client', 'location']),
            'trades' => Trade::values(),
            'severities' => Severity::values(),
            'statuses' => SnagStatus::values(),
        ]);
    }

    public function show(Project $project, Snag $snag): Response
    {
        abort_unless($snag->project_id === $project->id, 404);

        $snag->load(['comments' => fn ($q) => $q->orderBy('created_at')]);

        return Inertia::render('snags/show', [
            'project' => $project->only(['id', 'name', 'client', 'location']),
            'snag' => $snag,
        ]);
    }

    public function store(StoreSnagRequest $request, Project $project): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('photo')) {
            $data['photo_path'] = $request->file('photo')->store('snags', 'public');
        }

        unset($data['photo']);

        $project->snags()->create($data);

        return redirect()
            ->route('projects.show', $project)
            ->with('success', __('Snag created.'));
    }
}
