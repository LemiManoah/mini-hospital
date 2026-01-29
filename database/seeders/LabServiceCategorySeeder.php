<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LabServiceCategory;

class LabServiceCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Hematology', 'description' => 'Blood tests and blood-related studies'],
            ['name' => 'Biochemistry', 'description' => 'Chemical analysis of blood and body fluids'],
            ['name' => 'Microbiology', 'description' => 'Bacterial, viral, and fungal cultures and sensitivity'],
            ['name' => 'Immunology', 'description' => 'Immune system tests and antibody studies'],
            ['name' => 'Histopathology', 'description' => 'Tissue examination and microscopic analysis'],
            ['name' => 'Molecular Biology', 'description' => 'DNA, RNA, and genetic testing'],
            ['name' => 'Endocrinology', 'description' => 'Hormone level testing'],
            ['name' => 'Toxicology', 'description' => 'Drug and toxic substance testing'],
        ];

        foreach ($categories as $category) {
            LabServiceCategory::create([
                'name' => $category['name'],
                'description' => $category['description'],
                'is_active' => true,
            ]);
        }
    }
}
