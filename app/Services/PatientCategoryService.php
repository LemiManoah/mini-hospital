<?php

namespace App\Services;
use App\Models\PatientCategory;
use Illuminate\Database\Eloquent\Collection;

class PatientCategoryService
{
    public function getAllPatientCategories()
    {
        return PatientCategory::paginate(10);
    }

    public function getPatientCategoryById(string $id): PatientCategory
    {
        return PatientCategory::findOrFail($id);
    }

    public function createPatientCategory(array $data): PatientCategory
    {
        return PatientCategory::create($data);
    }

    public function updatePatientCategory(string $id, array $data): PatientCategory
    {
        $category = $this->getPatientCategoryById($id);
        $category->update($data);

        return $category;
    }

    public function deletePatientCategory(string $id): void
    {
        $this->getPatientCategoryById($id)->delete();
    }

    public function restorePatientCategory(string $id): void
    {
        $this->getPatientCategoryById($id)->restore();
    }

    public function searchPatientCategory(string $term)
    {
        return PatientCategory::where('name', 'like', "%{$term}%")
            ->orWhere('is_insurance', $term === 'insurance')
            ->orWhere('is_active', $term === 'active')
            ->paginate(10);
    }
}

