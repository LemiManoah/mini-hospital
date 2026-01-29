<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LabSampleType;

class LabSampleTypeSeeder extends Seeder
{
    public function run(): void
    {
        $sampleTypes = [
            ['code' => 'BLD', 'name' => 'Blood', 'default_container' => 'EDTA Tube', 'default_volume' => '5ml'],
            ['code' => 'SER', 'name' => 'Serum', 'default_container' => 'Plain Tube', 'default_volume' => '5ml'],
            ['code' => 'PLS', 'name' => 'Plasma', 'default_container' => 'Heparin Tube', 'default_volume' => '5ml'],
            ['code' => 'URN', 'name' => 'Urine', 'default_container' => 'Urine Container', 'default_volume' => '30ml'],
            ['code' => 'CSF', 'name' => 'Cerebrospinal Fluid', 'default_container' => 'Sterile Tube', 'default_volume' => '2ml'],
            ['code' => 'SPT', 'name' => 'Sputum', 'default_container' => 'Sterile Container', 'default_volume' => '5ml'],
            ['code' => 'SWB', 'name' => 'Swab', 'default_container' => 'Swab Tube', 'default_volume' => 'N/A'],
            ['code' => 'STL', 'name' => 'Stool', 'default_container' => 'Stool Container', 'default_volume' => '5g'],
            ['code' => 'TIS', 'name' => 'Tissue', 'default_container' => 'Formalin Container', 'default_volume' => 'Variable'],
            ['code' => 'AFD', 'name' => 'Ascitic Fluid', 'default_container' => 'Sterile Tube', 'default_volume' => '10ml'],
        ];

        foreach ($sampleTypes as $type) {
            LabSampleType::create([
                'code' => $type['code'],
                'name' => $type['name'],
                'description' => "Sample type for {$type['name']} testing",
                'default_container' => $type['default_container'],
                'default_volume' => $type['default_volume'],
                'is_active' => true,
            ]);
        }
    }
}
