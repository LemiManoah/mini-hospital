<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Services\AddressService;
use App\Http\Requests\AddressRequest;

class AddressController extends Controller
{
    protected AddressService $addressService;

    public function __construct(AddressService $addressService)
    {
        $this->addressService = $addressService;
    }

    public function index()
    {
        $addresses = $this->addressService->getAllAddresses();
        // dd($addresses);
        return Inertia::render('Address/Index', [
            'addresses' => $addresses,
        ]);
    }

    public function show($id)
    {
        $address = $this->addressService->getAddressById($id);
        if ($address) {
            return Inertia::render('Addresses/Show', [
                'address' => $address,
            ]);
        }
        return response()->json(['message' => 'Address not found'], 404);
    }

    public function store(AddressRequest $request)
    {
        $data = $request->all();
        $address = $this->addressService->createAddress($data);
        return response()->json($address, 201);
    }

    public function update(Request $request, $id)
    {
        $data = $request->all();
        $address = $this->addressService->updateAddress($id, $data);
        if ($address) {
            return response()->json($address);
        }
        return response()->json(['message' => 'Address not found'], 404);
    }

    public function destroy($id)
    {
        $deleted = $this->addressService->deleteAddress($id);
        if ($deleted) {
            return response()->json(['message' => 'Address deleted successfully']);
        }
        return response()->json(['message' => 'Address not found'], 404);
    }
}
