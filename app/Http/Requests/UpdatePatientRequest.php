<?php

namespace App\Http\Requests;

use App\Enums\EnumsGender;
use App\Enums\EnumsReligions;
use Illuminate\Validation\Rule;
use App\Enums\EnumsMaritalStatus;
use App\Enums\EnumsKinRelationship;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePatientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $patientId = $this->route('patient');

        return [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name'  => ['required', 'string', 'max:100'],

            'date_of_birth' => ['required', 'date', 'before:today'],

            'gender' => ['required', new Enum(EnumsGender::class)],
            'marital_status' => ['required', new Enum(EnumsMaritalStatus::class)],

            'preferred_language' => ['nullable', 'string', 'max:50'],
            'religion' => ['nullable', new Enum(EnumsReligions::class)],

            'country_id' => ['nullable', 'exists:countries,id'],
            'address_id' => ['nullable', 'exists:addresses,id'],
            'patient_category_id' => ['nullable', 'exists:patient_categories,id'],

            'registration_date' => ['required', 'date'],

            'phone_number' => ['required', 'string', 'max:20'],
            'alternative_phone_number' => ['nullable', 'string', 'max:20'],

            'phone_owner' => ['required', 'boolean'],

            'next_of_kin_name' => ['nullable', 'string', 'max:100'],
            'next_of_kin_number' => ['nullable', 'string', 'max:20'],
            'next_of_kin_relationship' => [
                'nullable',
                new Enum(EnumsKinRelationship::class),
            ],

            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'phone_owner' => filter_var($this->phone_owner, FILTER_VALIDATE_BOOLEAN),
            'is_active' => filter_var($this->is_active, FILTER_VALIDATE_BOOLEAN),
        ]);
    }
}
