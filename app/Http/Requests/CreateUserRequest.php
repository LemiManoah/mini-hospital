<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateUserRequest extends FormRequest
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
        $userId = $this->route('user')?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$userId],
            'password' => ['nullable', 'string', 'confirmed'],
            'password_confirmation' => ['required_with:password', 'string'],
            'roles' => ['nullable', 'array'],
            'roles.*' => ['nullable', 'integer', 'exists:roles,id'],
            'gender' => ['nullable', 'string', 'in:male,female,other'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'alternative_phone_number' => ['nullable', 'string', 'max:20'],
            'clinic_id' => ['nullable', 'integer', 'exists:clinics,id'],
            'address_id' => ['nullable', 'integer', 'exists:addresses,id'],
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
            'name.required' => 'Name is required.',
            'name.max' => 'Name may not be greater than 255 characters.',
            'email.required' => 'Email address is required.',
            'email.email' => 'Please provide a valid email address.',
            'email.unique' => 'This email address is already in use.',
            'password.confirmed' => 'Password confirmation does not match.',
            'role.exists' => 'Selected role does not exist.',
            'gender.in' => 'Gender must be male, female, or other.',
            'phone_number.max' => 'Phone number may not be greater than 20 characters.',
            'alternative_phone_number.max' => 'Alternative phone number may not be greater than 20 characters.',
            'clinic_id.exists' => 'Selected clinic does not exist.',
            'address_id.exists' => 'Selected address does not exist.',
        ];
    }
}
