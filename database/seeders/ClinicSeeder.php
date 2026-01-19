<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Clinic;

class ClinicSeeder extends Seeder
{
    public function run(): void
    {
        $clinics = [
            [
                'name' => 'Main OPD Clinic',
                'status' => 'active',
            ],
            [
                'name' => 'IPD Ward A',
                'status' => 'active',
            ],
            [
                'name' => 'Maternity Wing',
                'status' => 'active',
            ],
            [
                'name' => 'Emergency Department',
                'status' => 'active',
            ],
            [
                'name' => 'Surgical Theater',
                'status' => 'active',
            ],
            [
                'name' => 'Pediatric Clinic',
                'status' => 'active',
            ],
            [
                'name' => 'Dental Clinic',
                'status' => 'active',
            ],
            [
                'name' => 'Mental Health Unit',
                'status' => 'active',
            ],
            [
                'name' => 'Laboratory Services',
                'status' => 'active',
            ],
            [
                'name' => 'Radiology Department',
                'status' => 'active',
            ],
        ];

        foreach ($clinics as $clinic) {
            Clinic::firstOrCreate($clinic);
        }
    }
}