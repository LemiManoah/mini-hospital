<?php

namespace App\Actions\Users;

use App\Models\User;
use App\Models\StaffProfile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUserWithProfile implements CreatesNewUsers
{
    /**
     * Validate and create a newly registered user with staff profile.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'confirmed'],
            'gender' => ['nullable', 'string', 'in:male,female,other'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'alternative_phone_number' => ['nullable', 'string', 'max:20'],
            'clinic_id' => ['nullable', 'integer', 'exists:clinics,id'],
            'address_id' => ['nullable', 'integer', 'exists:addresses,id'],
        ])->validate();

        // Create the user first
        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
        ]);

        // Create associated staff profile
        StaffProfile::create([
            'first_name' => $this->extractFirstName($input['name']),
            'last_name' => $this->extractLastName($input['name']),
            'email' => $input['email'],
            'staff_number' => $this->generateStaffNumber(),
            'gender' => $input['gender'] ?? 'other',
            'phone_number' => $input['phone_number'] ?? '',
            'alternative_phone_number' => $input['alternative_phone_number'] ?? '',
            'clinic_id' => $input['clinic_id'] ?? null,
            'address_id' => $input['address_id'] ?? null,
            'user_id' => $user->id,
        ]);

        // Assign role if provided
        if (isset($input['role'])) {
            $user->assignRole($input['role']);
        }

        return $user;
    }

    /**
     * Extract first name from full name.
     */
    private function extractFirstName(string $fullName): string
    {
        $parts = explode(' ', trim($fullName));
        return $parts[0] ?? $fullName;
    }

    /**
     * Extract last name from full name.
     */
    private function extractLastName(string $fullName): string
    {
        $parts = explode(' ', trim($fullName));
        return count($parts) > 1 ? implode(' ', array_slice($parts, 1)) : '';
    }

    /**
     * Generate a unique staff number.
     */
    private function generateStaffNumber(): string
    {
        do {
            $staffNumber = 'STAFF' . str_pad(mt_rand(1, 99999), 5, '0', STR_PAD_LEFT);
        } while (StaffProfile::where('staff_number', $staffNumber)->exists());

        return $staffNumber;
    }
}
