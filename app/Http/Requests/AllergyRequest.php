<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AllergyRequest extends FormRequest
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
            'name' => 'required|string|max:255|unique:allergies,name,' . $this->route('allergy'),
            'description' => 'nullable|string|max:1000',
            'severity' => 'required|in:mild,moderate,severe',
            'reaction_type' => 'nullable|string|max:255',
            'is_active' => 'sometimes|boolean',
        ];
    }
}
