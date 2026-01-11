<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Permissions
        $permissions = [
            'manage patients',
            'view patients',
            'schedule appointments',
            'view appointments',
            'manage appointments',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Roles
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $doctor = Role::firstOrCreate(['name' => 'doctor']);
        $receptionist = Role::firstOrCreate(['name' => 'receptionist']);

        // Assign permissions
        $admin->givePermissionTo(Permission::all());

        $doctor->givePermissionTo([
            'view patients',
            'view appointments',
        ]);

        $receptionist->givePermissionTo([
            'view patients',
            'schedule appointments',
            'view appointments',
        ]);
    }
}
