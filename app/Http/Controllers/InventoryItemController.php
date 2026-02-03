<?php

namespace App\Http\Controllers;

use App\Enums\EnumsInventoryItemType;
use App\Http\Requests\StoreInventoryItemRequest;
use App\Http\Requests\UpdateInventoryItemRequest;
use App\Models\InventoryItemCategory;
use App\Services\InventoryItemService;
use Inertia\Inertia;
use Illuminate\Http\Request;

class InventoryItemController extends Controller
{
    public function __construct(
        private readonly InventoryItemService $inventoryItemService
    ) {
    }

    public function index(Request $request)
    {
        $search = $request->get('search');

        if (!empty($search)) {
            $items = $this->inventoryItemService->searchItems($search);
        } else {
            $items = $this->inventoryItemService->getAllItems();
        }

        return Inertia::render('InventoryItems/Index', [
            'items' => $items,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        $categories = InventoryItemCategory::select('id', 'name')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('InventoryItems/Create', [
            'itemTypes' => EnumsInventoryItemType::options(),
            'categories' => $categories,
        ]);
    }

    public function store(StoreInventoryItemRequest $request)
    {
        $this->inventoryItemService->createItem($request->validated());

        return redirect()->route('inventory-items.index')
            ->with('success', 'Inventory item created successfully');
    }

    public function show(string $id)
    {
        $item = $this->inventoryItemService->getItemById($id);

        return Inertia::render('InventoryItems/Show', [
            'item' => $item,
        ]);
    }

    public function edit(string $id)
    {
        $item = $this->inventoryItemService->getItemById($id);
        $categories = InventoryItemCategory::select('id', 'name')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('InventoryItems/Edit', [
            'item' => $item,
            'itemTypes' => EnumsInventoryItemType::options(),
            'categories' => $categories,
        ]);
    }

    public function update(UpdateInventoryItemRequest $request, string $id)
    {
        $this->inventoryItemService->updateItem($id, $request->validated());

        return redirect()->route('inventory-items.index')
            ->with('success', 'Inventory item updated successfully');
    }

    public function destroy(string $id)
    {
        $this->inventoryItemService->deleteItem($id);

        return redirect()->route('inventory-items.index')
            ->with('success', 'Inventory item deleted successfully');
    }
}
