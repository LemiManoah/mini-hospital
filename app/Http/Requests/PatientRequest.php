<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PatientRequest extends FormRequest
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
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'date_of_birth' => 'required|date|before:today',
            'gender' => ['required', 'string', Rule::in(['male', 'female', 'other'])],
            'marital_status' => ['required', 'string', Rule::in(['single', 'married', 'divorced', 'widowed'])],
            'is_pediatric' => 'required|boolean',
            'age_years' => 'nullable|integer|min:0',
            'age_months' => 'nullable|integer|min:0|max:11',
            'preferred_language' => 'nullable|string|max:100',
            'religion' => 'nullable|string|max:100',
            'country_id' => 'nullable|exists:countries,id',
            'address_id' => 'nullable|exists:addresses,id',
            'registration_date' => 'required|date',
            'is_active' => 'required|boolean',
            'patient_category_id' => 'required|exists:patient_categories,id',
            'next_of_kin_name' => 'nullable|string|max:255',
            'next_of_kin_number' => 'nullable|string|max:20',
            'next_of_kin_relationship' => 'nullable|string|max:100',
            'phone_number' => 'required|string|max:20',
            'alternative_phone_number' => 'nullable|string|max:20',
            'phone_owner' => 'required|boolean',
        ];

        if ($this->isMethod('POST')) {
            $rules['patient_number'] = 'required|string|unique:patients,patient_number';
        } else {
            $rules['patient_number'] = [
                'required',
                'string',
                Rule::unique('patients', 'patient_number')->ignore($this->route('patient'))
            ];
        }

        return $rules;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        if ($this->isMethod('POST') && !$this->has('patient_number')) {
            $this->merge([
                'patient_number' => app(\App\Services\PatientService::class)->generatePatientNumber()
            ]);
        }
    }
}
