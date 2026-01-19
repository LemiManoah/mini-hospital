<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\RoleRequest;
use App\Services\RoleService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function __construct(protected RoleService $roleService)
    {
    }

    public function index(Request $request)
    {
        $search = $request->get('search');

        if (!empty($search)) {
            $roles = $this->roleService->searchRoles($search);
        } else {
            $roles = $this->roleService->getAllRoles();
        }
        
        // Load permissions with roles
        $roles->load('permissions');
        
        return Inertia::render('Roles/Index', [
            'roles' => $roles,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Roles/Create', [
            'permissions' => Permission::all()->pluck('name', 'id'),
        ]);
    }

    public function store(RoleRequest $request)
    {
        $role = $this->roleService->createRole($request->validated());
        $role->syncPermissions($request->input('permissions'));
        return redirect()->route('roles.index')->with('success', 'Role created successfully.');
    }

    public function edit(Role $role)
    {
        $role->load('permissions');

        return Inertia::render('Roles/Edit', [
            'role' => $role,
            'permissions' => Permission::all()->pluck('name', 'id'),
        ]);
    }

    public function update(RoleRequest $request, Role $role)
    {
        $role = $this->roleService->updateRole($role->id, $request->validated());

        if ($request->has('permissions')) {
            $role->syncPermissions($request->input('permissions'));
        } else {
            $role->syncPermissions([]);
        }

        return redirect()->route('roles.index')->with('success', 'Role updated successfully.');
    }

    public function destroy(Role $role)
    {
        $role->delete();

        return back()->with('success', 'Role deleted successfully.');
    }
}