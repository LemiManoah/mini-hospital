<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LabSampleTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'name' => 'required|string|max:100|unique:lab_sample_types,name',
            'code' => 'required|string|max:20|unique:lab_sample_types,code',
            'description' => 'nullable|string|max:1000',
            'default_container' => 'nullable|string|max:100',
            'default_volume' => 'nullable|string|max:50',
            'is_active' => 'sometimes|boolean',
        ];

        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules['name'] = 'required|string|max:100|unique:lab_sample_types,name,' . $this->route('lab_sample_type');
            $rules['code'] = 'required|string|max:20|unique:lab_sample_types,code,' . $this->route('lab_sample_type');
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The sample type name is required.',
            'name.unique' => 'The sample type name has already been taken.',
            'name.max' => 'The sample type name may not be greater than 100 characters.',
            'code.required' => 'The sample type code is required.',
            'code.unique' => 'The sample type code has already been taken.',
            'code.max' => 'The sample type code may not be greater than 20 characters.',
            'description.max' => 'The description may not be greater than 1000 characters.',
            'default_container.max' => 'The default container may not be greater than 100 characters.',
            'default_volume.max' => 'The default volume may not be greater than 50 characters.',
        ];
    }
}
