<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\PatientVisit;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PatientVisit>
 */
class PatientVisitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'visit_number' => PatientVisit::generateVisitNumber(),
            'patient_id' => \App\Models\Patient::factory(),
            'visit_type_id' => \App\Models\VisitType::factory(),
            'status_id' => \App\Models\VisitStatus::inRandomOrder()->first()->id ?? 1,
            'assigned_clinic_id' => \App\Models\Clinic::inRandomOrder()->first()->id ?? null,
            'assigned_doctor_id' => \App\Models\User::inRandomOrder()->first()->id ?? null,
            'created_by_staff_id' => \App\Models\User::inRandomOrder()->first()->id ?? 1,
            'visit_date' => $this->faker->dateTimeBetween('-1 month', '+1 month'),
            'visit_time' => $this->faker->time('H:i:s'),
            'priority_flag' => $this->faker->randomElement(['low', 'medium', 'high', 'urgent']),
        ];
    }

    /**
     * Create a visit for today
     */
    public function today(): static
    {
        return $this->state(fn (array $attributes) => [
            'visit_date' => now(),
        ]);
    }

    /**
     * Create an urgent visit
     */
    public function urgent(): static
    {
        return $this->state(fn (array $attributes) => [
            'priority_flag' => 'urgent',
            'visit_date' => now(),
            'visit_time' => now()->format('H:i:s'),
        ]);
    }

    /**
     * Create a scheduled visit
     */
    public function scheduled(): static
    {
        return $this->state(fn (array $attributes) => [
            'visit_date' => $this->faker->dateTimeBetween('tomorrow', '+2 weeks'),
        ]);
    }

    /**
     * Create a past visit
     */
    public function past(): static
    {
        return $this->state(fn (array $attributes) => [
            'visit_date' => $this->faker->dateTimeBetween('-2 months', '-1 day'),
        ]);
    }
}
