<?php

namespace App\Services;

use App\Models\InventoryItemCategory;

class InventoryItemCategoryService
{
    public function getAllCategories()
    {
        return InventoryItemCategory::paginate(10);
    }

    public function getCategoryById(string $id): InventoryItemCategory
    {
        return InventoryItemCategory::findOrFail($id);
    }

    public function createCategory(array $data): InventoryItemCategory
    {
        return InventoryItemCategory::create($data);
    }

    public function updateCategory(string $id, array $data): InventoryItemCategory
    {
        $category = $this->getCategoryById($id);
        $category->update($data);

        return $category;
    }

    public function deleteCategory(string $id): void
    {
        $this->getCategoryById($id)->delete();
    }

    public function restoreCategory(string $id): void
    {
        InventoryItemCategory::withTrashed()->findOrFail($id)->restore();
    }

    public function searchCategories(string $term)
    {
        return InventoryItemCategory::where('name', 'like', "%{$term}%")
            ->orWhere('is_active', $term === 'active')
            ->paginate(10);
    }
}
