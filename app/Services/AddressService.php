<?php

namespace App\Services;
use App\Models\Address;

class AddressService
{
    public function getAllAddresses()
    {
        return Address::paginate(10);
    }

    public function getAddressById($id)
    {
        return Address::find($id);
    }

    public function createAddress(array $data)
    {
        return Address::create($data);
    }

    public function updateAddress($id, array $data)
    {
        $address = Address::find($id);
        if ($address) {
            $address->update($data);
            return $address;
        }
        return null;
    }

    public function deleteAddress($id)
    {
        $address = Address::find($id);
        if ($address) {
            $address->delete();
            return true;
        }
        return false;
    }

    
}