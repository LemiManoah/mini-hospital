<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AppointmentCategory;

class AppointmentCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'code' => 'CONSULT',
                'name' => 'Consultation',
                'description' => 'General consultation',
                'is_active' => true,
            ],
            [
                'code' => 'FOLLOW_UP',
                'name' => 'Follow-up',
                'description' => 'Follow-up after initial visit',
                'is_active' => true,
            ],
            [
                'code' => 'LAB',
                'name' => 'Lab',
                'description' => 'Laboratory appointment',
                'is_active' => true,
            ],
            [
                'code' => 'PROCEDURE',
                'name' => 'Procedure',
                'description' => 'Minor procedure or intervention',
                'is_active' => true,
            ],
            [
                'code' => 'VACCINATION',
                'name' => 'Vaccination',
                'description' => 'Vaccination appointment',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            AppointmentCategory::firstOrCreate(['code' => $category['code']], $category);
        }
    }
}
