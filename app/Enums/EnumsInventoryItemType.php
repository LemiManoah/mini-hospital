<?php

namespace App\Enums;

enum EnumsInventoryItemType: string
{
    case DRUG = 'drug';
    case CONSUMABLE = 'consumable';
    case GENERAL_SUPPLY = 'general_supply';

    public static function options(): array
    {
        return array_map(fn($case) => [
            'value' => $case->value,
            'label' => str_replace('_', ' ', ucfirst(strtolower($case->name))),
        ], self::cases());
    }
}
