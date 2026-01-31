<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\MedicalUnit;

class MedicalUnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $medicalUnits = [
            // Solid dosage forms
            ['name' => 'Tablet', 'code' => 'tab', 'category' => 'solid', 'description' => 'Solid dosage form for oral administration'],
            ['name' => 'Capsule', 'code' => 'cap', 'category' => 'solid', 'description' => 'Gelatin shell containing powdered medication'],
            ['name' => 'Pill', 'code' => 'pill', 'category' => 'solid', 'description' => 'Small, round solid dosage form'],
            ['name' => 'Lozenge', 'code' => 'loz', 'category' => 'solid', 'description' => 'Medicated tablet that dissolves slowly in the mouth'],
            ['name' => 'Chewable Tablet', 'code' => 'chew', 'category' => 'solid', 'description' => 'Tablet designed to be chewed before swallowing'],
            ['name' => 'Effervescent Tablet', 'code' => 'eff', 'category' => 'solid', 'description' => 'Tablet that fizzes when dissolved in water'],
            ['name' => 'Suppository', 'code' => 'sup', 'category' => 'solid', 'description' => 'Solid dosage form for rectal or vaginal insertion'],
            ['name' => 'Granules', 'code' => 'gran', 'category' => 'solid', 'description' => 'Small particles of medication'],
            ['name' => 'Powder', 'code' => 'pow', 'category' => 'solid', 'description' => 'Dry form of medication for reconstitution'],
            ['name' => 'Sachet', 'code' => 'sach', 'category' => 'solid', 'description' => 'Small packet containing powdered medication'],

            // Liquid dosage forms
            ['name' => 'Bottle', 'code' => 'btl', 'category' => 'liquid', 'description' => 'Container for liquid medication'],
            ['name' => 'Syrup', 'code' => 'syr', 'category' => 'liquid', 'description' => 'Sweetened liquid medication'],
            ['name' => 'Solution', 'code' => 'sol', 'category' => 'liquid', 'description' => 'Clear liquid medication'],
            ['name' => 'Suspension', 'code' => 'sus', 'category' => 'liquid', 'description' => 'Liquid with undissolved particles'],
            ['name' => 'Elixir', 'code' => 'elix', 'category' => 'liquid', 'description' => 'Sweetened, flavored liquid medication'],
            ['name' => 'Tincture', 'code' => 'tinc', 'category' => 'liquid', 'description' => 'Alcohol-based liquid extract'],
            ['name' => 'Drops', 'code' => 'drops', 'category' => 'liquid', 'description' => 'Liquid medication administered in drops'],
            ['name' => 'Injectable', 'code' => 'inj', 'category' => 'liquid', 'description' => 'Sterile solution for injection'],
            ['name' => 'Infusion', 'code' => 'inf', 'category' => 'liquid', 'description' => 'Liquid medication for IV administration'],
            ['name' => 'Vial', 'code' => 'vial', 'category' => 'liquid', 'description' => 'Small glass container for liquid medication'],

            // Topical dosage forms
            ['name' => 'Ointment', 'code' => 'oint', 'category' => 'topical', 'description' => 'Semi-solid preparation for external use'],
            ['name' => 'Cream', 'code' => 'cr', 'category' => 'topical', 'description' => 'Semi-solid preparation for skin application'],
            ['name' => 'Gel', 'code' => 'gel', 'category' => 'topical', 'description' => 'Semi-solid, jelly-like preparation'],
            ['name' => 'Lotion', 'code' => 'lot', 'category' => 'topical', 'description' => 'Liquid preparation for skin application'],
            ['name' => 'Paste', 'code' => 'paste', 'category' => 'topical', 'description' => 'Thick semi-solid preparation'],
            ['name' => 'Poultice', 'code' => 'poul', 'category' => 'topical', 'description' => 'Soft, moist mass applied to the body'],
            ['name' => 'Plaster', 'code' => 'plas', 'category' => 'topical', 'description' => 'Solid preparation applied to the skin'],
            ['name' => 'Patch', 'code' => 'patch', 'category' => 'topical', 'description' => 'Adhesive patch delivering medication through skin'],

            // Inhalation dosage forms
            ['name' => 'Inhaler', 'code' => 'inh', 'category' => 'inhalation', 'description' => 'Device for delivering medication to the lungs'],
            ['name' => 'Nebulizer', 'code' => 'neb', 'category' => 'inhalation', 'description' => 'Device that converts liquid into aerosol'],
            ['name' => 'Spray', 'code' => 'spray', 'category' => 'inhalation', 'description' => 'Fine mist of medication particles'],
            ['name' => 'Vaporizer', 'code' => 'vap', 'category' => 'inhalation', 'description' => 'Device for producing medicinal vapor'],

            // Other dosage forms
            ['name' => 'Ampoule', 'code' => 'amp', 'category' => 'other', 'description' => 'Sealed glass container for sterile medication'],
            ['name' => 'Cartridge', 'code' => 'cart', 'category' => 'other', 'description' => 'Container for prefilled medication'],
            ['name' => 'Device', 'code' => 'dev', 'category' => 'other', 'description' => 'Medical device for medication delivery'],
            ['name' => 'Kit', 'code' => 'kit', 'category' => 'other', 'description' => 'Set of medical supplies and medications'],
            ['name' => 'Pack', 'code' => 'pack', 'category' => 'other', 'description' => 'Packaged medication set'],
        ];

        foreach ($medicalUnits as $unit) {
            MedicalUnit::create($unit);
        }
    }
}
