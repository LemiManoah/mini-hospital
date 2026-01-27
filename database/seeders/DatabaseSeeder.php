<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        // Seed roles & permissions first
        $this->call(RolePermissionSeeder::class);

        // Seed initial users and assign roles (admin, doctor, receptionist)
        $this->call(UserSeeder::class);

        // Seed doctor working hours for doctor users
        $this->call(DoctorWorkingHourSeeder::class);

        // Seed countries
        $this->call(CountrySeeder::class);
        // Seed patient categories
        $this->call(PatientCategorySeeder::class);
        // Seed addresses
        $this->call(AddressSeeder::class);
        // Seed patients
        $this->call(PatientSeeder::class);

        // Seed appointments (requires patients and doctor users)
        $this->call(AppointmentSeeder::class);

        $this->call(ClinicSeeder::class);
        $this->call(ServiceTypeSeeder::class);
        $this->call(ServiceSeeder::class);
    }
}
