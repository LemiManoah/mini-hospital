<?php

namespace App\Services;
use App\Models\VisitType;

class VisitTypeService
{
    public function searchVisitTypes($query)
    {
        return VisitType::where('code', 'like', "%$query%")
            ->orWhere('name', 'like', "%$query%")
            ->orWhere('description', 'like', "%$query%");
    }

    public function getAllVisitTypes()
    {
        return VisitType::paginate(10);
    }

    public function getActiveVisitTypes()
    {
        return VisitType::active()->paginate(10);
    }

    public function getVisitTypeById($id)
    {
        return VisitType::find($id);
    }

    public function getVisitTypeByCode($code)
    {
        return VisitType::where('code', $code)->first();
    }

    public function createVisitType(array $data): VisitType
    {
        return VisitType::create($data);
    }

    public function updateVisitType(string $id, array $data): VisitType
    {
        $visitType = VisitType::findOrFail($id);
        $visitType->update($data);
        return $visitType;
    }

    public function deleteVisitType(string $id): void
    {
        VisitType::findOrFail($id)->delete();
    }

    public function restoreVisitType(string $id): void
    {
        VisitType::withTrashed()->findOrFail($id)->restore();
    }

    public function getTrashedVisitTypes()
    {
        return VisitType::onlyTrashed()->get();
    }

    public function toggleActiveStatus(string $id): VisitType
    {
        $visitType = VisitType::findOrFail($id);
        $visitType->is_active = !$visitType->is_active;
        $visitType->save();
        return $visitType;
    }
}
