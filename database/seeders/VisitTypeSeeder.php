<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\VisitType;

class VisitTypeSeeder extends Seeder
{
    public function run(): void
    {
        $visitTypes = [
            [
                'code' => 'OPD',
                'name' => 'Outpatient Department',
                'description' => 'Regular outpatient consultation and treatment services',
                'is_active' => true,
            ],
            [
                'code' => 'IPD',
                'name' => 'Inpatient Department',
                'description' => 'Admission and hospitalization services for patients requiring overnight stay',
                'is_active' => true,
            ],
            [
                'code' => 'EMR',
                'name' => 'Emergency',
                'description' => 'Emergency medical services and urgent care',
                'is_active' => true,
            ],
            [
                'code' => 'REV',
                'name' => 'Review',
                'description' => 'Follow-up review appointments for ongoing treatment',
                'is_active' => true,
            ],
            [
                'code' => 'FUP',
                'name' => 'Follow-up',
                'description' => 'Scheduled follow-up visits after initial treatment',
                'is_active' => true,
            ],
            [
                'code' => 'REF',
                'name' => 'Referral',
                'description' => 'Patient referral visits from other healthcare providers',
                'is_active' => true,
            ],
            [
                'code' => 'SPE',
                'name' => 'Specialist',
                'description' => 'Specialist consultation services',
                'is_active' => true,
            ],
            [
                'code' => 'VAC',
                'name' => 'Vaccination',
                'description' => 'Immunization and vaccination services',
                'is_active' => true,
            ],
            [
                'code' => 'CHK',
                'name' => 'Check-up',
                'description' => 'Routine health check-up and screening services',
                'is_active' => true,
            ],
            [
                'code' => 'TEL',
                'name' => 'Telemedicine',
                'description' => 'Remote consultation via telemedicine platforms',
                'is_active' => false,
            ],
        ];

        foreach ($visitTypes as $visitType) {
            VisitType::firstOrCreate(['code' => $visitType['code']], $visitType);
        }
    }
}
