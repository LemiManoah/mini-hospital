<?php

namespace App\Services;
use App\Models\Clinic;

class ClinicService
{
    public function searchClinics($query)
    {
        return Clinic::where('name', 'like', "%$query%")
            ->orWhere('address', 'like', "%$query%")
            ->orWhere('type', 'like', "%$query%");
    }
    public function getAllClinics()
    {
        return Clinic::paginate(10);
    }

    public function getClinicById($id)
    {
        return Clinic::find($id);
    }

    public function createClinic(array $data): Clinic
    {
        return Clinic::create($data);
    }

    public function updateClinic(string $id, array $data): Clinic
    {
        $clinic = Clinic::findOrFail($id);
        $clinic->update($data);
        return $clinic;
    }

    public function deleteClinic(string $id): void
    {
        Clinic::findOrFail($id)->delete();
    }

    public function restoreClinic(string $id): void
    {
        Clinic::withTrashed()->findOrFail($id)->restore();
    }

    public function getTrashedClinics()
    {
        return Clinic::onlyTrashed()->get();
    }
}
