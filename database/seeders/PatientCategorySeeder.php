<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PatientCategory;

class PatientCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $patientCategories = [
            [
                'name' => 'cash',
                'is_insurance' => false,
                'is_active' => true,
            ],
            [
                'name' => 'AAA',
                'is_insurance' => true,
                'is_active' => true,
            ],
            [
                'name' => 'AIA',
                'is_insurance' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Jubilee Insurance',
                'is_insurance' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Employee',
                'is_insurance' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Other',
                'is_insurance' => false,
                'is_active' => true,
            ],
        ];

        foreach ($patientCategories as $patientCategory) {
            PatientCategory::firstOrCreate(['name' => $patientCategory['name']], $patientCategory);
        }
    }
}
