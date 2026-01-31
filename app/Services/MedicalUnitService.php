<?php

namespace App\Services;
use App\Models\MedicalUnit;

class MedicalUnitService
{
    public function searchMedicalUnits($query)
    {
        return MedicalUnit::where('name', 'like', "%$query%")
            ->orWhere('code', 'like', "%$query%")
            ->orWhere('category', 'like', "%$query%")
            ->orWhere('description', 'like', "%$query%");
    }

    public function getAllMedicalUnits()
    {
        return MedicalUnit::paginate(10);
    }

    public function getActiveMedicalUnits()
    {
        return MedicalUnit::active()->paginate(10);
    }

    public function getMedicalUnitsByCategory($category)
    {
        return MedicalUnit::active()->byCategory($category)->get();
    }

    public function getMedicalUnitById($id)
    {
        return MedicalUnit::find($id);
    }

    public function createMedicalUnit(array $data): MedicalUnit
    {
        return MedicalUnit::create($data);
    }

    public function updateMedicalUnit(string $id, array $data): MedicalUnit
    {
        $medicalUnit = MedicalUnit::findOrFail($id);
        $medicalUnit->update($data);
        return $medicalUnit;
    }

    public function deleteMedicalUnit(string $id): void
    {
        MedicalUnit::findOrFail($id)->delete();
    }

    public function restoreMedicalUnit(string $id): void
    {
        MedicalUnit::withTrashed()->findOrFail($id)->restore();
    }

    public function getTrashedMedicalUnits()
    {
        return MedicalUnit::onlyTrashed()->get();
    }

    public function getCategories()
    {
        return MedicalUnit::distinct()->pluck('category')->sort()->values();
    }
}
