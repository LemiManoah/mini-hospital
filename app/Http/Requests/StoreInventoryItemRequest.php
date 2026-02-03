<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInventoryItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'generic_name' => 'nullable|string|max:255',
            'code' => 'nullable|string|max:50|unique:inventory_items,code',
            'item_type' => 'required|in:drug,consumable,general_supply',
            'item_category_id' => 'required|exists:inventory_item_categories,id',
            'unit_of_measure' => 'required|string|max:100',
            'is_controlled' => 'boolean',
            'is_expirable' => 'boolean',
            'default_expiry_date' => 'nullable|date',
            'min_stock' => 'nullable|integer|min:0',
            'reorder_level' => 'nullable|integer|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'selling_price' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
            'notes' => 'nullable|string|max:2000',
        ];
    }
}
