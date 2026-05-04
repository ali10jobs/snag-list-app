<?php

namespace App\Models;

use App\Enums\ProjectStatus;
use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    /** @use HasFactory<ProjectFactory> */
    use HasFactory;

    use HasUuids;

    protected $fillable = [
        'name',
        'client',
        'location',
        'start_date',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'status' => ProjectStatus::class,
        ];
    }

    /**
     * @return HasMany<Snag, $this>
     */
    public function snags(): HasMany
    {
        return $this->hasMany(Snag::class);
    }
}
