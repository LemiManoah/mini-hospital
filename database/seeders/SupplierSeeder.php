<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Supplier;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $suppliers = [
            [
                'name' => 'MediPharm Kenya Ltd',
                'contact_person' => 'Dr. John Kamau',
                'email' => 'info@medipharm.co.ke',
                'phone' => '+254-20-1234567',
                'address' => 'Industrial Area, Phase II, Nairobi, Kenya',
                'notes' => 'Major pharmaceutical distributor with nationwide coverage',
            ],
            [
                'name' => 'East Africa Pharmaceuticals',
                'contact_person' => 'Sarah Wanjiru',
                'email' => 'sales@eapharma.com',
                'phone' => '+254-20-2345678',
                'address' => 'Mombasa Road, Industrial Area, Nairobi',
                'notes' => 'Specializes in generic medicines',
            ],
            [
                'name' => 'Global Pharma Supplies',
                'contact_person' => 'Michael Ochieng',
                'email' => 'michael@globalpharma.com',
                'phone' => '+254-20-3456789',
                'address' => 'Kilimani Business Centre, Nairobi',
                'notes' => 'Imports from Europe and Asia',
            ],
            [
                'name' => 'MedTech Equipment Ltd',
                'contact_person' => 'Engineer Peter Mwangi',
                'email' => 'info@medtech.co.ke',
                'phone' => '+254-20-4567890',
                'address' => 'Westlands, Sarit Centre, Nairobi',
                'notes' => 'Diagnostic and therapeutic equipment',
            ],
            [
                'name' => 'Healthcare Solutions Africa',
                'contact_person' => 'Grace Achieng',
                'email' => 'grace@healthcafrica.com',
                'phone' => '+254-20-5678901',
                'address' => 'Upper Hill Medical District, Nairobi',
                'notes' => 'Hospital equipment and furniture',
            ],
            [
                'name' => 'Precision Medical Devices',
                'contact_person' => 'Dr. Samuel Kiprop',
                'email' => 'sales@precisionmed.com',
                'phone' => '+254-20-6789012',
                'address' => 'Karen Business Park, Nairobi',
                'notes' => 'Surgical instruments and devices',
            ],
            [
                'name' => 'MediSupply Kenya',
                'contact_person' => 'Lucy Njeri',
                'email' => 'orders@medisupply.co.ke',
                'phone' => '+254-20-7890123',
                'address' => 'Buruburu Shopping Centre, Nairobi',
                'notes' => 'Medical consumables and disposables',
            ],
            [
                'name' => 'Sterile Products Ltd',
                'contact_person' => 'David Mutua',
                'email' => 'info@sterileproducts.co.ke',
                'phone' => '+254-20-8901234',
                'address' => 'Thika Road, Roysambu, Nairobi',
                'notes' => 'Sterile medical supplies',
            ],
            [
                'name' => 'LabTech Supplies',
                'contact_person' => 'Dr. Mary Atieno',
                'email' => 'labtech@labtech.co.ke',
                'phone' => '+254-20-9012345',
                'address' => 'Kenyatta Avenue, Nairobi',
                'notes' => 'Laboratory reagents and equipment',
            ],
            [
                'name' => 'BioChem Diagnostics',
                'contact_person' => 'Prof. James Muriuki',
                'email' => 'info@biochemdiagnostics.com',
                'phone' => '+254-20-0123456',
                'address' => 'Kenyatta National Hospital Complex, Nairobi',
                'notes' => 'Diagnostic kits and reagents',
            ],
            [
                'name' => 'Universal Medical Supplies',
                'contact_person' => 'Hassan Ali',
                'email' => 'info@universalmed.com',
                'phone' => '+254-20-1234568',
                'address' => 'Eastleigh, 1st Avenue, Nairobi',
                'notes' => 'Mixed medical supplies and equipment',
            ],
            [
                'name' => 'Coastal Medical Distributors',
                'contact_person' => 'Fatuma Hassan',
                'email' => 'coastal@medicaldist.co.ke',
                'phone' => '+254-41-234567',
                'address' => 'Mombasa Road, Nyali, Mombasa',
                'notes' => 'Coastal region distributor',
            ],
            [
                'name' => 'Rift Valley Medical Supplies',
                'contact_person' => 'Joseph Kipchumba',
                'email' => 'info@riftvalleymed.com',
                'phone' => '+254-51-23456',
                'address' => 'Eldoret Town Centre, Eldoret',
                'notes' => 'Rift Valley region supplier',
            ],
            [
                'name' => 'Western Kenya Healthcare',
                'contact_person' => 'Beatrice Akinyi',
                'email' => 'western@healthcare.co.ke',
                'phone' => '+254-56-234567',
                'address' => 'Kisumu Business District, Kisumu',
                'notes' => 'Western Kenya region distributor',
            ],
            [
                'name' => 'Northern Frontier Medical',
                'contact_person' => 'Abdi Mohamed',
                'email' => 'north@frontiermed.com',
                'phone' => '+254-61-23456',
                'address' => 'Garissa Town, Garissa',
                'notes' => 'Northern Kenya region supplier',
            ],
        ];

        foreach ($suppliers as $supplier) {
            Supplier::create($supplier);
        }
    }
}
