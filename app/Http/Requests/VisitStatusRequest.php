<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VisitStatusRequest extends FormRequest
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
            'code' => 'required|string|max:10|unique:visit_statuses,code',
            'name' => 'required|string|max:255',
            'sequence' => 'required|integer|min:0',
            'is_terminal' => 'sometimes|boolean',
        ];

        // For update, exclude current record from unique validation
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules['code'] = 'required|string|max:10|unique:visit_statuses,code,' . $this->route('visit_status');
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'code.required' => 'The code field is required.',
            'code.unique' => 'The code has already been taken.',
            'name.required' => 'The name field is required.',
            'sequence.required' => 'The sequence field is required.',
            'sequence.min' => 'The sequence must be at least 0.',
        ];
    }
}
