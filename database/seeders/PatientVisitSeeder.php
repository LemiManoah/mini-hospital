<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PatientVisit;
use App\Models\Patient;
use App\Models\VisitType;
use App\Models\VisitStatus;
use App\Models\Clinic;
use App\Models\User;
use Carbon\Carbon;

class PatientVisitSeeder extends Seeder
{
    public function run(): void
    {
        // Get existing data or create sample data
        $patients = Patient::take(10)->get() ?: Patient::factory(10)->create();
        $visitTypes = VisitType::all();
        $visitStatuses = VisitStatus::all();
        $clinics = Clinic::take(5)->get() ?: Clinic::factory(5)->create();
        $staffUsers = User::take(5)->get() ?: User::factory(5)->create();

        // Create sample visits for different scenarios
        $sampleVisits = [];

        // Today's visits
        for ($i = 0; $i < 5; $i++) {
            $sampleVisits[] = [
                'visit_number' => PatientVisit::generateVisitNumber(),
                'patient_id' => $patients->random()->id,
                'visit_type_id' => $visitTypes->where('code', 'OPD')->first()->id ?? $visitTypes->random()->id,
                'status_id' => $visitStatuses->where('code', 'CHK')->first()->id ?? $visitStatuses->random()->id,
                'assigned_clinic_id' => $clinics->random()->id,
                'assigned_doctor_id' => $staffUsers->random()->id,
                'created_by_staff_id' => $staffUsers->random()->id,
                'visit_date' => Carbon::today(),
                'visit_time' => Carbon::createFromTime(9 + $i, 0, 0)->format('H:i:s'),
                'priority_flag' => $i < 2 ? 'urgent' : 'medium',
            ];
        }

        // Upcoming visits
        for ($i = 0; $i < 8; $i++) {
            $futureDate = Carbon::today()->addDays(rand(1, 30));
            $sampleVisits[] = [
                'visit_number' => PatientVisit::generateVisitNumber(),
                'patient_id' => $patients->random()->id,
                'visit_type_id' => $visitTypes->random()->id,
                'status_id' => $visitStatuses->where('code', 'SCH')->first()->id ?? $visitStatuses->random()->id,
                'assigned_clinic_id' => $clinics->random()->id,
                'assigned_doctor_id' => $staffUsers->random()->id,
                'created_by_staff_id' => $staffUsers->random()->id,
                'visit_date' => $futureDate,
                'visit_time' => Carbon::createFromTime(rand(8, 17), rand(0, 59), 0)->format('H:i:s'),
                'priority_flag' => ['low', 'medium', 'high'][array_rand(['low', 'medium', 'high'])],
            ];
        }

        // Past visits
        for ($i = 0; $i < 12; $i++) {
            $pastDate = Carbon::today()->subDays(rand(1, 60));
            $sampleVisits[] = [
                'visit_number' => PatientVisit::generateVisitNumber(),
                'patient_id' => $patients->random()->id,
                'visit_type_id' => $visitTypes->random()->id,
                'status_id' => $visitStatuses->where('code', 'CMP')->first()->id ?? $visitStatuses->random()->id,
                'assigned_clinic_id' => $clinics->random()->id,
                'assigned_doctor_id' => $staffUsers->random()->id,
                'created_by_staff_id' => $staffUsers->random()->id,
                'visit_date' => $pastDate,
                'visit_time' => Carbon::createFromTime(rand(8, 17), rand(0, 59), 0)->format('H:i:s'),
                'priority_flag' => ['low', 'medium', 'high'][array_rand(['low', 'medium', 'high'])],
            ];
        }

        // Emergency visits
        for ($i = 0; $i < 3; $i++) {
            $sampleVisits[] = [
                'visit_number' => PatientVisit::generateVisitNumber(),
                'patient_id' => $patients->random()->id,
                'visit_type_id' => $visitTypes->where('code', 'EMR')->first()->id ?? $visitTypes->random()->id,
                'status_id' => $visitStatuses->where('code', 'INP')->first()->id ?? $visitStatuses->random()->id,
                'assigned_clinic_id' => $clinics->random()->id,
                'assigned_doctor_id' => $staffUsers->random()->id,
                'created_by_staff_id' => $staffUsers->random()->id,
                'visit_date' => Carbon::today(),
                'visit_time' => Carbon::now()->subMinutes(rand(10, 120))->format('H:i:s'),
                'priority_flag' => 'urgent',
            ];
        }

        // Cancelled visits
        for ($i = 0; $i < 2; $i++) {
            $sampleVisits[] = [
                'visit_number' => PatientVisit::generateVisitNumber(),
                'patient_id' => $patients->random()->id,
                'visit_type_id' => $visitTypes->random()->id,
                'status_id' => $visitStatuses->where('code', 'CNL')->first()->id ?? $visitStatuses->random()->id,
                'assigned_clinic_id' => null,
                'assigned_doctor_id' => null,
                'created_by_staff_id' => $staffUsers->random()->id,
                'visit_date' => Carbon::today()->addDays(rand(1, 15)),
                'visit_time' => Carbon::createFromTime(rand(9, 16), rand(0, 59), 0)->format('H:i:s'),
                'priority_flag' => 'low',
            ];
        }

        foreach ($sampleVisits as $visit) {
            PatientVisit::firstOrCreate(['visit_number' => $visit['visit_number']], $visit);
        }
    }
}
