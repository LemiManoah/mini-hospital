<?php

namespace App\Enums;

enum EnumsMaritalStatus : string
{
    case SINGLE = 'single';
    case MARRIED = 'married';
    case DIVORCED = 'divorced';
    case WIDOWED = 'widowed';
    case SEPARATED = 'separated';
    case OTHER = 'other';


    public static function options(): array
    {
        return array_map(fn($case) => [
            'value' => $case->value,
            'label' => $case->name, // Or a custom label method for localization
        ], self::cases());
    }
}
