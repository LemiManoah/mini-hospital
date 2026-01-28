<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AppointmentMethod;

class AppointmentMethodSeeder extends Seeder
{
    public function run(): void
    {
        $methods = [
            [
                'code' => 'IN_PERSON',
                'name' => 'In Person',
                'description' => 'Patient attends the clinic in person',
                'is_active' => true,
            ],
            [
                'code' => 'PHONE',
                'name' => 'Phone',
                'description' => 'Consultation via phone call',
                'is_active' => true,
            ],
            [
                'code' => 'VIDEO',
                'name' => 'Video',
                'description' => 'Video consultation',
                'is_active' => true,
            ],
            [
                'code' => 'HOME',
                'name' => 'Home Visit',
                'description' => 'Doctor visits patient at home',
                'is_active' => true,
            ],
        ];

        foreach ($methods as $method) {
            AppointmentMethod::firstOrCreate(['code' => $method['code']], $method);
        }
    }
}
