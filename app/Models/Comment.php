<?php

namespace App\Models;

use Database\Factories\CommentFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comment extends Model
{
    /** @use HasFactory<CommentFactory> */
    use HasFactory;

    use HasUuids;

    protected $fillable = [
        'snag_id',
        'author',
        'body',
    ];

    /**
     * @return BelongsTo<Snag, $this>
     */
    public function snag(): BelongsTo
    {
        return $this->belongsTo(Snag::class);
    }
}
