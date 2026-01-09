<?php

namespace App\Enums;

enum EnumsKinRelationship : string
{
    case PARENT = 'parent';
    case SIBLING = 'sibling';
    case SPOUSE = 'spouse';
    case CHILD = 'child';
    case RELATIVE = 'relative';
    case FRIEND = 'friend';
    case OTHER = 'other';

    public static function options(): array
    {
        return array_map(fn($case) => [
            'value' => $case->value,
            'label' => $case->name, // Or a custom label method for localization
        ], self::cases());
    }
}

