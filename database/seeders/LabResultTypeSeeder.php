<?php

namespace Database\Seeders;

use App\Models\LabResultType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LabResultTypeSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('lab_result_types')->delete();

        $resultTypes = [
            [
                'name' => 'Machine Based Test',
                'code' => 'MACHINE_BASED',
                'result_format' => 'machine_based',
                'description' => 'Automated tests with machine-generated results',
                'is_active' => true,
            ],
            [
                'name' => 'Simple Result Options',
                'code' => 'SIMPLE_OPTIONS',
                'result_format' => 'simple_options',
                'description' => 'Tests with predefined result options (positive/negative, etc.)',
                'is_active' => true,
            ],
            [
                'name' => 'Parameter Based Test',
                'code' => 'PARAMETER_BASED',
                'result_format' => 'parameter_based',
                'description' => 'Tests with multiple parameters and reference ranges',
                'is_active' => true,
            ],
            [
                'name' => 'Complex Hormone Test',
                'code' => 'COMPLEX_HORMONE',
                'result_format' => 'complex_hormone',
                'description' => 'Hormone tests with phase/week-specific reference ranges',
                'is_active' => true,
            ],
        ];

        foreach ($resultTypes as $type) {
            LabResultType::create($type);
        }

        $this->command->info('Lab result types seeded successfully!');
    }
}
