<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure roles exist
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $doctorRole = Role::firstOrCreate(['name' => 'doctor']);
        $receptionistRole = Role::firstOrCreate(['name' => 'receptionist']);

        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@gmail.com',
                'role' => 'admin',
            ],
            [
                'name' => 'Dr. John Doe',
                'email' => 'doctor@gmail.com',
                'role' => 'doctor',
            ],
            [
                'name' => 'Receptionist',
                'email' => 'receptionist@gmail.com',
                'role' => 'receptionist',
            ],
        ];

        foreach ($users as $u) {
            $user = User::updateOrCreate(
                ['email' => $u['email']],
                [
                    'name' => $u['name'],
                    // `password` cast in User model will hash this
                    'password' => 'password',
                    'email_verified_at' => now(),
                ]
            );

            $role = $u['role'];
            if (!$user->hasRole($role)) {
                $user->assignRole($role);
            }
        }
    }
}
