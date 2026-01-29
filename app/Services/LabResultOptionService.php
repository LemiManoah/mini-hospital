<?php

namespace App\Services;

use App\Models\LabResultOption;

class LabResultOptionService
{
    public function searchLabResultOptions($query)
    {
        return LabResultOption::where('option_value', 'like', "%{$query}%")
            ->orWhere('label', 'like', "%{$query}%")
            ->with('labTest');
    }

    public function getAllLabResultOptions()
    {
        return LabResultOption::with('labTest')->ordered()->paginate(10);
    }

    public function getLabResultOptionsByTest($labTestId)
    {
        return LabResultOption::where('lab_test_id', $labTestId)->ordered()->get();
    }

    public function getLabResultOptionById($id)
    {
        return LabResultOption::with('labTest')->find($id);
    }

    public function createLabResultOption(array $data): LabResultOption
    {
        return LabResultOption::create($data);
    }

    public function updateLabResultOption(string $id, array $data): LabResultOption
    {
        $labResultOption = LabResultOption::findOrFail($id);
        $labResultOption->update($data);
        return $labResultOption;
    }

    public function deleteLabResultOption(string $id): void
    {
        LabResultOption::findOrFail($id)->delete();
    }

    public function restoreLabResultOption(string $id): void
    {
        LabResultOption::withTrashed()->findOrFail($id)->restore();
    }

    public function getTrashedLabResultOptions()
    {
        return LabResultOption::onlyTrashed()->get();
    }

    public function reorderOptions(array $optionIds): void
    {
        foreach ($optionIds as $index => $id) {
            LabResultOption::where('id', $id)->update(['sort_order' => $index]);
        }
    }
}
