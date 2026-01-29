<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LabResultOption;
use App\Models\LabService;
use App\Models\User;

class LabResultOptionSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@example.com')->first();
        
        // Get lab services that need result options
        $hivTest = LabService::where('code', 'HIV')->first();
        $hbsag = LabService::where('code', 'HBsAg')->first();
        $hcv = LabService::where('code', 'HCV')->first();
        $bloodGroup = LabService::where('code', 'BG_RH')->first();
        $urineCulture = LabService::where('code', 'URINE_CS')->first();
        $throatSwab = LabService::where('code', 'THROAT_CS')->first();
        $bloodCulture = LabService::where('code', 'BLOOD_CS')->first();

        $resultOptions = [
            // HIV Test Results
            [
                'lab_test_id' => $hivTest->id,
                'option_value' => 'non-reactive',
                'label' => 'Non-Reactive',
                'is_abnormal' => false,
                'sort_order' => 1,
            ],
            [
                'lab_test_id' => $hivTest->id,
                'option_value' => 'reactive',
                'label' => 'Reactive',
                'is_abnormal' => true,
                'sort_order' => 2,
            ],
            [
                'lab_test_id' => $hivTest->id,
                'option_value' => 'indeterminate',
                'label' => 'Indeterminate',
                'is_abnormal' => true,
                'sort_order' => 3,
            ],

            // Hepatitis B Surface Antigen Results
            [
                'lab_test_id' => $hbsag->id,
                'option_value' => 'negative',
                'label' => 'Negative',
                'is_abnormal' => false,
                'sort_order' => 1,
            ],
            [
                'lab_test_id' => $hbsag->id,
                'option_value' => 'positive',
                'label' => 'Positive',
                'is_abnormal' => true,
                'sort_order' => 2,
            ],

            // Hepatitis C Antibody Results
            [
                'lab_test_id' => $hcv->id,
                'option_value' => 'non-reactive',
                'label' => 'Non-Reactive',
                'is_abnormal' => false,
                'sort_order' => 1,
            ],
            [
                'lab_test_id' => $hcv->id,
                'option_value' => 'reactive',
                'label' => 'Reactive',
                'is_abnormal' => true,
                'sort_order' => 2,
            ],

            // Blood Group Results
            [
                'lab_test_id' => $bloodGroup->id,
                'option_value' => 'A+',
                'label' => 'A Positive',
                'is_abnormal' => false,
                'sort_order' => 1,
            ],
            [
                'lab_test_id' => $bloodGroup->id,
                'option_value' => 'A-',
                'label' => 'A Negative',
                'is_abnormal' => false,
                'sort_order' => 2,
            ],
            [
                'lab_test_id' => $bloodGroup->id,
                'option_value' => 'B+',
                'label' => 'B Positive',
                'is_abnormal' => false,
                'sort_order' => 3,
            ],
            [
                'lab_test_id' => $bloodGroup->id,
                'option_value' => 'B-',
                'label' => 'B Negative',
                'is_abnormal' => false,
                'sort_order' => 4,
            ],
            [
                'lab_test_id' => $bloodGroup->id,
                'option_value' => 'AB+',
                'label' => 'AB Positive',
                'is_abnormal' => false,
                'sort_order' => 5,
            ],
            [
                'lab_test_id' => $bloodGroup->id,
                'option_value' => 'AB-',
                'label' => 'AB Negative',
                'is_abnormal' => false,
                'sort_order' => 6,
            ],
            [
                'lab_test_id' => $bloodGroup->id,
                'option_value' => 'O+',
                'label' => 'O Positive',
                'is_abnormal' => false,
                'sort_order' => 7,
            ],
            [
                'lab_test_id' => $bloodGroup->id,
                'option_value' => 'O-',
                'label' => 'O Negative',
                'is_abnormal' => false,
                'sort_order' => 8,
            ],

            // Urine Culture Results
            [
                'lab_test_id' => $urineCulture->id,
                'option_value' => 'no_growth',
                'label' => 'No Growth',
                'is_abnormal' => false,
                'sort_order' => 1,
            ],
            [
                'lab_test_id' => $urineCulture->id,
                'option_value' => 'mixed_flora',
                'label' => 'Mixed Flora',
                'is_abnormal' => true,
                'sort_order' => 2,
            ],
            [
                'lab_test_id' => $urineCulture->id,
                'option_value' => 'e_coli',
                'label' => 'E. coli',
                'is_abnormal' => true,
                'sort_order' => 3,
            ],
            [
                'lab_test_id' => $urineCulture->id,
                'option_value' => 'staph_aureus',
                'label' => 'Staphylococcus aureus',
                'is_abnormal' => true,
                'sort_order' => 4,
            ],
            [
                'lab_test_id' => $urineCulture->id,
                'option_value' => 'klebsiella',
                'label' => 'Klebsiella spp.',
                'is_abnormal' => true,
                'sort_order' => 5,
            ],
            [
                'lab_test_id' => $urineCulture->id,
                'option_value' => 'proteus',
                'label' => 'Proteus spp.',
                'is_abnormal' => true,
                'sort_order' => 6,
            ],
            [
                'lab_test_id' => $urineCulture->id,
                'option_value' => 'enterococcus',
                'label' => 'Enterococcus spp.',
                'is_abnormal' => true,
                'sort_order' => 7,
            ],

            // Throat Swab Culture Results
            [
                'lab_test_id' => $throatSwab->id,
                'option_value' => 'normal_flora',
                'label' => 'Normal Flora',
                'is_abnormal' => false,
                'sort_order' => 1,
            ],
            [
                'lab_test_id' => $throatSwab->id,
                'option_value' => 'strep_pyogenes',
                'label' => 'Group A Streptococcus',
                'is_abnormal' => true,
                'sort_order' => 2,
            ],
            [
                'lab_test_id' => $throatSwab->id,
                'option_value' => 'strep_pneumoniae',
                'label' => 'Streptococcus pneumoniae',
                'is_abnormal' => true,
                'sort_order' => 3,
            ],
            [
                'lab_test_id' => $throatSwab->id,
                'option_value' => 'staph_aureus',
                'label' => 'Staphylococcus aureus',
                'is_abnormal' => true,
                'sort_order' => 4,
            ],
            [
                'lab_test_id' => $throatSwab->id,
                'option_value' => 'haemophilus',
                'label' => 'Haemophilus influenzae',
                'is_abnormal' => true,
                'sort_order' => 5,
            ],

            // Blood Culture Results
            [
                'lab_test_id' => $bloodCulture->id,
                'option_value' => 'no_growth',
                'label' => 'No Growth (7 days)',
                'is_abnormal' => false,
                'sort_order' => 1,
            ],
            [
                'lab_test_id' => $bloodCulture->id,
                'option_value' => 'contaminant',
                'label' => 'Contaminant',
                'is_abnormal' => false,
                'sort_order' => 2,
            ],
            [
                'lab_test_id' => $bloodCulture->id,
                'option_value' => 'staph_aureus',
                'label' => 'Staphylococcus aureus',
                'is_abnormal' => true,
                'sort_order' => 3,
            ],
            [
                'lab_test_id' => $bloodCulture->id,
                'option_value' => 'e_coli',
                'label' => 'E. coli',
                'is_abnormal' => true,
                'sort_order' => 4,
            ],
            [
                'lab_test_id' => $bloodCulture->id,
                'option_value' => 'klebsiella',
                'label' => 'Klebsiella spp.',
                'is_abnormal' => true,
                'sort_order' => 5,
            ],
            [
                'lab_test_id' => $bloodCulture->id,
                'option_value' => 'pseudomonas',
                'label' => 'Pseudomonas aeruginosa',
                'is_abnormal' => true,
                'sort_order' => 6,
            ],
            [
                'lab_test_id' => $bloodCulture->id,
                'option_value' => 'enterococcus',
                'label' => 'Enterococcus spp.',
                'is_abnormal' => true,
                'sort_order' => 7,
            ],
            [
                'lab_test_id' => $bloodCulture->id,
                'option_value' => 'candida',
                'label' => 'Candida spp.',
                'is_abnormal' => true,
                'sort_order' => 8,
            ],
        ];

        foreach ($resultOptions as $option) {
            LabResultOption::create([
                ...$option,
                'created_by' => $admin?->id,
                'updated_by' => $admin?->id,
            ]);
        }
    }
}
