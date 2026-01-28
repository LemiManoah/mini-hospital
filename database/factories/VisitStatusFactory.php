<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VisitStatus>
 */
class VisitStatusFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $visitStatuses = [
            ['code' => 'SCH', 'name' => 'Scheduled', 'sequence' => 1, 'is_terminal' => false],
            ['code' => 'CHK', 'name' => 'Checked In', 'sequence' => 2, 'is_terminal' => false],
            ['code' => 'WTR', 'name' => 'Waiting', 'sequence' => 3, 'is_terminal' => false],
            ['code' => 'INP', 'name' => 'In Progress', 'sequence' => 4, 'is_terminal' => false],
            ['code' => 'CMP', 'name' => 'Completed', 'sequence' => 5, 'is_terminal' => true],
            ['code' => 'CNL', 'name' => 'Cancelled', 'sequence' => 6, 'is_terminal' => true],
            ['code' => 'NSH', 'name' => 'No Show', 'sequence' => 7, 'is_terminal' => true],
        ];

        $status = $this->faker->unique()->randomElement($visitStatuses);

        return [
            'code' => $status['code'],
            'name' => $status['name'],
            'sequence' => $status['sequence'],
            'is_terminal' => $status['is_terminal'],
        ];
    }
}
