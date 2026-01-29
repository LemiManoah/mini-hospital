<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LabServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'lab_service_category_id' => 'required|exists:lab_service_categories,id',
            'name' => 'required|string|max:200',
            'code' => 'required|string|max:50|unique:lab_services,code',
            'description' => 'nullable|string|max:2000',
            'price' => 'required|numeric|min:0',
            'sample_type_code' => 'nullable|exists:lab_sample_types,code',
            'result_fields' => 'nullable|array',
            'reference_range' => 'nullable|string|max:1000',
            'clinical_notes' => 'nullable|string|max:2000',
            'is_active' => 'sometimes|boolean',
        ];

        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules['code'] = 'required|string|max:50|unique:lab_services,code,' . $this->route('lab_service');
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'lab_service_category_id.required' => 'The service category is required.',
            'lab_service_category_id.exists' => 'The selected service category does not exist.',
            'name.required' => 'The service name is required.',
            'name.max' => 'The service name may not be greater than 200 characters.',
            'code.required' => 'The service code is required.',
            'code.unique' => 'The service code has already been taken.',
            'code.max' => 'The service code may not be greater than 50 characters.',
            'description.max' => 'The description may not be greater than 2000 characters.',
            'price.required' => 'The price is required.',
            'price.numeric' => 'The price must be a number.',
            'price.min' => 'The price must be at least 0.',
            'sample_type_code.exists' => 'The selected sample type does not exist.',
            'reference_range.max' => 'The reference range may not be greater than 1000 characters.',
            'clinical_notes.max' => 'The clinical notes may not be greater than 2000 characters.',
        ];
    }
}
