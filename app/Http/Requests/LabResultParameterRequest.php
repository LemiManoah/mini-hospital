<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LabResultParameterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'lab_service_id' => 'required|exists:lab_services,id',
            'parameter_name' => 'required|string|max:255',
            'parameter_code' => 'nullable|string|max:255',
            'unit' => 'nullable|string|max:50',
            'is_active' => 'sometimes|boolean',
            'display_order' => 'sometimes|integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'lab_service_id.required' => 'The lab service is required.',
            'lab_service_id.exists' => 'The selected lab service does not exist.',
            'parameter_name.required' => 'The parameter name is required.',
            'display_order.min' => 'The display order must be at least 0.',
        ];
    }
}
