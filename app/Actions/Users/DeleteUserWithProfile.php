<?php

namespace App\Actions\Users;

use App\Models\User;
use Illuminate\Support\Facades\Validator;

class DeleteUserWithProfile
{
    /**
     * Validate and delete a user with associated staff profile.
     *
     * @param  User  $user
     */
    public function delete(User $user): bool
    {
        Validator::make(['user_id' => $user->id], [
            'user_id' => ['required', 'exists:users,id'],
        ])->validate();

        // Delete associated staff profile first (due to foreign key constraint)
        if ($user->staffProfile) {
            $user->staffProfile->delete();
        }

        return $user->delete();
    }
}
