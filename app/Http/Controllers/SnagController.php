<?php

namespace App\Http\Controllers;

use App\Enums\Severity;
use App\Enums\SnagStatus;
use App\Enums\Trade;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\StoreSnagRequest;
use App\Http\Requests\UpdateSnagRequest;
use App\Http\Requests\UpdateSnagStatusRequest;
use App\Models\Project;
use App\Models\Snag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
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
        $this->ensureScope($project, $snag);

        $snag->load(['comments' => fn ($q) => $q->orderBy('created_at')]);

        return Inertia::render('snags/show', [
            'project' => $project->only(['id', 'name', 'client', 'location']),
            'snag' => $snag,
            'statuses' => SnagStatus::values(),
        ]);
    }

    public function edit(Project $project, Snag $snag): Response
    {
        $this->ensureScope($project, $snag);

        return Inertia::render('snags/edit', [
            'project' => $project->only(['id', 'name', 'client', 'location']),
            'snag' => $snag->only([
                'id',
                'title',
                'description',
                'location',
                'trade',
                'severity',
                'assigned_to',
                'due_date',
                'photo_path',
            ]),
            'trades' => Trade::values(),
            'severities' => Severity::values(),
        ]);
    }

    public function update(
        UpdateSnagRequest $request,
        Project $project,
        Snag $snag,
    ): RedirectResponse {
        $this->ensureScope($project, $snag);

        $data = $request->validated();
        $removePhoto = (bool) ($data['remove_photo'] ?? false);
        unset($data['remove_photo']);

        if ($request->hasFile('photo')) {
            if ($snag->photo_path) {
                Storage::disk('public')->delete($snag->photo_path);
            }
            $data['photo_path'] = $request->file('photo')->store('snags', 'public');
        } elseif ($removePhoto && $snag->photo_path) {
            Storage::disk('public')->delete($snag->photo_path);
            $data['photo_path'] = null;
        }

        unset($data['photo']);

        $snag->update($data);

        return redirect()
            ->route('snags.show', ['project' => $project, 'snag' => $snag])
            ->with('success', __('Snag updated.'));
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

    public function updateStatus(
        UpdateSnagStatusRequest $request,
        Project $project,
        Snag $snag,
    ): RedirectResponse {
        $this->ensureScope($project, $snag);

        $snag->update(['status' => $request->validated('status')]);

        return back()->with('success', __('Status updated.'));
    }

    public function addComment(
        StoreCommentRequest $request,
        Project $project,
        Snag $snag,
    ): RedirectResponse {
        $this->ensureScope($project, $snag);

        $snag->comments()->create([
            'author' => Auth::user()?->name ?? 'Anonymous',
            'body' => $request->validated('body'),
            'is_system' => false,
        ]);

        return back()->with('success', __('Comment added.'));
    }

    private function ensureScope(Project $project, Snag $snag): void
    {
        abort_unless($snag->project_id === $project->id, 404);
    }
}
