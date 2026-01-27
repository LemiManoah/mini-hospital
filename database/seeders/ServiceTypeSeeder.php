<?php

namespace Database\Seeders;

use App\Models\ServiceType;
use Illuminate\Database\Seeder;

class ServiceTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ServiceType::factory()->create([
            'name' => 'Consultation',
            'description' => 'Consultation services',
        ]);
        ServiceType::factory()->create([
            'name' => 'Dental',
            'description' => 'Dental services',
        ]);

        ServiceType::factory()->create([
            'name' => 'Laboratory',
            'description' => 'Laboratory testing services',
        ]);

        ServiceType::factory()->create([
            'name' => 'Medicine',
            'description' => 'Medicine services',
        ]);

        ServiceType::factory()->create([
            'name' => 'Radiology',
            'description' => 'Radiology services',
        ]);
    }
}
