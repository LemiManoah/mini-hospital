<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LabReferenceRangeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'lab_result_parameter_id' => 'required|exists:lab_result_parameters,id',
            'age_range_from' => 'nullable|string|max:10',
            'age_range_to' => 'nullable|string|max:10',
            'sex' => 'required|in:male,female,both',
            'phase' => 'nullable|string|max:100',
            'weeks_from' => 'nullable|string|max:10',
            'weeks_to' => 'nullable|string|max:10',
            'min_value' => 'nullable|numeric',
            'max_value' => 'nullable|numeric',
            'reference_text' => 'nullable|string|max:255',
            'is_active' => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'lab_result_parameter_id.required' => 'The lab result parameter is required.',
            'lab_result_parameter_id.exists' => 'The selected lab result parameter does not exist.',
            'sex.required' => 'The sex field is required.',
            'sex.in' => 'The sex must be one of: male, female, both.',
        ];
    }
}
