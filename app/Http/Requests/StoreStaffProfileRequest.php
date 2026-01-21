<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStaffProfileRequest extends FormRequest
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
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255|unique:staff_profiles,email',
            'staff_number' => 'required|string|max:50|unique:staff_profiles,staff_number',
            'gender' => 'required|string|in:male,female,other',
            'phone_number' => 'required|string|max:20',
            'alternative_phone_number' => 'nullable|string|max:20',
            'user_id' => 'required|exists:users,id',
            'clinic_id' => 'nullable|exists:clinics,id',
            'address_id' => 'nullable|exists:addresses,id',
        ];
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'first_name.required' => 'First name is required.',
            'last_name.required' => 'Last name is required.',
            'email.unique' => 'This email is already in use.',
            'staff_number.required' => 'Staff number is required.',
            'staff_number.unique' => 'This staff number is already in use.',
            'gender.required' => 'Gender is required.',
            'gender.in' => 'Selected gender is invalid.',
            'phone_number.required' => 'Phone number is required.',
            'user_id.required' => 'User is required.',
            'user_id.exists' => 'Selected user does not exist.',
            'clinic_id.exists' => 'Selected clinic does not exist.',
            'address_id.exists' => 'Selected address does not exist.',
        ];
    }
}
