<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRequest;
use App\Services\StoreService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoreController extends Controller
{
    public function __construct(
        protected StoreService $service
    ) {
    }

    public function index(Request $request)
    {
        $search = $request->get('search');

        if (!empty($search)) {
            $stores = $this->service->searchStores($search);
        } else {
            $stores = $this->service->getAllStores();
        }

        return Inertia::render('Stores/Index', [
            'stores' => $stores,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Stores/Create');
    }

    public function store(StoreRequest $request)
    {
        $this->service->createStore($request->validated());

        return redirect()
            ->route('stores.index')
            ->with('success', 'Store created successfully');
    }

    public function edit(string $id)
    {
        return Inertia::render('Stores/Edit', [
            'store' => $this->service->getStoreById($id),
        ]);
    }

    public function update(StoreRequest $request, string $id)
    {
        $this->service->updateStore($id, $request->validated());

        return redirect()
            ->route('stores.index')
            ->with('success', 'Store updated successfully');
    }

    public function destroy(string $id)
    {
        $this->service->deleteStore($id);

        return back()->with('success', 'Store deleted successfully');
    }

    public function restore(string $id)
    {
        $this->service->restoreStore($id);

        return back()->with('success', 'Store restored successfully');
    }
}
