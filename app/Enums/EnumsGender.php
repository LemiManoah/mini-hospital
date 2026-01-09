<?php

namespace App\Enums;

enum EnumsGender: string
{
    case MALE = 'male';
    case FEMALE = 'female';

    public static function options(): array
    {
        return array_map(fn($case) => [
            'value' => $case->value,
            'label' => $case->name, // Or a custom label method for localization
        ], self::cases());
    }
}
