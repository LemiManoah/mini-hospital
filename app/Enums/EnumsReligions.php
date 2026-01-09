<?php

namespace App\Enums;

enum EnumsReligions : string
{
    case CHRISTIANITY = 'christianity';
    case ISLAM = 'islam';
    case HINDUISM = 'hinduism';
    case BUDDHISM = 'buddhism';
    case JUDAISM = 'judaism';
    case SIKHISM = 'sikhism';
    case OTHER = 'other';


    public static function options(): array
    {
        return array_map(fn($case) => [
            'value' => $case->value,
            'label' => $case->name, // Or a custom label method for localization
        ], self::cases());
    }
}
