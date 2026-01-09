<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Services\AddressService;
use App\Http\Requests\AddressRequest;
use Illuminate\Http\RedirectResponse;

class AddressController extends Controller
{
    public function __construct(
        protected AddressService $addressService
    ) {}

    public function index()
    {
        $addresses = $this->addressService->getAllAddresses();

        return Inertia::render('Address/Index', [
            'addresses' => $addresses,
        ]);
    }

    public function create()
    {
        return Inertia::render('Address/Create');
    }

    public function store(AddressRequest $request): RedirectResponse
    {
        $this->addressService->createAddress($request->validated());

        return redirect()
            ->route('addresses.index')
            ->with('success', 'Address created successfully');
    }

    public function edit(string $id)
    {
        $address = $this->addressService->getAddressById($id);

        return Inertia::render('Address/Edit', [
            'address' => $address,
        ]);
    }

    public function update(AddressRequest $request, string $id): RedirectResponse
    {
        $this->addressService->updateAddress($id, $request->validated());

        return back()->with('success', 'Address updated successfully');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->addressService->deleteAddress($id);

        return back()->with('success', 'Address deleted successfully');
    }

    public function restore(string $id): RedirectResponse
    {
        $this->addressService->restoreAddress($id);

        return back()->with('success', 'Address restored successfully');
    }
}
