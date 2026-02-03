<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StoreStockReportController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');

        $stores = Store::select('id', 'name')->orderBy('name')->get();

        $items = InventoryItem::with('category')
            ->when(!empty($search), function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('generic_name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->get();

        $stockRows = DB::table('store_stocks')
            ->select('store_id', 'inventory_item_id', 'on_hand')
            ->get();

        $stockMap = [];
        foreach ($stockRows as $row) {
            $stockMap[$row->inventory_item_id][$row->store_id] = $row->on_hand;
        }

        $reportRows = $items->map(function ($item) use ($stores, $stockMap) {
            $storeQty = [];
            foreach ($stores as $store) {
                $storeQty[$store->id] = $stockMap[$item->id][$store->id] ?? 0;
            }

            return [
                'id' => $item->id,
                'name' => $item->name,
                'item_type' => $item->item_type,
                'unit_of_measure' => $item->unit_of_measure,
                'is_expirable' => $item->is_expirable,
                'category' => $item->category?->name,
                'stores' => $storeQty,
            ];
        });

        return Inertia::render('StoreStocks/Report', [
            'stores' => $stores,
            'items' => $reportRows,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
}
