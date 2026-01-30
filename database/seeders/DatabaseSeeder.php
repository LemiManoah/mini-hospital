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

        // Seed core data
        $this->call([
            PatientCategorySeeder::class,
            PatientSeeder::class,
            AppointmentCategorySeeder::class,
            AppointmentMethodSeeder::class,
            ClinicSeeder::class,
            ServiceTypeSeeder::class,
            ServiceSeeder::class,
            VisitStatusSeeder::class,
            VisitTypeSeeder::class,
            PatientVisitSeeder::class,
            VisitTriageSeeder::class,
            VisitNoteSeeder::class,
            LabServiceCategorySeeder::class,
            LabSampleTypeSeeder::class,
            LabServiceSeeder::class,
            LabResultTypeSeeder::class,
            LabResultOptionsSeeder::class,
        ]);

        // Seed appointments (requires patients and doctor users)
        $this->call(AppointmentSeeder::class);
    }
}
