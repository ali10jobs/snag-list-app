<?php

namespace App\Models;

use App\Enums\Severity;
use App\Enums\SnagStatus;
use App\Enums\Trade;
use App\Observers\SnagObserver;
use Database\Factories\SnagFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[ObservedBy(SnagObserver::class)]
class Snag extends Model
{
    /** @use HasFactory<SnagFactory> */
    use HasFactory;

    use HasUuids;

    protected $fillable = [
        'project_id',
        'title',
        'description',
        'location',
        'trade',
        'severity',
        'status',
        'photo_path',
        'assigned_to',
        'due_date',
    ];

    protected function casts(): array
    {
        return [
            'trade' => Trade::class,
            'severity' => Severity::class,
            'status' => SnagStatus::class,
            'due_date' => 'date',
        ];
    }

    /**
     * @return BelongsTo<Project, $this>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * @return HasMany<Comment, $this>
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }
}
