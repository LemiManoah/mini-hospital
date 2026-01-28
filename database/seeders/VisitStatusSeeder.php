<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\VisitStatus;

class VisitStatusSeeder extends Seeder
{
    public function run(): void
    {
        $visitStatuses = [
            [
                'code' => 'SCH',
                'name' => 'Scheduled',
                'sequence' => 1,
                'is_terminal' => false,
            ],
            [
                'code' => 'CHK',
                'name' => 'Checked In',
                'sequence' => 2,
                'is_terminal' => false,
            ],
            [
                'code' => 'WTR',
                'name' => 'Waiting',
                'sequence' => 3,
                'is_terminal' => false,
            ],
            [
                'code' => 'INP',
                'name' => 'In Progress',
                'sequence' => 4,
                'is_terminal' => false,
            ],
            [
                'code' => 'CMP',
                'name' => 'Completed',
                'sequence' => 5,
                'is_terminal' => true,
            ],
            [
                'code' => 'CNL',
                'name' => 'Cancelled',
                'sequence' => 6,
                'is_terminal' => true,
            ],
            [
                'code' => 'NSH',
                'name' => 'No Show',
                'sequence' => 7,
                'is_terminal' => true,
            ],
            [
                'code' => 'RES',
                'name' => 'Rescheduled',
                'sequence' => 8,
                'is_terminal' => true,
            ],
            [
                'code' => 'REF',
                'name' => 'Referred',
                'sequence' => 9,
                'is_terminal' => true,
            ],
            [
                'code' => 'FOL',
                'name' => 'Follow-up Required',
                'sequence' => 10,
                'is_terminal' => true,
            ],
        ];

        foreach ($visitStatuses as $visitStatus) {
            VisitStatus::firstOrCreate(['code' => $visitStatus['code']], $visitStatus);
        }
    }
}
