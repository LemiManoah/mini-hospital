<?php

namespace App\Enums;

enum AppointmentStatus: string
{
    case SCHEDULED = 'scheduled';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';
    case NO_SHOW = 'no_show';

    public static function options(): array
    {
        return array_map(fn ($case) => [
            'value' => $case->value,
            'label' => ucfirst(str_replace('_', ' ', $case->value)),
        ], self::cases());
    }
}

