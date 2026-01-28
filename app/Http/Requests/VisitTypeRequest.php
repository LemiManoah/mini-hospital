<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VisitTypeRequest extends FormRequest
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
        $rules = [
            'code' => 'required|string|max:10|unique:visit_types,code',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'is_active' => 'sometimes|boolean',
        ];

        // For update, exclude current record from unique validation
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules['code'] = 'required|string|max:10|unique:visit_types,code,' . $this->route('visit_type');
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'code.required' => 'The code field is required.',
            'code.unique' => 'The code has already been taken.',
            'name.required' => 'The name field is required.',
            'description.max' => 'The description may not be greater than 1000 characters.',
        ];
    }
}
