<?php

namespace Database\Seeders;

use App\Models\LabService;
use App\Models\LabServiceCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class LabServiceSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@example.com')->first();

        $hematology = LabServiceCategory::where('name', 'Hematology')->first();
        $biochemistry = LabServiceCategory::where('name', 'Biochemistry')->first();
        $microbiology = LabServiceCategory::where('name', 'Microbiology')->first();
        $immunology = LabServiceCategory::where('name', 'Immunology')->first();
        $endocrinology = LabServiceCategory::where('name', 'Endocrinology')->first();

        $labServices = [
            // Hematology
            [
                'lab_service_category_id' => $hematology->id,
                'name' => 'Complete Blood Count (CBC)',
                'code' => 'CBC',
                'description' => 'Full blood count including hemoglobin, hematocrit, WBC, RBC, platelets',
                'price' => 25000,
                'sample_type_id' => 1, // Blood (BLD)
                'result_fields' => json_encode([
                    ['name' => 'hemoglobin', 'label' => 'Hemoglobin', 'unit' => 'g/dL', 'type' => 'numeric'],
                    ['name' => 'hematocrit', 'label' => 'Hematocrit', 'unit' => '%', 'type' => 'numeric'],
                    ['name' => 'wbc', 'label' => 'White Blood Cells', 'unit' => 'x10^9/L', 'type' => 'numeric'],
                    ['name' => 'rbc', 'label' => 'Red Blood Cells', 'unit' => 'x10^12/L', 'type' => 'numeric'],
                    ['name' => 'platelets', 'label' => 'Platelets', 'unit' => 'x10^9/L', 'type' => 'numeric'],
                ]),
                'reference_range' => 'Hb: 12-16 g/dL (F), 13.5-17.5 g/dL (M)',
                'clinical_notes' => 'Basic screening for anemia, infection, bleeding disorders',
            ],
            [
                'lab_service_category_id' => $hematology->id,
                'name' => 'ESR',
                'code' => 'ESR',
                'description' => 'Erythrocyte Sedimentation Rate',
                'price' => 15000,
                'sample_type_id' => 1, // Blood (BLD)
                'reference_range' => '< 20 mm/hr (F), < 15 mm/hr (M)',
                'clinical_notes' => 'Non-specific marker of inflammation',
            ],
            [
                'lab_service_category_id' => $hematology->id,
                'name' => 'Blood Group & RH',
                'code' => 'BG_RH',
                'description' => 'ABO blood group and Rh factor determination',
                'price' => 20000,
                'sample_type_id' => 1, // Blood (BLD)
                'reference_range' => 'A, B, AB, O; Rh + or -',
                'clinical_notes' => 'Essential for blood transfusion compatibility',
            ],

            // Biochemistry
            [
                'lab_service_category_id' => $biochemistry->id,
                'name' => 'Blood Glucose (Fasting)',
                'code' => 'GLU_F',
                'description' => 'Fasting blood glucose level',
                'price' => 10000,
                'sample_type_id' => 2, // Serum (SER)
                'reference_range' => '70-100 mg/dL',
                'clinical_notes' => 'Screening for diabetes mellitus',
            ],
            [
                'lab_service_category_id' => $biochemistry->id,
                'name' => 'Blood Glucose (Random)',
                'code' => 'GLU_R',
                'description' => 'Random blood glucose level',
                'price' => 10000,
                'sample_type_id' => 2, // Serum (SER)
                'reference_range' => '< 140 mg/dL (2hrs after meal)',
                'clinical_notes' => 'Monitoring diabetes control',
            ],
            [
                'lab_service_category_id' => $biochemistry->id,
                'name' => 'HbA1c',
                'code' => 'HBA1C',
                'description' => 'Glycated hemoglobin',
                'price' => 35000,
                'sample_type_id' => 1, // Blood (BLD)
                'reference_range' => '< 5.7%',
                'clinical_notes' => '3-month average blood glucose control',
            ],
            [
                'lab_service_category_id' => $biochemistry->id,
                'name' => 'Creatinine',
                'code' => 'CRE',
                'description' => 'Serum creatinine level',
                'price' => 15000,
                'sample_type_id' => 2, // Serum (SER)
                'reference_range' => '0.6-1.2 mg/dL',
                'clinical_notes' => 'Kidney function test',
            ],
            [
                'lab_service_category_id' => $biochemistry->id,
                'name' => 'Urea',
                'code' => 'UREA',
                'description' => 'Blood urea nitrogen',
                'price' => 12000,
                'sample_type_id' => 2, // Serum (SER)
                'reference_range' => '7-20 mg/dL',
                'clinical_notes' => 'Kidney function test',
            ],
            [
                'lab_service_category_id' => $biochemistry->id,
                'name' => 'Total Cholesterol',
                'code' => 'CHOL',
                'description' => 'Total serum cholesterol',
                'price' => 18000,
                'sample_type_id' => 2, // Serum (SER)
                'reference_range' => '< 200 mg/dL',
                'clinical_notes' => 'Cardiovascular risk assessment',
            ],
            [
                'lab_service_category_id' => $biochemistry->id,
                'name' => 'HDL Cholesterol',
                'code' => 'HDL',
                'description' => 'High density lipoprotein cholesterol',
                'price' => 20000,
                'sample_type_id' => 2, // Serum (SER)
                'reference_range' => '> 40 mg/dL (M), > 50 mg/dL (F)',
                'clinical_notes' => 'Good cholesterol - protective factor',
            ],
            [
                'lab_service_category_id' => $biochemistry->id,
                'name' => 'LDL Cholesterol',
                'code' => 'LDL',
                'description' => 'Low density lipoprotein cholesterol',
                'price' => 2200,
                'sample_type_id' => 2, // Serum (SER)
                'reference_range' => '< 100 mg/dL',
                'clinical_notes' => 'Bad cholesterol - risk factor',
            ],
            [
                'lab_service_category_id' => $biochemistry->id,
                'name' => 'Triglycerides',
                'code' => 'TG',
                'description' => 'Serum triglycerides',
                'price' => 18000,
                'sample_type_id' => 2, // Serum (SER)
                'reference_range' => '< 150 mg/dL',
                'clinical_notes' => 'Cardiovascular risk factor',
            ],

            // Microbiology
            [
                'lab_service_category_id' => $microbiology->id,
                'name' => 'Urine Culture & Sensitivity',
                'code' => 'URINE_CS',
                'description' => 'Urine culture with antibiotic sensitivity testing',
                'price' => 45000,
                'sample_type_id' => 4, // Urine (URN)
                'reference_range' => 'No growth or < 1000 CFU/mL',
                'clinical_notes' => 'Diagnosis of urinary tract infections',
            ],
            [
                'lab_service_category_id' => $microbiology->id,
                'name' => 'Blood Culture',
                'code' => 'BLOOD_CS',
                'description' => 'Blood culture for bacterial identification',
                'price' => 80000,
                'sample_type_id' => 1, // Blood (BLD)
                'reference_range' => 'No growth',
                'clinical_notes' => 'Diagnosis of septicemia/bacteremia',
            ],
            [
                'lab_service_category_id' => $microbiology->id,
                'name' => 'Throat Swab Culture',
                'code' => 'THROAT_CS',
                'description' => 'Throat swab culture and sensitivity',
                'price' => 35000,
                'sample_type_id' => 7, // Swab (SWB)
                'reference_range' => 'Normal flora or no pathogens',
                'clinical_notes' => 'Diagnosis of streptococcal pharyngitis',
            ],

            // Immunology
            [
                'lab_service_category_id' => $immunology->id,
                'name' => 'HIV Test',
                'code' => 'HIV',
                'description' => 'HIV 1&2 antibodies screening',
                'price' => 25000,
                'sample_type_id' => 2, // Serum (SER)
                'reference_range' => 'Non-reactive',
                'clinical_notes' => 'Screening for HIV infection',
            ],
            [
                'lab_service_category_id' => $immunology->id,
                'name' => 'Hepatitis B Surface Antigen',
                'code' => 'HBsAg',
                'description' => 'Hepatitis B surface antigen',
                'price' => 30000,
                'sample_type_id' => 2, // Serum (SER)
                'reference_range' => 'Negative',
                'clinical_notes' => 'Screening for Hepatitis B infection',
            ],
            [
                'lab_service_category_id' => $immunology->id,
                'name' => 'Hepatitis C Antibody',
                'code' => 'HCV',
                'description' => 'Hepatitis C antibodies',
                'price' => 35000,
                'sample_type_id' => 2, // Serum (SER)
                'reference_range' => 'Non-reactive',
                'clinical_notes' => 'Screening for Hepatitis C infection',
            ],

            // Endocrinology
            [
                'lab_service_category_id' => $endocrinology->id,
                'name' => 'TSH',
                'code' => 'TSH',
                'description' => 'Thyroid Stimulating Hormone',
                'price' => 40000,
                'sample_type_id' => 2, // Serum (SER)
                'reference_range' => '0.4-4.0 mIU/L',
                'clinical_notes' => 'Thyroid function screening',
            ],
            [
                'lab_service_category_id' => $endocrinology->id,
                'name' => 'Free T4',
                'code' => 'FT4',
                'description' => 'Free thyroxine',
                'price' => 45000,
                'sample_type_id' => 2, // Serum (SER)
                'reference_range' => '0.8-1.8 ng/dL',
                'clinical_notes' => 'Thyroid function assessment',
            ],
        ];

        foreach ($labServices as $service) {
            LabService::create([
                ...$service,
                'created_by' => $admin?->id,
                'updated_by' => $admin?->id,
            ]);
        }
    }
}
