<?php

namespace App\Services;

use App\Models\LabSampleType;

class LabSampleTypeService
{
    public function searchLabSampleTypes($query)
    {
        return LabSampleType::where('name', 'like', "%{$query}%")
            ->orWhere('code', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->paginate(10);
    }

    public function getAllLabSampleTypes()
    {
        return LabSampleType::paginate(10);
    }

    public function getActiveLabSampleTypes()
    {
        return LabSampleType::active()->paginate(10);
    }

    public function getLabSampleTypeById($id)
    {
        return LabSampleType::find($id);
    }

    public function getLabSampleTypeByCode($code)
    {
        return LabSampleType::where('code', $code)->first();
    }

    public function createLabSampleType(array $data): LabSampleType
    {
        return LabSampleType::create($data);
    }

    public function updateLabSampleType(string $id, array $data): LabSampleType
    {
        $labSampleType = LabSampleType::findOrFail($id);
        $labSampleType->update($data);
        return $labSampleType;
    }

    public function deleteLabSampleType(string $id): void
    {
        LabSampleType::findOrFail($id)->delete();
    }

    public function restoreLabSampleType(string $id): void
    {
        LabSampleType::withTrashed()->findOrFail($id)->restore();
    }

    public function getTrashedLabSampleTypes()
    {
        return LabSampleType::onlyTrashed()->get();
    }

    public function toggleActiveStatus(string $id): LabSampleType
    {
        $labSampleType = LabSampleType::findOrFail($id);
        $labSampleType->is_active = !$labSampleType->is_active;
        $labSampleType->save();
        return $labSampleType;
    }
}
