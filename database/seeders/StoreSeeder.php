<?php

namespace Database\Seeders;

use App\Models\Store;
use Illuminate\Database\Seeder;

class StoreSeeder extends Seeder
{
    public function run(): void
    {
        $stores = [
            ['name' => 'Main Store', 'code' => 'MAIN', 'is_main' => true, 'allow_direct_receipt' => true],
            ['name' => 'Pharmacy Store', 'code' => 'PHARM', 'is_main' => false, 'allow_direct_receipt' => true],
            ['name' => 'Lab Store', 'code' => 'LAB', 'is_main' => false, 'allow_direct_receipt' => true],
            ['name' => 'Ward Store', 'code' => 'WARD', 'is_main' => false, 'allow_direct_receipt' => true],
        ];

        foreach ($stores as $store) {
            Store::firstOrCreate(
                ['code' => $store['code']],
                [
                    'name' => $store['name'],
                    'is_main' => $store['is_main'],
                    'allow_direct_receipt' => $store['allow_direct_receipt'],
                    'is_active' => true,
                ]
            );
        }
    }
}
