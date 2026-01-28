<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Allergy;

class AllergySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $allergies = [
            [
                'name' => 'Penicillin',
                'description' => 'Antibiotic allergy that can cause severe reactions',
                'severity' => 'severe',
                'reaction_type' => 'Anaphylaxis',
                'is_active' => true,
            ],
            [
                'name' => 'Peanuts',
                'description' => 'Common food allergy that can cause life-threatening reactions',
                'severity' => 'severe',
                'reaction_type' => 'Anaphylaxis',
                'is_active' => true,
            ],
            [
                'name' => 'Shellfish',
                'description' => 'Seafood allergy affecting shrimp, crab, lobster',
                'severity' => 'severe',
                'reaction_type' => 'Anaphylaxis',
                'is_active' => true,
            ],
            [
                'name' => 'Latex',
                'description' => 'Rubber allergy common in healthcare settings',
                'severity' => 'moderate',
                'reaction_type' => 'Skin rash, Respiratory',
                'is_active' => true,
            ],
            [
                'name' => 'Dust Mites',
                'description' => 'Environmental allergen causing respiratory symptoms',
                'severity' => 'mild',
                'reaction_type' => 'Respiratory',
                'is_active' => true,
            ],
            [
                'name' => 'Pollen',
                'description' => 'Seasonal environmental allergen',
                'severity' => 'mild',
                'reaction_type' => 'Respiratory, Eye irritation',
                'is_active' => true,
            ],
            [
                'name' => 'Mold',
                'description' => 'Fungal spore allergy',
                'severity' => 'moderate',
                'reaction_type' => 'Respiratory',
                'is_active' => true,
            ],
            [
                'name' => 'Eggs',
                'description' => 'Common food allergy in children',
                'severity' => 'moderate',
                'reaction_type' => 'Skin rash, Digestive',
                'is_active' => true,
            ],
            [
                'name' => 'Milk',
                'description' => 'Dairy allergy, different from lactose intolerance',
                'severity' => 'moderate',
                'reaction_type' => 'Skin rash, Digestive',
                'is_active' => true,
            ],
            [
                'name' => 'Soy',
                'description' => 'Legume allergy common in food products',
                'severity' => 'mild',
                'reaction_type' => 'Skin rash, Digestive',
                'is_active' => true,
            ],
            [
                'name' => 'Wheat',
                'description' => 'Gluten-related allergy',
                'severity' => 'moderate',
                'reaction_type' => 'Skin rash, Digestive',
                'is_active' => true,
            ],
            [
                'name' => 'Tree Nuts',
                'description' => 'Includes almonds, walnuts, cashews, etc.',
                'severity' => 'severe',
                'reaction_type' => 'Anaphylaxis',
                'is_active' => true,
            ],
            [
                'name' => 'Fish',
                'description' => 'Finned fish allergy separate from shellfish',
                'severity' => 'moderate',
                'reaction_type' => 'Skin rash, Respiratory',
                'is_active' => true,
            ],
            [
                'name' => 'Sesame',
                'description' => 'Growing common food allergen',
                'severity' => 'moderate',
                'reaction_type' => 'Skin rash, Anaphylaxis',
                'is_active' => true,
            ],
            [
                'name' => 'Bee Stings',
                'description' => 'Insect venom allergy',
                'severity' => 'severe',
                'reaction_type' => 'Anaphylaxis',
                'is_active' => true,
            ],
        ];

        foreach ($allergies as $allergy) {
            Allergy::create($allergy);
        }
    }
}
