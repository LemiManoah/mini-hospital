<?php

namespace App\Services;
use App\Models\StaffProfile;
use Illuminate\Support\Str;

class StaffProfileService
{
    public function searchStaffProfiles($query)
    {
        return StaffProfile::where('first_name', 'like', "%$query%")
            ->orWhere('last_name', 'like', "%$query%")
            ->orWhere('staff_number', 'like', "%$query%");
    }
    public function getAllStaffProfiles()
    {
        return StaffProfile::with(['user', 'clinic', 'address'])->paginate(10);
    }

    public function getStaffProfileById($id)
    {
        return StaffProfile::with(['user', 'clinic', 'address'])->find($id);
    }

    public function createStaffProfile(array $data): StaffProfile
    {
        return StaffProfile::create($data);
    }

    public function updateStaffProfile(string $id, array $data): StaffProfile
    {
        $staffProfile = StaffProfile::findOrFail($id);
        $staffProfile->update($data);
        return $staffProfile;
    }

    public function deleteStaffProfile(string $id): void
    {
        StaffProfile::findOrFail($id)->delete();
    }

    public function restoreStaffProfile(string $id): void
    {
        StaffProfile::withTrashed()->findOrFail($id)->restore();
    }

    public function getTrashedStaffProfiles()
    {
        return StaffProfile::onlyTrashed()->get();
    }

    public function generateStaffProfileNumber()
    {
        return 'SP-' . Str::random(6);
    }
}
