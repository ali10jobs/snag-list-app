<?php

namespace App\Enums;

enum Trade: string
{
    case Electrical = 'electrical';
    case Plumbing = 'plumbing';
    case Mep = 'mep';
    case Civil = 'civil';
    case Finishing = 'finishing';
    case Structural = 'structural';
    case Hvac = 'hvac';

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_map(fn (self $c) => $c->value, self::cases());
    }
}
