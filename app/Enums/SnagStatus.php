<?php

namespace App\Enums;

enum SnagStatus: string
{
    case Open = 'open';
    case InProgress = 'in-progress';
    case Closed = 'closed';
    case Rejected = 'rejected';

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_map(fn (self $c) => $c->value, self::cases());
    }
}
