<?php

namespace App\Services;

use App\Models\InventoryItem;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class InventoryItemService
{
    public function getAllItems(int $perPage = 15): LengthAwarePaginator
    {
        return InventoryItem::with(['category'])
            ->latest()
            ->paginate($perPage);
    }

    public function searchItems(string $term, int $perPage = 15): LengthAwarePaginator
    {
        return InventoryItem::where(function ($query) use ($term) {
            $query->where('name', 'like', "%{$term}%")
                ->orWhere('generic_name', 'like', "%{$term}%")
                ->orWhere('code', 'like', "%{$term}%");
        })
            ->with(['category'])
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function getItemById(string $id): InventoryItem
    {
        return InventoryItem::with(['category'])->findOrFail($id);
    }


    public function createItem(array $data): InventoryItem
    {
        if (empty($data['code'])) {
            $data['code'] = $this->generateItemCode();
        }

        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();

        return InventoryItem::create($data);
    }

    public function updateItem(string $id, array $data): InventoryItem
    {
        $item = $this->getItemById($id);
        $data['updated_by'] = Auth::id();
        $item->update($data);

        return $item->fresh(['category']);
    }

    public function deleteItem(string $id): void
    {
        $this->getItemById($id)->delete();
    }

    public function restoreItem(string $id): void
    {
        InventoryItem::withTrashed()->findOrFail($id)->restore();
    }

    public function generateItemCode(): string
    {
        return 'INV-' . strtoupper(Str::random(6));
    }
}
