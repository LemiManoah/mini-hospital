<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;
use App\Enums\EnumsGender;
use App\Enums\EnumsMaritalStatus;
use App\Enums\EnumsKinRelationship;

class StorePatientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'patient_number' => [
                'nullable',
                'string',
                'max:50',
                'unique:patients,patient_number',
            ],

            'first_name' => ['required', 'string', 'max:100'],
            'last_name'  => ['required', 'string', 'max:100'],

            'date_of_birth' => [
                'nullable',
                'date',
                'before_or_equal:today',
                'required_without_all:age'
            ],
            'age' => [
                'nullable',
                'integer',
                'min:0',
                'max:150',
                'required_without:date_of_birth'
            ],



            'gender' => ['required', new Enum(EnumsGender::class)],
            'marital_status' => ['required', new Enum(EnumsMaritalStatus::class)],

            'preferred_language' => ['nullable', 'string', 'max:50'],
            'religion' => ['nullable', 'string', 'max:50'],

            'country_id' => ['nullable', 'exists:countries,id'],
            'address_id' => ['nullable', 'exists:addresses,id'],
            'patient_category_id' => ['nullable', 'exists:patient_categories,id'],

            'registration_date' => ['required', 'date'],

            'phone_number' => ['required', 'string', 'max:20'],
            'alternative_phone_number' => ['nullable', 'string', 'max:20'],

            'next_of_kin_name' => ['nullable', 'string', 'max:100'],
            'next_of_kin_number' => ['nullable', 'string', 'max:20'],
            'next_of_kin_relationship' => [
                'nullable',
                new Enum(EnumsKinRelationship::class),
            ],

        ];
    }

    public function messages(): array
    {
        return [

            'date_of_birth.date' => 'The date of birth must be a valid date.',
            'date_of_birth.before_or_equal' => 'The date of birth must be a date before or equal to today.',
            'date_of_birth.required_without_all' => 'The date of birth is required when age is not provided.',
            'age.required_without' => 'The age is required when date of birth is not provided.',

        ];
    }

    // protected function phoneRegixValidation($phone): void
    // {
    //     $phoneRegix = '/^\+?[1-9]\d{1,14}$/';
    //     if (!preg_match($phoneRegix, $phone)) {
    //         throw new \InvalidArgumentException('Invalid phone number');
    //     }
    // }
}
