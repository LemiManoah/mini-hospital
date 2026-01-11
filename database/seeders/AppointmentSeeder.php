<?php

namespace Database\Seeders;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class AppointmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Find doctors and patients
        $doctorIds = User::role('doctor')->pluck('id')->toArray();
        $patientIds = Patient::pluck('id')->toArray();

        if (empty($doctorIds) || empty($patientIds)) {
            $this->command->info('No doctors or patients found - skipping Appointment seeding.');
            return;
        }

        $timeSlots = [
            '09:00:00', '09:30:00', '10:00:00', '10:30:00', '11:00:00', '11:30:00',
            '14:00:00', '14:30:00', '15:00:00', '15:30:00', '16:00:00'
        ];

        $created = 0;

        foreach ($patientIds as $patientId) {
            $appointmentsToCreate = rand(1, 3);

            $attempts = 0;

            while ($appointmentsToCreate > 0 && $attempts < 10) {
                $attempts++;

                $doctorId = $doctorIds[array_rand($doctorIds)];
                $date = Carbon::now()->addDays(rand(1, 60))->toDateString();
                $time = $timeSlots[array_rand($timeSlots)];

                // ensure unique slot per doctor
                $exists = Appointment::where('doctor_id', $doctorId)
                    ->where('appointment_date', $date)
                    ->where('appointment_time', $time)
                    ->exists();

                if ($exists) {
                    continue;
                }

                $statusOptions = array_map(fn($c) => $c->value, AppointmentStatus::cases());
                // make most of them scheduled
                $status = rand(1, 10) > 8 ? $statusOptions[array_rand($statusOptions)] : AppointmentStatus::SCHEDULED->value;

                Appointment::create([
                    'patient_id' => $patientId,
                    'doctor_id' => $doctorId,
                    'appointment_date' => $date,
                    'appointment_time' => $time,
                    'status' => $status,
                    'notes' => fake()->sentence(10),
                ]);

                $created++;
                $appointmentsToCreate--;
            }
        }

        $this->command->info("Created {$created} appointments.");
    }
}
