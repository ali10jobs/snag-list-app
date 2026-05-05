<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SnagController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::post('locale', [LocaleController::class, 'update'])->name('locale.update');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::get('projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::get('projects/{project}', [ProjectController::class, 'show'])->name('projects.show');

    Route::get('projects/{project}/snags/create', [SnagController::class, 'create'])->name('snags.create');
    Route::post('projects/{project}/snags', [SnagController::class, 'store'])->name('snags.store');
    Route::get('projects/{project}/snags/{snag}', [SnagController::class, 'show'])->name('snags.show');
    Route::get('projects/{project}/snags/{snag}/edit', [SnagController::class, 'edit'])->name('snags.edit');
    Route::patch('projects/{project}/snags/{snag}', [SnagController::class, 'update'])->name('snags.update');
    Route::patch('projects/{project}/snags/{snag}/status', [SnagController::class, 'updateStatus'])->name('snags.status');
    Route::post('projects/{project}/snags/{snag}/comments', [SnagController::class, 'addComment'])->name('snags.comments.store');
});

require __DIR__.'/settings.php';
