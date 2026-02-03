<?php

namespace Database\Seeders;

use App\Models\InventoryItemCategory;
use Illuminate\Database\Seeder;

class InventoryItemCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Antimicrobial',
            'Antifungal',
            'Antiviral',
            'Antipyretic',
            'Analgesic',
            'Antihypertensive',
            'Antidiabetic',
            'Antiseptic',
            'IV Fluids',
            'Vaccines',
            'Surgical Supplies',
            'PPE',
            'Diagnostics',
            'General Consumables',
        ];

        foreach ($categories as $name) {
            InventoryItemCategory::firstOrCreate(
                ['name' => $name],
                ['is_active' => true]
            );
        }
    }
}
