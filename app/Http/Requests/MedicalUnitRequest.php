<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MedicalUnitRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:medical_units,code,' . $this->route('medical_unit'),
            'category' => 'required|string|max:100|in:solid,liquid,topical,inhalation,other',
            'description' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The unit name is required.',
            'code.required' => 'The unit code is required.',
            'code.unique' => 'The unit code must be unique.',
            'category.required' => 'The category is required.',
            'category.in' => 'The category must be one of: solid, liquid, topical, inhalation, other.',
        ];
    }
}
