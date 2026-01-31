<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Services\SupplierService;
use App\Http\Requests\SupplierRequest;
use Illuminate\Http\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;

class SupplierController extends Controller
{
    public function __construct(
        protected SupplierService $supplierService
    ) {}

    public function index(Request $request)
    {
        $search = $request->get('search');

        if (!empty($search)) {
            $suppliers = $this->supplierService->searchSuppliers($search);
        } else {
            $suppliers = $this->supplierService->getActiveSuppliers();
        }

        return Inertia::render('Suppliers/Index', [
            'suppliers' => $suppliers,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Suppliers/Create');
    }

    public function store(SupplierRequest $request): RedirectResponse
    {
        $this->supplierService->createSupplier($request->all());

        return redirect()
            ->route('suppliers.index')
            ->with('success', 'Supplier created successfully');
    }

    public function edit(string $id)
    {
        $supplier = $this->supplierService->getSupplierById($id);

        return Inertia::render('Suppliers/Edit', [
            'supplier' => $supplier,
        ]);
    }

    public function update(SupplierRequest $request, string $id): RedirectResponse
    {
        $this->supplierService->updateSupplier($id, $request->validated());

        return back()->with('success', 'Supplier updated successfully');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->supplierService->deleteSupplier($id);

        return back()->with('success', 'Supplier deleted successfully');
    }

    public function restore(string $id): RedirectResponse
    {
        $this->supplierService->restoreSupplier($id);

        return back()->with('success', 'Supplier restored successfully');
    }
}
