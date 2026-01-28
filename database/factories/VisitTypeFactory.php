<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VisitType>
 */
class VisitTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $visitTypes = [
            ['code' => 'OPD', 'name' => 'Outpatient Department'],
            ['code' => 'IPD', 'name' => 'Inpatient Department'],
            ['code' => 'EMR', 'name' => 'Emergency'],
            ['code' => 'REV', 'name' => 'Review'],
            ['code' => 'FUP', 'name' => 'Follow-up'],
        ];

        $type = $this->faker->unique()->randomElement($visitTypes);

        return [
            'code' => $type['code'],
            'name' => $type['name'],
            'description' => $this->faker->sentence(),
            'is_active' => $this->faker->boolean(80), // 80% chance of being active
        ];
    }
}
