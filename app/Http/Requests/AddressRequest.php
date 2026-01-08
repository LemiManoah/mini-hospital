<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddressRequest extends FormRequest
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
            'district' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'county' => 'nullable|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'district.required' => 'The district field is required.',
            'city.required' => 'The city field is required.',
        ];
    }
}
