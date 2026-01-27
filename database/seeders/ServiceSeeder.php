<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\ServiceType;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $serviceTypes = ServiceType::all();

        $services = [
            [
                'name' => 'General Consultation',
                'description' => 'Basic health consultation service.',
                'cost' => 20.00,
                'price' => 50.00,
                'service_type' => 'Consultation',
            ],
            [
                'name' => 'Pediatric Checkup',
                'description' => 'Health checkup service for children.',
                'cost' => 25.00,
                'price' => 60.00,
                'service_type' => 'Consultation',
            ],
            [
                'name' => 'Dental Cleaning',
                'description' => 'Oral hygiene and dental cleaning service.',
                'cost' => 10.00,
                'price' => 30.00,
                'service_type' => 'Dental',
            ],
            [
                'name' => 'Blood Test',
                'description' => 'Comprehensive blood testing service.',
                'cost' => 15.00,
                'price' => 40.00,
                'service_type' => 'Laboratory',
            ],
            [
                'name' => 'CT Scan',
                'description' => 'Diagnostic CT scan service.',
                'cost' => 50.00,
                'price' => 100.00,
                'service_type' => 'Radiology',
            ],
            [
                'name' => 'X-Ray Imaging',
                'description' => 'Diagnostic X-Ray imaging service.',
                'cost' => 30.00,
                'price' => 80.00,
                'service_type' => 'Radiology',
            ],
        ];

        foreach ($services as $service) {
            $serviceType = $serviceTypes->where('name', $service['service_type'])->first();
            Service::factory()->create([
                'service_type_id' => $serviceType->id,
                'name' => $service['name'],
                'description' => $service['description'],
                'cost' => $service['cost'],
                'price' => $service['price'],
            ]);
        }
    }
}
