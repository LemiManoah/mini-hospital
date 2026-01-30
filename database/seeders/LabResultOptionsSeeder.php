<?php

namespace Database\Seeders;

use App\Models\LabReferenceRange;
use App\Models\LabResultOption;
use App\Models\LabResultParameter;
use App\Models\LabResultType;
use App\Models\LabService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LabResultOptionsSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('lab_result_options')->delete();
        DB::table('lab_result_parameters')->delete();
        DB::table('lab_reference_ranges')->delete();

        // Get lab services
        $services = LabService::all()->keyBy('code');
        $resultTypes = LabResultType::all()->keyBy('code');

        // Machine-based tests (no options needed)
        $machineBasedServices = ['HIV', 'TSH', 'FT4'];
        foreach ($machineBasedServices as $serviceCode) {
            if (isset($services[$serviceCode])) {
                $services[$serviceCode]->update([
                    'lab_result_type_id' => $resultTypes['MACHINE_BASED']->id,
                ]);
            }
        }

        // Simple Options Tests
        $this->seedSimpleOptions($services, $resultTypes);

        // Parameter-based Tests
        $this->seedParameterTests($services, $resultTypes);

        // Complex Hormone Tests
        $this->seedComplexHormoneTests($services, $resultTypes);

        $this->command->info('Lab result options seeded successfully!');
    }

    private function seedSimpleOptions($services, $resultTypes): void
    {
        // HIV Test (as simple options for demonstration)
        if (isset($services['HIV'])) {
            $services['HIV']->update(['lab_result_type_id' => $resultTypes['SIMPLE_OPTIONS']->id]);

            $hivOptions = [
                ['option_name' => 'Non-reactive', 'option_code' => 'NEG', 'symbol' => '-', 'is_abnormal' => false, 'display_order' => 1],
                ['option_name' => 'Reactive', 'option_code' => 'POS', 'symbol' => '+', 'is_abnormal' => true, 'display_order' => 2],
            ];

            foreach ($hivOptions as $option) {
                LabResultOption::create([
                    'lab_service_id' => $services['HIV']->id,
                    'lab_result_type_id' => $resultTypes['SIMPLE_OPTIONS']->id,
                    ...$option,
                ]);
            }
        }

        // Blood Group Test
        if (isset($services['BG_RH'])) {
            $services['BG_RH']->update(['lab_result_type_id' => $resultTypes['SIMPLE_OPTIONS']->id]);

            $bloodGroups = [
                ['option_name' => 'Blood Group A RhD positive', 'option_code' => 'A+', 'symbol' => '+', 'is_abnormal' => false, 'display_order' => 1],
                ['option_name' => 'Blood Group A RhD negative', 'option_code' => 'A-', 'symbol' => '-', 'is_abnormal' => false, 'display_order' => 2],
                ['option_name' => 'Blood Group B RhD positive', 'option_code' => 'B+', 'symbol' => '+', 'is_abnormal' => false, 'display_order' => 3],
                ['option_name' => 'Blood Group B RhD negative', 'option_code' => 'B-', 'symbol' => '-', 'is_abnormal' => false, 'display_order' => 4],
                ['option_name' => 'Blood Group AB RhD positive', 'option_code' => 'AB+', 'symbol' => '+', 'is_abnormal' => false, 'display_order' => 5],
                ['option_name' => 'Blood Group AB RhD negative', 'option_code' => 'AB-', 'symbol' => '-', 'is_abnormal' => false, 'display_order' => 6],
                ['option_name' => 'Blood Group O RhD positive', 'option_code' => 'O+', 'symbol' => '+', 'is_abnormal' => false, 'display_order' => 7],
                ['option_name' => 'Blood Group O RhD negative', 'option_code' => 'O-', 'symbol' => '-', 'is_abnormal' => false, 'display_order' => 8],
            ];

            foreach ($bloodGroups as $option) {
                LabResultOption::create([
                    'lab_service_id' => $services['BG_RH']->id,
                    'lab_result_type_id' => $resultTypes['SIMPLE_OPTIONS']->id,
                    ...$option,
                ]);
            }
        }

        // Hepatitis B Surface Antigen
        if (isset($services['HBsAg'])) {
            $services['HBsAg']->update(['lab_result_type_id' => $resultTypes['SIMPLE_OPTIONS']->id]);

            $hbsagOptions = [
                ['option_name' => 'Negative', 'option_code' => 'NEG', 'symbol' => '-', 'is_abnormal' => false, 'display_order' => 1],
                ['option_name' => 'Positive', 'option_code' => 'POS', 'symbol' => '+', 'is_abnormal' => true, 'display_order' => 2],
            ];

            foreach ($hbsagOptions as $option) {
                LabResultOption::create([
                    'lab_service_id' => $services['HBsAg']->id,
                    'lab_result_type_id' => $resultTypes['SIMPLE_OPTIONS']->id,
                    ...$option,
                ]);
            }
        }

        // Hepatitis C Antibody
        if (isset($services['HCV'])) {
            $services['HCV']->update(['lab_result_type_id' => $resultTypes['SIMPLE_OPTIONS']->id]);

            $hcvOptions = [
                ['option_name' => 'Negative', 'option_code' => 'NEG', 'symbol' => '-', 'is_abnormal' => false, 'display_order' => 1],
                ['option_name' => 'Positive', 'option_code' => 'POS', 'symbol' => '+', 'is_abnormal' => true, 'display_order' => 2],
            ];

            foreach ($hcvOptions as $option) {
                LabResultOption::create([
                    'lab_service_id' => $services['HCV']->id,
                    'lab_result_type_id' => $resultTypes['SIMPLE_OPTIONS']->id,
                    ...$option,
                ]);
            }
        }
    }

    private function seedParameterTests($services, $resultTypes): void
    {
        // CBC Test
        if (isset($services['CBC'])) {
            $services['CBC']->update(['lab_result_type_id' => $resultTypes['PARAMETER_BASED']->id]);

            $cbcParameters = [
                ['parameter_name' => 'WBC', 'parameter_code' => 'WBC', 'unit' => 'fl', 'display_order' => 1],
                ['parameter_name' => 'RBC', 'parameter_code' => 'RBC', 'unit' => '%', 'display_order' => 2],
                ['parameter_name' => 'AST/sGOT', 'parameter_code' => 'AST', 'unit' => 'U/L', 'display_order' => 3],
                ['parameter_name' => 'lym%', 'parameter_code' => 'LYM_PCT', 'unit' => 'fl', 'display_order' => 4],
                ['parameter_name' => 'MID%', 'parameter_code' => 'MID_PCT', 'unit' => 'fl', 'display_order' => 5],
                ['parameter_name' => 'GRA%', 'parameter_code' => 'GRA_PCT', 'unit' => 'fl', 'display_order' => 6],
                ['parameter_name' => 'LYM', 'parameter_code' => 'LYM_ABS', 'unit' => 'fl', 'display_order' => 7],
                ['parameter_name' => 'MID', 'parameter_code' => 'MID_ABS', 'unit' => 'fl', 'display_order' => 8],
                ['parameter_name' => 'GRA', 'parameter_code' => 'GRA_ABS', 'unit' => 'fl', 'display_order' => 9],
                ['parameter_name' => 'HGB', 'parameter_code' => 'HGB', 'unit' => '%', 'display_order' => 10],
                ['parameter_name' => 'MCHC', 'parameter_code' => 'MCHC', 'unit' => '%', 'display_order' => 11],
                ['parameter_name' => 'MCV', 'parameter_code' => 'MCV', 'unit' => '%', 'display_order' => 12],
                ['parameter_name' => 'RDWc', 'parameter_code' => 'RDW_C', 'unit' => '%', 'display_order' => 13],
                ['parameter_name' => 'RDWs', 'parameter_code' => 'RDW_S', 'unit' => '%', 'display_order' => 14],
                ['parameter_name' => 'PCT', 'parameter_code' => 'PCT', 'unit' => 'x10^9/L', 'display_order' => 15],
                ['parameter_name' => 'MPV', 'parameter_code' => 'MPV', 'unit' => 'x10^9/L', 'display_order' => 16],
                ['parameter_name' => 'wbc', 'parameter_code' => 'WBC_ALT', 'unit' => 'Mc', 'display_order' => 17],
                ['parameter_name' => 'wbcs', 'parameter_code' => 'WBC_COUNT', 'unit' => '10^9l', 'display_order' => 18],
            ];

            foreach ($cbcParameters as $param) {
                $parameter = LabResultParameter::create([
                    'lab_service_id' => $services['CBC']->id,
                    ...$param,
                ]);

                // Add reference ranges for each parameter
                $this->addCbcReferenceRanges($parameter);
            }
        }

        // ESR Test
        if (isset($services['ESR'])) {
            $services['ESR']->update(['lab_result_type_id' => $resultTypes['PARAMETER_BASED']->id]);

            $esrParameter = LabResultParameter::create([
                'lab_service_id' => $services['ESR']->id,
                'parameter_name' => 'ESR',
                'parameter_code' => 'ESR',
                'unit' => 'mm/hr',
                'display_order' => 1,
            ]);

            // ESR reference ranges
            $esrRanges = [
                ['age_range_from' => '0', 'age_range_to' => '50', 'sex' => 'male', 'min_value' => 0, 'max_value' => 10],
                ['age_range_from' => '0', 'age_range_to' => '50', 'sex' => 'female', 'min_value' => 0, 'max_value' => 15],
                ['age_range_from' => '51', 'age_range_to' => '120', 'sex' => 'both', 'min_value' => 0, 'max_value' => 20],
            ];

            foreach ($esrRanges as $range) {
                LabReferenceRange::create([
                    'lab_result_parameter_id' => $esrParameter->id,
                    ...$range,
                ]);
            }
        }

        // Other single parameter tests
        $singleParamTests = [
            ['GLU_F', 'Fast Blood Sugar(FBS)', 'mmol/L', 3.00, 5.60],
            ['CRE', 'Creatinine', 'μmol/L', 60.00, 110.00],
            ['UREA', 'Urea', 'mmol/L', 2.50, 6.40],
            ['CHOL', 'Total Cholesterol', 'mmol/L', 0.00, 5.20],
            ['HDL', 'HDL Cholesterol', 'mmol/L', 1.00, 2.00],
            ['LDL', 'LDL Cholesterol', 'mmol/L', 0.00, 3.00],
            ['TG', 'Triglycerides', 'mmol/L', 0.00, 1.70],
            ['HBA1C', 'HbA1c', '%', 4.00, 6.00],
        ];

        foreach ($singleParamTests as [$code, $name, $unit, $min, $max]) {
            if (isset($services[$code])) {
                $services[$code]->update(['lab_result_type_id' => $resultTypes['PARAMETER_BASED']->id]);

                $parameter = LabResultParameter::create([
                    'lab_service_id' => $services[$code]->id,
                    'parameter_name' => $name,
                    'parameter_code' => $code,
                    'unit' => $unit,
                    'display_order' => 1,
                ]);

                LabReferenceRange::create([
                    'lab_result_parameter_id' => $parameter->id,
                    'age_range_from' => '0',
                    'age_range_to' => '120',
                    'sex' => 'both',
                    'min_value' => $min,
                    'max_value' => $max,
                ]);
            }
        }
    }

    private function addCbcReferenceRanges($parameter): void
    {
        $ranges = [
            'WBC' => [
                ['age_range_from' => '5', 'age_range_to' => '16', 'sex' => 'both', 'min_value' => 5.00, 'max_value' => 11.60],
            ],
            'RBC' => [
                ['age_range_from' => '2', 'age_range_to' => '5', 'sex' => 'both', 'min_value' => 3.79, 'max_value' => 5.79],
            ],
            'AST/sGOT' => [
                ['age_range_from' => '0', 'age_range_to' => '120', 'sex' => 'both', 'min_value' => 0.00, 'max_value' => 37.00],
            ],
            'lym%' => [
                ['age_range_from' => '5', 'age_range_to' => '16', 'sex' => 'both', 'min_value' => 19.10, 'max_value' => 48.50],
            ],
            // Add more CBC ranges as needed...
        ];

        if (isset($ranges[$parameter->parameter_name])) {
            foreach ($ranges[$parameter->parameter_name] as $range) {
                LabReferenceRange::create([
                    'lab_result_parameter_id' => $parameter->id,
                    ...$range,
                ]);
            }
        }
    }

    private function seedComplexHormoneTests($services, $resultTypes): void
    {
        // Culture tests as complex hormone type for demonstration
        $cultureTests = ['URINE_CS', 'BLOOD_CS', 'THROAT_CS'];

        foreach ($cultureTests as $serviceCode) {
            if (isset($services[$serviceCode])) {
                $services[$serviceCode]->update(['lab_result_type_id' => $resultTypes['COMPLEX_HORMONE']->id]);

                $parameter = LabResultParameter::create([
                    'lab_service_id' => $services[$serviceCode]->id,
                    'parameter_name' => 'Culture Result',
                    'parameter_code' => $serviceCode.'_RESULT',
                    'unit' => 'Result',
                    'display_order' => 1,
                ]);

                // Culture reference ranges (text-based)
                LabReferenceRange::create([
                    'lab_result_parameter_id' => $parameter->id,
                    'age_range_from' => '0',
                    'age_range_to' => '120',
                    'sex' => 'both',
                    'reference_text' => 'No growth',
                    'min_value' => null,
                    'max_value' => null,
                ]);
            }
        }
    }
}
