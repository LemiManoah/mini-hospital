<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PatientVisit;
use App\Models\VisitTriage;
use App\Models\User;
use Carbon\Carbon;

class VisitTriageSeeder extends Seeder
{
    public function run(): void
    {
        if (VisitTriage::query()->exists()) {
            return;
        }

        $visits = PatientVisit::query()->limit(15)->get();
        $triageUsers = User::query()->limit(5)->get();

        if ($visits->isEmpty()) {
            return;
        }

        foreach ($visits as $visit) {
            VisitTriage::create([
                'visit_id' => $visit->id,
                'vitals_json' => [
                    'temperature' => rand(360, 385) / 10,
                    'pulse_rate' => rand(70, 110),
                    'respiratory_rate' => rand(12, 22),
                    'blood_pressure' => rand(100, 140) . '/' . rand(60, 90),
                    'oxygen_saturation' => rand(93, 100),
                    'weight' => rand(45, 95),
                ],
                'triage_notes' => 'Initial assessment completed.',
                'triage_by' => $triageUsers->random()->id ?? null,
                'triage_at' => Carbon::now()->subMinutes(rand(5, 120)),
            ]);
        }
    }
}
