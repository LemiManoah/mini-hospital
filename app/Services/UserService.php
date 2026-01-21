<?php

namespace App\Services;

use App\Models\User;
use App\Actions\Users\CreateNewUserWithProfile;
use App\Actions\Users\UpdateUserWithProfile;
use App\Actions\Users\DeleteUserWithProfile;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class UserService
{
    protected CreateNewUserWithProfile $createUserAction;
    protected UpdateUserWithProfile $updateUserAction;
    protected DeleteUserWithProfile $deleteUserAction;

    public function __construct(
        CreateNewUserWithProfile $createUserAction,
        UpdateUserWithProfile $updateUserAction,
        DeleteUserWithProfile $deleteUserAction
    ) {
        $this->createUserAction = $createUserAction;
        $this->updateUserAction = $updateUserAction;
        $this->deleteUserAction = $deleteUserAction;
    }

    /**
     * Get all users with pagination and relationships.
     */
    public function getAllUsers(): LengthAwarePaginator
    {
        return User::with('roles')->paginate(10);
    }

    /**
     * Get user by ID with relationships.
     */
    public function getUserById(int $id): ?User
    {
        return User::with('roles')->find($id);
    }

    /**
     * Create a new user and associated staff profile using Action.
     */
    public function createUser(array $data): User
    {
        return $this->createUserAction->create($data);
    }

    /**
     * Update an existing user using Action.
     */
    public function updateUser(int $id, array $data): User
    {
        $user = User::findOrFail($id);
        return $this->updateUserAction->update($user, $data);
    }

    /**
     * Delete a user and associated staff profile using Action.
     */
    public function deleteUser(int $id): bool
    {
        $user = User::find($id);
        
        if (!$user) {
            return false;
        }

        return $this->deleteUserAction->delete($user);
    }

    /**
     * Search users by name or email.
     */
    public function searchUsers(string $search): LengthAwarePaginator
    {
        return User::with('roles')
            ->where('name', 'like', "%{$search}%")
            ->orWhere('email', 'like', "%{$search}%")
            ->paginate(10);
    }

    /**
     * Get users by role.
     */
    public function getUsersByRole(string $role): Collection
    {
        return User::role($role)->get();
    }

    /**
     * Get user statistics.
     */
    public function getUserStats(): array
    {
        return [
            'total_users' => User::count(),
            'verified_users' => User::whereNotNull('email_verified_at')->count(),
            'unverified_users' => User::whereNull('email_verified_at')->count(),
            'users_by_role' => User::withCount('roles')
                ->get()
                ->groupBy('roles.name')
                ->mapWithKeys(function ($user) {
                    return $user->roles->first()->name ?? 'No Role';
                })
                ->map(function ($group) {
                    return $group->count();
                }),
        ];
    }
}
