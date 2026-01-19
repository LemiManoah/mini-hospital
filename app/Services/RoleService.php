<?php

namespace App\Services;
use Spatie\Permission\Models\Role;

class RoleService
{
    public function searchRoles($query)
    {
        return Role::where('name', 'like', "%$query%");
    }
    public function getAllRoles()
    {
        return Role::paginate(10);
    }

    public function getRoleById($id)
    {
        return Role::find($id);
    }

    public function createRole(array $data): Role
    {
        return Role::create($data);
    }

    public function updateRole(string $id, array $data): Role
    {
        $role = Role::findOrFail($id);
        $role->update($data);
        return $role;
    }

    public function deleteRole(string $id): void
    {
        Role::findOrFail($id)->delete();
    }

    public function restoreRole(string $id): void
    {
        Role::withTrashed()->findOrFail($id)->restore();
    }

    public function getTrashedRoles()
    {
        return Role::onlyTrashed()->get();
    }
}
