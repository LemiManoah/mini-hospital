<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $storeId = $this->route('store')?->id ?? $this->route('store');

        return [
            'name' => 'required|string|max:255|unique:stores,name,' . $storeId,
            'code' => 'required|string|max:50|unique:stores,code,' . $storeId,
            'is_main' => 'boolean',
            'allow_direct_receipt' => 'boolean',
            'is_active' => 'boolean',
            'notes' => 'nullable|string|max:2000',
        ];
    }
}
