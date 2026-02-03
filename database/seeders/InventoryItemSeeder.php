<?php

namespace Database\Seeders;

use App\Models\InventoryItem;
use App\Models\InventoryItemCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class InventoryItemSeeder extends Seeder
{
    public function run(): void
    {
        $userId = User::query()->value('id');

        $categoryMap = InventoryItemCategory::query()
            ->pluck('id', 'name')
            ->toArray();

        $items = [
            [
                'name' => 'Paracetamol 500mg',
                'generic_name' => 'Paracetamol',
                'code' => 'DRG-PARA-500',
                'item_type' => 'drug',
                'category' => 'Antipyretic',
                'unit_of_measure' => 'tablet',
                'is_controlled' => false,
                'is_expirable' => true,
                'default_expiry_date' => '2028-12-31',
                'min_stock' => 100,
                'reorder_level' => 200,
                'cost_price' => 100.00,
                'selling_price' => 200.00,
                'notes' => 'Common fever and pain management',
            ],
            [
                'name' => 'Amoxicillin 500mg',
                'generic_name' => 'Amoxicillin',
                'code' => 'DRG-AMOX-500',
                'item_type' => 'drug',
                'category' => 'Antimicrobial',
                'unit_of_measure' => 'capsule',
                'is_controlled' => false,
                'is_expirable' => true,
                'default_expiry_date' => '2028-12-31',
                'min_stock' => 60,
                'reorder_level' => 120,
                'cost_price' => 250.00,
                'selling_price' => 450.00,
                'notes' => 'Broad spectrum antibiotic',
            ],
            [
                'name' => 'Fluconazole 150mg',
                'generic_name' => 'Fluconazole',
                'code' => 'DRG-FLUC-150',
                'item_type' => 'drug',
                'category' => 'Antifungal',
                'unit_of_measure' => 'capsule',
                'is_controlled' => false,
                'is_expirable' => true,
                'default_expiry_date' => '2028-12-31',
                'min_stock' => 20,
                'reorder_level' => 50,
                'cost_price' => 1200.00,
                'selling_price' => 2000.00,
                'notes' => 'Antifungal therapy',
            ],
            [
                'name' => 'Acyclovir 200mg',
                'generic_name' => 'Acyclovir',
                'code' => 'DRG-ACYC-200',
                'item_type' => 'drug',
                'category' => 'Antiviral',
                'unit_of_measure' => 'tablet',
                'is_controlled' => false,
                'is_expirable' => true,
                'default_expiry_date' => '2028-12-31',
                'min_stock' => 30,
                'reorder_level' => 60,
                'cost_price' => 800.00,
                'selling_price' => 1500.00,
                'notes' => 'Antiviral therapy',
            ],
            [
                'name' => 'Surgical Gloves (Medium)',
                'generic_name' => null,
                'code' => 'CON-GLOV-M',
                'item_type' => 'consumable',
                'category' => 'PPE',
                'unit_of_measure' => 'pair',
                'is_controlled' => false,
                'is_expirable' => false,
                'default_expiry_date' => null,
                'min_stock' => 200,
                'reorder_level' => 400,
                'cost_price' => 150.00,
                'selling_price' => 0.00,
                'notes' => 'Sterile surgical gloves',
            ],
            [
                'name' => 'Normal Saline 0.9% 500ml',
                'generic_name' => 'Sodium Chloride',
                'code' => 'DRG-NS-500',
                'item_type' => 'drug',
                'category' => 'IV Fluids',
                'unit_of_measure' => 'bottle',
                'is_controlled' => false,
                'is_expirable' => true,
                'default_expiry_date' => '2028-12-31',
                'min_stock' => 40,
                'reorder_level' => 80,
                'cost_price' => 1200.00,
                'selling_price' => 2000.00,
                'notes' => 'IV fluid',
            ],
            [
                'name' => 'Syringe 5ml',
                'generic_name' => null,
                'code' => 'CON-SYR-5',
                'item_type' => 'consumable',
                'category' => 'General Consumables',
                'unit_of_measure' => 'piece',
                'is_controlled' => false,
                'is_expirable' => false,
                'default_expiry_date' => null,
                'min_stock' => 300,
                'reorder_level' => 600,
                'cost_price' => 50.00,
                'selling_price' => 0.00,
                'notes' => 'Disposable syringe',
            ],
            [
                'name' => 'Thermometer (Digital)',
                'generic_name' => null,
                'code' => 'GEN-THERM-01',
                'item_type' => 'general_supply',
                'category' => 'Diagnostics',
                'unit_of_measure' => 'piece',
                'is_controlled' => false,
                'is_expirable' => false,
                'default_expiry_date' => null,
                'min_stock' => 10,
                'reorder_level' => 20,
                'cost_price' => 5000.00,
                'selling_price' => 0.00,
                'notes' => 'Reusable diagnostic equipment',
            ],
        ];

        foreach ($items as $item) {
            $categoryId = $categoryMap[$item['category']] ?? null;
            if (! $categoryId) {
                continue;
            }

            InventoryItem::updateOrCreate(
                ['code' => $item['code']],
                [
                    'name' => $item['name'],
                    'generic_name' => $item['generic_name'],
                    'item_type' => $item['item_type'],
                    'item_category_id' => $categoryId,
                    'unit_of_measure' => $item['unit_of_measure'],
                    'is_controlled' => $item['is_controlled'],
                    'is_expirable' => $item['is_expirable'],
                    'default_expiry_date' => $item['default_expiry_date'],
                    'min_stock' => $item['min_stock'],
                    'reorder_level' => $item['reorder_level'],
                    'cost_price' => $item['cost_price'],
                    'selling_price' => $item['selling_price'],
                    'notes' => $item['notes'],
                    'is_active' => true,
                    'created_by' => $userId,
                    'updated_by' => $userId,
                ]
            );
        }
    }
}
