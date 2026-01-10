<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Address;

class AddressSeeder extends Seeder
{
    public function run(): void
    {
        $addresses = [
            // Kampala District
            ['district' => 'Kampala', 'city' => 'Kampala', 'county' => 'Central'],
            ['district' => 'Kampala', 'city' => 'Kampala', 'county' => 'Nakawa'],
            ['district' => 'Kampala', 'city' => 'Kampala', 'county' => 'Makindye'],
            ['district' => 'Kampala', 'city' => 'Kampala', 'county' => 'Rubaga'],
            ['district' => 'Kampala', 'city' => 'Kampala', 'county' => 'Kawempe'],

            // Wakiso District
            ['district' => 'Wakiso', 'city' => 'Entebbe', 'county' => 'Municipality'],
            ['district' => 'Wakiso', 'city' => 'Nansana', 'county' => 'Municipality'],
            ['district' => 'Wakiso', 'city' => 'Kira', 'county' => 'Municipality'],
            ['district' => 'Wakiso', 'city' => 'Busiro', 'county' => 'East'],
            ['district' => 'Wakiso', 'city' => 'Busiro', 'county' => 'West'],

            // Mukono District
            ['district' => 'Mukono', 'city' => 'Mukono', 'county' => 'Municipality'],
            ['district' => 'Mukono', 'city' => 'Ntenjeru', 'county' => 'North'],
            ['district' => 'Mukono', 'city' => 'Ntenjeru', 'county' => 'South'],

            // Jinja District
            ['district' => 'Jinja', 'city' => 'Jinja', 'county' => 'Municipality'],
            ['district' => 'Jinja', 'city' => 'Bugembe', 'county' => 'Town Council'],

            // Mbarara District
            ['district' => 'Mbarara', 'city' => 'Mbarara', 'county' => 'Municipality'],
            ['district' => 'Mbarara', 'city' => 'Nyamitanga', 'county' => 'Division'],

            // Gulu District
            ['district' => 'Gulu', 'city' => 'Gulu', 'county' => 'Municipality'],
            ['district' => 'Gulu', 'city' => 'Bardege', 'county' => 'Division'],
            ['district' => 'Gulu', 'city' => 'Layibi', 'county' => 'Division'],
        ];

        foreach ($addresses as $address) {
            Address::firstOrCreate($address);
        }
    }
}
