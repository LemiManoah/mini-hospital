<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LabResultOptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'lab_test_id' => 'required|exists:services,id',
            'option_value' => 'required|string|max:200',
            'label' => 'required|string|max:200',
            'is_abnormal' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'lab_test_id.required' => 'The lab test is required.',
            'lab_test_id.exists' => 'The selected lab test does not exist.',
            'option_value.required' => 'The option value is required.',
            'option_value.max' => 'The option value may not be greater than 200 characters.',
            'label.required' => 'The label is required.',
            'label.max' => 'The label may not be greater than 200 characters.',
            'sort_order.min' => 'The sort order must be at least 0.',
        ];
    }
}
