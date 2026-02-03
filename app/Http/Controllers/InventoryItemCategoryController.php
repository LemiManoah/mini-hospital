<?php

namespace App\Http\Controllers;

use App\Http\Requests\InventoryItemCategoryRequest;
use App\Services\InventoryItemCategoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryItemCategoryController extends Controller
{
    public function __construct(
        protected InventoryItemCategoryService $service
    ) {
    }

    public function index(Request $request)
    {
        $search = $request->get('search');

        if (!empty($search)) {
            $categories = $this->service->searchCategories($search);
        } else {
            $categories = $this->service->getAllCategories();
        }

        return Inertia::render('InventoryItemCategories/Index', [
            'inventoryItemCategories' => $categories,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('InventoryItemCategories/Create');
    }

    public function store(InventoryItemCategoryRequest $request)
    {
        $this->service->createCategory($request->validated());

        return redirect()
            ->route('inventory-item-categories.index')
            ->with('success', 'Inventory item category created successfully');
    }

    public function edit(string $id)
    {
        return Inertia::render('InventoryItemCategories/Edit', [
            'inventoryItemCategory' => $this->service->getCategoryById($id),
        ]);
    }

    public function update(InventoryItemCategoryRequest $request, string $id)
    {
        $this->service->updateCategory($id, $request->validated());

        return redirect()->route('inventory-item-categories.index')
            ->with('success', 'Inventory item category updated successfully');
    }

    public function destroy(string $id)
    {
        $this->service->deleteCategory($id);

        return back()->with('success', 'Inventory item category deleted successfully');
    }

    public function restore(string $id)
    {
        $this->service->restoreCategory($id);

        return back()->with('success', 'Inventory item category restored successfully');
    }
}
