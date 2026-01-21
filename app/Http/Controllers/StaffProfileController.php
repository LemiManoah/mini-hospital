<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Address;
use App\Models\Country;
use App\Models\Patient;
use App\Enums\EnumsGender;
use App\Models\StaffProfile;
use Illuminate\Http\Request;
use App\Enums\EnumsReligions;
use App\Models\PatientCategory;
use App\Enums\EnumsMaritalStatus;
use App\Enums\EnumsKinRelationship;
use Illuminate\Support\Facades\Log;
use App\Services\StaffProfileService;
use App\Http\Requests\StoreStaffProfileRequest;
use App\Http\Requests\UpdateStaffProfileRequest;

class StaffProfileController extends Controller
{
    public function __construct(
        protected StaffProfileService $staffProfileService,
    ) {
    }

    public function index(Request $request)
    {
        $search = $request->get('search');

        if (!empty($search)) {
            $staffProfiles = $this->staffProfileService->searchStaffProfiles($search);
        } else {
            $staffProfiles = $this->staffProfileService->getAllStaffProfiles();
        }

        return Inertia::render('StaffProfile/Index', [
            'staffProfiles' => $staffProfiles,
            'filters' => [
                'search' => $search,
            ],
            'genders' => EnumsGender::options(),
        ]);
    }

    public function create()
    {
        $countries = Country::select('id', 'name')->orderBy('name')->get();
        $clinics = \App\Models\Clinic::select('id', 'name')->orderBy('name')->get();
        $addresses = Address::select('id', 'district', 'city', 'county')
            ->orderBy('district')
            ->orderBy('city')
            ->get()
            ->map(fn($address) => [
                'id' => $address->id,
                'display_name' => "{$address->district} - {$address->city} - {$address->county}"
            ]);

        return Inertia::render('StaffProfile/Create', [
            'clinics' => $clinics,
            'addresses' => $addresses,
            'countries' => $countries,
        ]);
    }

    public function store(StoreStaffProfileRequest $request)
    {
        try {
            $validated = $request->validated();

            // Generate a unique staff profile number
            do {
                $validated['staff_profile_number'] = $this->staffProfileService->generateStaffProfileNumber();
            } while (StaffProfile::where('staff_profile_number', $validated['staff_profile_number'])->exists());

            $staffProfile = $this->staffProfileService->createStaffProfile($validated);

            return redirect()
                ->route('staff-profile.index')
                ->with('success', 'Staff profile created successfully');
        } catch (\Exception $e) {
            Log::error('Error creating staff profile: ' . $e->getMessage());
            Log::error($e->getTraceAsString());

            return back()
                ->withInput()
                ->with('error', 'Failed to create staff profile. Please try again.');
        }
    }


    public function show(string $id)
    {
        $staffProfile = $this->staffProfileService->getStaffProfileById($id);
        $staffProfile->load(['address', 'appointments' => function($q) {
            $q->with('doctor')
                ->where('appointment_date', '>=', now()->toDateString())
                ->orderBy('appointment_date')
                ->orderBy('appointment_time');
        }]);

        if ($staffProfile->address) {
            $staffProfile->address->display_name = "{$staffProfile->address->district} - {$staffProfile->address->city} - {$staffProfile->address->county}";
        }

        return Inertia::render('StaffProfile/Show', [
            'staffProfile' => $staffProfile,
            'appointments' => $staffProfile->appointments,
        ]);
    }

    public function edit(string $id)
    {
        $staffProfile = $this->staffProfileService->getStaffProfileById($id);
        $countries = Country::select('id', 'name')->orderBy('name')->get();
        $clinics = \App\Models\Clinic::select('id', 'name')->orderBy('name')->get();
        $addresses = Address::select('id', 'district', 'city', 'county')
            ->orderBy('district')
            ->orderBy('city')
            ->get()
            ->map(fn($address) => [
                'id' => $address->id,
                'display_name' => "{$address->district} - {$address->city} - {$address->county}"
            ]);

        return Inertia::render('StaffProfile/Edit', [
            'clinics' => $clinics,
            'countries' => $countries,
            'addresses' => $addresses,
            'staffProfile' => $staffProfile,
        ]);
    }

    public function update(UpdateStaffProfileRequest $request, string $id)
    {
        $this->staffProfileService->updateStaffProfile($id, $request->validated());

        return redirect()->route('staff-profile.index')->with('success', 'Staff profile updated successfully');
    }

    public function destroy(string $id)
    {
        $this->staffProfileService->deleteStaffProfile($id);

        return redirect()->route('staff-profile.index')->with('success', 'Staff profile deleted successfully');
    }

    public function restore(string $id)
    {
        $this->staffProfileService->restoreStaffProfile($id);

        return redirect()->route('staff-profile.index')->with('success', 'Staff profile restored successfully');
    }
}
