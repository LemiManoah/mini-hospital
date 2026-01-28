<?php

namespace Database\Seeders;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\AppointmentCategory;
use App\Models\AppointmentMethod;
use App\Models\Clinic;
use App\Models\Patient;
use App\Models\Service;
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
        $durations = [15, 20, 30, 45, 60];

        $created = 0;

        // Track used slots per doctor to avoid conflicts
        $usedSlots = [];
        
        foreach ($patientIds as $patientId) {
            $appointmentsToCreate = rand(1, 3);
            $attempts = 0;

            while ($appointmentsToCreate > 0 && $attempts < 10) {
                $attempts++;

                $doctorId = $doctorIds[array_rand($doctorIds)];
                $date = Carbon::now()->addDays(rand(1, 60))->toDateString();
                $time = $timeSlots[array_rand($timeSlots)];
                $durationMinutes = $durations[array_rand($durations)];

                // Create unique key for this slot
                $slotKey = $doctorId . '_' . $date . '_' . $time;

                // ensure unique slot per doctor
                if (isset($usedSlots[$slotKey])) {
                    continue;
                }

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

                $methodId = AppointmentMethod::inRandomOrder()->value('id');
                $categoryId = AppointmentCategory::inRandomOrder()->value('id');
                $clinicId = Clinic::inRandomOrder()->value('id');
                $serviceId = Service::inRandomOrder()->value('id');

                Appointment::create([
                    'patient_id' => $patientId,
                    'doctor_id' => $doctorId,
                    'appointment_date' => $date,
                    'appointment_time' => $time,
                    'duration_minutes' => $durationMinutes,
                    'appointment_method_id' => $methodId,
                    'appointment_category_id' => $categoryId,
                    'clinic_id' => $clinicId,
                    'service_id' => $serviceId,
                    'priority_flag' => rand(1, 10) > 8 ? 'high' : 'medium',
                    'status' => $status,
                    'notes' => fake()->sentence(10),
                ]);

                // Mark this slot as used
                $usedSlots[$slotKey] = true;
                $created++;
                $appointmentsToCreate--;
            }
        }

        $this->command->info("Created {$created} appointments.");
    }
}
