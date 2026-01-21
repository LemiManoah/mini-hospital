<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Services\UserService;
use App\Services\ClinicService;
use App\Services\AddressService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Auth\Events\Registered;
use App\Http\Requests\DeleteUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Validation\Rules\Password;

class UsersController extends Controller
{
    protected UserService $userService;
    protected AddressService $addressService;
    protected ClinicService $clinicService;

    public function __construct(UserService $userService, AddressService $addressService, ClinicService $clinicService)
    {
        $this->userService = $userService;
        $this->addressService = $addressService;
        $this->clinicService = $clinicService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $search = request('search');
        
        $users = $search 
            ? $this->userService->searchUsers($search)
            : $this->userService->getAllUsers();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $addresses = $this->addressService->getAllAddresses();
        $clinics = $this->clinicService->getAllClinics();
        return Inertia::render('Users/Create', [
            'addresses' => $addresses,
            'clinics' => $clinics,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => ['nullable', 'string', 'exists:roles,name'],
            'gender' => ['nullable', 'string', 'in:male,female,other'],
            'phone_number' => ['nullable', 'string', 'max:20'],
        ]);

        $user = $this->userService->createUser($validated);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->route('dashboard')
            ->with('success', 'User and staff profile created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user): Response
    {
        $user = $this->userService->getUserById($user->id);

        return Inertia::render('Users/Edit', [
            'user' => $user,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $validated = $request->validated();

        $this->userService->updateUser($user->id, $validated);

        return redirect()->route('users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        $this->userService->deleteUser($user->id);

        return redirect()->route('users.index')
            ->with('success', 'User deleted successfully.');
    }
}
