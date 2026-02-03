<?php

namespace App\Services;

use App\Models\Store;

class StoreService
{
    public function getAllStores()
    {
        return Store::paginate(10);
    }

    public function searchStores(string $term)
    {
        return Store::where('name', 'like', "%{$term}%")
            ->orWhere('code', 'like', "%{$term}%")
            ->paginate(10);
    }

    public function getStoreById(string $id): Store
    {
        return Store::findOrFail($id);
    }

    public function createStore(array $data): Store
    {
        if (!empty($data['is_main'])) {
            Store::where('is_main', true)->update(['is_main' => false]);
        }

        return Store::create($data);
    }

    public function updateStore(string $id, array $data): Store
    {
        $store = $this->getStoreById($id);

        if (!empty($data['is_main']) && ! $store->is_main) {
            Store::where('is_main', true)->update(['is_main' => false]);
        }

        $store->update($data);

        return $store;
    }

    public function deleteStore(string $id): void
    {
        $this->getStoreById($id)->delete();
    }

    public function restoreStore(string $id): void
    {
        Store::withTrashed()->findOrFail($id)->restore();
    }
}
