<?php

namespace App\Services;
use App\Models\Address;

class AddressService
{
    public function searchAddresses($query)
    {
        return Address::where('district', 'like', "%$query%")
            ->orWhere('county', 'like', "%$query%");
    }
    public function getAllAddresses()
    {
        return Address::paginate(10);
    }

    public function getAddressById($id)
    {
        return Address::find($id);
    }

    public function createAddress(array $data): Address
    {
        return Address::create($data);
    }

    public function updateAddress(string $id, array $data): Address
    {
        $address = Address::findOrFail($id);
        $address->update($data);
        return $address;
    }

    public function deleteAddress(string $id): void
    {
        Address::findOrFail($id)->delete();
    }

    public function restoreAddress(string $id): void
    {
        Address::withTrashed()->findOrFail($id)->restore();
    }

    public function getTrashedAddresses()
    {
        return Address::onlyTrashed()->get();
    }
}