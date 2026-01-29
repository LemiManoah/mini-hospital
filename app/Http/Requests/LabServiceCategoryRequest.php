<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LabServiceCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'name' => 'required|string|max:150|unique:lab_service_categories,name',
            'description' => 'nullable|string|max:1000',
            'is_active' => 'sometimes|boolean',
        ];

        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules['name'] = 'required|string|max:150|unique:lab_service_categories,name,' . $this->route('lab_service_category');
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The category name is required.',
            'name.unique' => 'The category name has already been taken.',
            'name.max' => 'The category name may not be greater than 150 characters.',
            'description.max' => 'The description may not be greater than 1000 characters.',
        ];
    }
}
