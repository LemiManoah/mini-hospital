<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Validation\Rule;
use App\Enums\AppointmentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;


class StoreAppointmentRequest extends FormRequest
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
            'patient_id' => ['required', 'exists:patients,id'],
            'doctor_id' => [
                'required',
                'exists:users,id',
                function ($attribute, $value, $fail) {
                    if (!User::role('doctor')->whereKey($value)->exists()) {
                        $fail('Selected doctor is invalid.');
                    }
                },
            ],
            'appointment_date' => ['required', 'date', 'after_or_equal:today'],
            'appointment_time' => ['required', 'date_format:H:i'],
            'status' => ['nullable', new Enum(AppointmentStatus::class)],
            'appointment_method_id' => ['nullable', Rule::exists('appointment_methods', 'id')->where('is_active', true)],
            'appointment_category_id' => ['nullable', Rule::exists('appointment_categories', 'id')->where('is_active', true)],
            'duration_minutes' => ['required', 'integer', 'min:5', 'max:480'],
            'clinic_id' => ['nullable', 'exists:clinics,id'],
            'service_id' => ['nullable', 'exists:services,id'],
            'priority_flag' => ['required', 'in:low,medium,high,urgent'],
            'virtual_link' => ['nullable', 'url'],
            'platform' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'patient_id.required' => 'Patient is required.',
            'patient_id.exists' => 'Selected patient does not exist.',
            'doctor_id.required' => 'Doctor is required.',
            'doctor_id.exists' => 'Selected doctor does not exist.',
            'appointment_date.required' => 'Appointment date is required.',
            'appointment_date.date' => 'Appointment date must be a valid date.',
            'appointment_date.after_or_equal' => 'Appointment date cannot be in the past.',
            'appointment_time.required' => 'Appointment time is required.',
            'appointment_time.date_format' => 'Appointment time must be in HH:MM format.',
            'duration_minutes.required' => 'Duration is required.',
            'duration_minutes.min' => 'Duration must be at least 5 minutes.',
            'duration_minutes.max' => 'Duration must not exceed 480 minutes.',
        ];
    }
}
