<?php

namespace App\Http\Requests;

use App\Enums\AppointmentStatus;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;


class UpdateAppointmentRequest extends FormRequest
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
            'patient_id' => ['sometimes', 'required', 'exists:patients,id'],
            'doctor_id' => [
                'sometimes',
                'required',
                'exists:users,id',
                function ($attribute, $value, $fail) {
                    if (!User::role('doctor')->whereKey($value)->exists()) {
                        $fail('Selected doctor is invalid.');
                    }
                },
            ],
            'appointment_date' => ['required', 'date'],
            'appointment_time' => ['required', 'date_format:H:i'],
            'status' => ['required', new Enum(AppointmentStatus::class)],
            'appointment_method_id' => ['nullable', Rule::exists('appointment_methods', 'id')->where('is_active', true)],
            'appointment_category_id' => ['nullable', Rule::exists('appointment_categories', 'id')->where('is_active', true)],
            'duration_minutes' => ['required', 'integer', 'min:5', 'max:480'],
            'clinic_id' => ['nullable', 'exists:clinics,id'],
            'service_id' => ['nullable', 'exists:services,id'],
            'priority_flag' => ['required', 'in:low,medium,high,urgent'],
            'cancellation_reason' => ['nullable', 'string', 'max:255'],
            'rescheduled_from_id' => ['nullable', 'exists:appointments,id'],
            'confirmed_at' => ['nullable', 'date'],
            'checked_in_at' => ['nullable', 'date'],
            'completed_at' => ['nullable', 'date'],
            'virtual_link' => ['nullable', 'url'],
            'platform' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'appointment_time.date_format' => 'Appointment time must be in HH:MM format.',
        ];
    }
}
