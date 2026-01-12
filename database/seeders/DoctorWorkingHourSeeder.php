<?php

namespace Database\Seeders;

use App\Models\DoctorWorkingHour;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DoctorWorkingHourSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default working hours (Monday–Friday 09:00 - 17:00) for every doctor user
        $doctors = User::role('doctor')->get();

        $weekdays = [1, 2, 3, 4, 5]; // Mon=1 .. Fri=5

        foreach ($doctors as $doctor) {
            foreach ($weekdays as $dayOfWeek) {
                DoctorWorkingHour::updateOrCreate(
                    ['doctor_id' => $doctor->id, 'day_of_week' => $dayOfWeek],
                    ['start_time' => '09:00:00', 'end_time' => '17:00:00']
                );
            }
        }
    }
}
