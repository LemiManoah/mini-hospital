<?php

namespace App\Services;

use App\Models\AppointmentCategory;
use Illuminate\Database\Eloquent\Collection;

class AppointmentCategoryService
{
    public function getAllCategories(): Collection
    {
        return AppointmentCategory::orderBy('name')->get();
    }

    public function createCategory(array $data): AppointmentCategory
    {
        return AppointmentCategory::create($data);
    }

    public function updateCategory(AppointmentCategory $category, array $data): AppointmentCategory
    {
        $category->update($data);
        return $category;
    }

    public function deleteCategory(AppointmentCategory $category): void
    {
        $category->delete();
    }
}
