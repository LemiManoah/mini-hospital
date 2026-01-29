<?php

namespace App\Services;

use App\Models\LabServiceCategory;

class LabServiceCategoryService
{
    public function searchLabServiceCategories($query)
    {
        return LabServiceCategory::where('name', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->paginate(10);
    }

    public function getAllLabServiceCategories()
    {
        return LabServiceCategory::paginate(10);
    }

    public function getActiveLabServiceCategories()
    {
        return LabServiceCategory::active()->paginate(10);
    }

    public function getLabServiceCategoryById($id)
    {
        return LabServiceCategory::find($id);
    }

    public function createLabServiceCategory(array $data): LabServiceCategory
    {
        return LabServiceCategory::create($data);
    }

    public function updateLabServiceCategory(string $id, array $data): LabServiceCategory
    {
        $labServiceCategory = LabServiceCategory::findOrFail($id);
        $labServiceCategory->update($data);
        return $labServiceCategory;
    }

    public function deleteLabServiceCategory(string $id): void
    {
        LabServiceCategory::findOrFail($id)->delete();
    }

    public function restoreLabServiceCategory(string $id): void
    {
        LabServiceCategory::withTrashed()->findOrFail($id)->restore();
    }

    public function getTrashedLabServiceCategories()
    {
        return LabServiceCategory::onlyTrashed()->get();
    }

    public function toggleActiveStatus(string $id): LabServiceCategory
    {
        $labServiceCategory = LabServiceCategory::findOrFail($id);
        $labServiceCategory->is_active = !$labServiceCategory->is_active;
        $labServiceCategory->save();
        return $labServiceCategory;
    }
}
