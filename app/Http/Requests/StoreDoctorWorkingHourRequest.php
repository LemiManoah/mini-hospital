<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDoctorWorkingHourRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'doctor_id' => ['required', 'exists:users,id'],
            'day_of_week' => [
                'required',
                'integer',
                'between:0,6',
                Rule::unique('doctor_working_hours')->where(function ($query) {
                    return $query
                        ->where('doctor_id', $this->doctor_id)
                        ->where('day_of_week', $this->day_of_week);
                }),
            ],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
        ];
    }

    public function messages(): array
    {
        return [
            'day_of_week.unique' => 'This doctor already has working hours for the selected day.',
            'end_time.after' => 'End time must be after start time.',
        ];
    }
}
