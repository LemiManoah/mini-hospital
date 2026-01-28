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
                'code' => 'REG',
                'name' => 'REGISTERED',
                'sequence' => 1,
                'is_terminal' => false,
            ],
            [
                'code' => 'TRI',
                'name' => 'TRIAGED',
                'sequence' => 2,
                'is_terminal' => false,
            ],
            [
                'code' => 'CON',
                'name' => 'IN_CONSULTATION',
                'sequence' => 3,
                'is_terminal' => false,
            ],
            [
                'code' => 'RES',
                'name' => 'AWAITING_RESULTS',
                'sequence' => 4,
                'is_terminal' => false,
            ],
            [
                'code' => 'ADM',
                'name' => 'ADMITTED',
                'sequence' => 5,
                'is_terminal' => true,
            ],
            [
                'code' => 'DIS',
                'name' => 'DISCHARGED',
                'sequence' => 6,
                'is_terminal' => true,
            ],
            [
                'code' => 'CLO',
                'name' => 'CLOSED',
                'sequence' => 7,
                'is_terminal' => true,
            ],
        ];

        foreach ($visitStatuses as $visitStatus) {
            VisitStatus::firstOrCreate(['code' => $visitStatus['code']], $visitStatus);
        }
    }
}
