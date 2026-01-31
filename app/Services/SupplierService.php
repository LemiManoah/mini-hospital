<?php

namespace App\Services;
use App\Models\Supplier;

class SupplierService
{
    public function searchSuppliers($query)
    {
        return Supplier::search($query);
    }

    public function getAllSuppliers()
    {
        return Supplier::paginate(10);
    }

    public function getActiveSuppliers()
    {
        return Supplier::active()->paginate(10);
    }

    public function getSupplierById($id)
    {
        return Supplier::find($id);
    }

    public function createSupplier(array $data): Supplier
    {
        return Supplier::create($data);
    }

    public function updateSupplier(string $id, array $data): Supplier
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->update($data);
        return $supplier;
    }

    public function deleteSupplier(string $id): void
    {
        Supplier::findOrFail($id)->delete();
    }

    public function restoreSupplier(string $id): void
    {
        Supplier::withTrashed()->findOrFail($id)->restore();
    }

    public function getTrashedSuppliers()
    {
        return Supplier::onlyTrashed()->get();
    }
}
