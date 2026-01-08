<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;
use App\Models\Country;
use App\Models\PatientCategory;
use App\Enums\EnumsGender;
use App\Enums\EnumsMaritalStatus;
use App\Enums\EnumsReligions;
use App\Enums\EnumsKinRelationship;
use App\Models\Address;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Patient>
 */
class PatientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $dob = $this->faker->dateTimeBetween('-90 years', '-0 years');
        $dobDate = Carbon::parse($dob)->toDateString();
        $ageYears = Carbon::parse($dob)->diffInYears(now());
        $ageMonths = Carbon::parse($dob)->diffInMonths(now()) - ($ageYears * 12);
        $isPediatric = $ageYears < 18;

        $genders = array_map(fn($c) => $c->value, EnumsGender::cases());
        $maritals = array_map(fn($c) => $c->value, EnumsMaritalStatus::cases());
        $religions = array_map(fn($c) => $c->value, EnumsReligions::cases());
        $kins = array_map(fn($c) => $c->value, EnumsKinRelationship::cases());

        $countryId = Country::inRandomOrder()->value('id') ?? Country::firstOrCreate(['name' => 'Uganda'])->id;
        $categoryId = PatientCategory::inRandomOrder()->value('id') ?? PatientCategory::factory()->create()->id;
        $addressId = \App\Models\Address::factory()->create()->id ?? Address::factory()->create()->id;

        return [
            'patient_number' => $this->faker->unique()->numerify('P#######'),
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'date_of_birth' => $dobDate,

            'is_pediatric' => $isPediatric,
            'age_years' => $ageYears,
            'age_months' => $ageMonths,

            'preferred_language' => $this->faker->randomElement(['English','French','Swahili','Arabic','Portuguese']),
            'religion' => $this->faker->randomElement($religions),
            'country_id' => $countryId,

            'registration_date' => $this->faker->dateTimeBetween('-5 years', 'now')->format('Y-m-d'),
            'is_active' => $this->faker->boolean(90),

            'gender' => $this->faker->randomElement($genders),
            'marital_status' => $this->faker->randomElement($maritals),

            'patient_category_id' => $categoryId,
            'address_id' => $addressId,

            'next_of_kin_name' => $this->faker->name(),
            'next_of_kin_number' => $this->faker->phoneNumber(),
            'next_of_kin_relationship' => $this->faker->randomElement($kins),

            'phone_number' => $this->faker->phoneNumber(),
            'alternative_phone_number' => $this->faker->optional()->phoneNumber(),
            'phone_owner' => $this->faker->boolean(80),
        ];
    }
}
