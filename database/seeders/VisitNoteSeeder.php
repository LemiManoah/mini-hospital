<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PatientVisit;
use App\Models\VisitNote;
use App\Models\User;
use Carbon\Carbon;

class VisitNoteSeeder extends Seeder
{
    public function run(): void
    {
        if (VisitNote::query()->exists()) {
            return;
        }

        $visits = PatientVisit::query()->limit(15)->get();
        $doctors = User::query()->limit(5)->get();

        if ($visits->isEmpty()) {
            return;
        }

        foreach ($visits as $visit) {
            VisitNote::create([
                'visit_id' => $visit->id,
                'doctor_id' => $doctors->random()->id ?? null,
                'complaint' => 'Patient reports intermittent headache and fatigue.',
                'examination' => 'Vitals stable. Mild tenderness on palpation. No acute distress.',
                'provisional_diagnosis' => 'Tension headache',
                'final_diagnosis' => 'Tension headache',
                'plan' => 'Hydration, rest, and analgesics as needed. Review in 1 week.',
                'created_at' => Carbon::now()->subMinutes(rand(10, 240)),
                'updated_at' => Carbon::now()->subMinutes(rand(5, 120)),
            ]);
        }
    }
}
