<?php

namespace App\Actions\Users;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UpdateUserWithProfile
{
    /**
     * Validate and update an existing user with staff profile.
     *
     * @param  User  $user
     * @param  array<string, string>  $input
     */
    public function update(User $user, array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'password' => ['nullable', 'string', 'confirmed'],
            'role' => ['nullable', 'string', 'exists:roles,name'],
            'gender' => ['nullable', 'string', 'in:male,female,other'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'alternative_phone_number' => ['nullable', 'string', 'max:20'],
            'clinic_id' => ['nullable', 'integer', 'exists:clinics,id'],
            'address_id' => ['nullable', 'integer', 'exists:addresses,id'],
        ])->validate();

        $updateData = [
            'name' => $input['name'],
            'email' => $input['email'],
        ];

        // Update password if provided
        if (!empty($input['password'])) {
            $updateData['password'] = Hash::make($input['password']);
        }

        $user->update($updateData);

        // Update role if provided
        if (isset($input['role'])) {
            $user->syncRoles([$input['role']]);
        }

        // Update associated staff profile if it exists
        if ($user->staffProfile) {
            $profileUpdateData = [
                'first_name' => $this->extractFirstName($input['name']),
                'last_name' => $this->extractLastName($input['name']),
                'email' => $input['email'],
            ];

            // Update optional fields if provided
            if (isset($input['gender'])) {
                $profileUpdateData['gender'] = $input['gender'];
            }
            if (isset($input['phone_number'])) {
                $profileUpdateData['phone_number'] = $input['phone_number'];
            }
            if (isset($input['alternative_phone_number'])) {
                $profileUpdateData['alternative_phone_number'] = $input['alternative_phone_number'];
            }
            if (isset($input['clinic_id'])) {
                $profileUpdateData['clinic_id'] = $input['clinic_id'];
            }
            if (isset($input['address_id'])) {
                $profileUpdateData['address_id'] = $input['address_id'];
            }

            $user->staffProfile->update($profileUpdateData);
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
}
