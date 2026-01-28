<?php

namespace App\Http\Requests;

use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;

class PatientVisitRequest extends FormRequest
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
            'visit_number' => 'sometimes|string|max:20|unique:patient_visits,visit_number',
            'patient_id' => 'required|exists:patients,id',
            'visit_type_id' => 'required|exists:visit_types,id',
            'status_id' => 'required|exists:visit_statuses,id',
            'assigned_clinic_id' => 'nullable|exists:clinics,id',
            'assigned_doctor_id' => 'nullable|exists:users,id',
            'created_by_staff_id' => 'required|exists:users,id',
            'visit_date' => 'required|date|after_or_equal:today',
            'visit_time' => 'required|date_format:H:i',
            'priority_flag' => 'required|in:low,medium,high,urgent',
        ];

        // For update, exclude current record from unique validation
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules['visit_number'] = 'sometimes|string|max:20|unique:patient_visits,visit_number,' . $this->route('patient_visit');
            $rules['visit_date'] = 'required|date'; // Allow past dates for updates
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'visit_number.unique' => 'The visit number has already been taken.',
            'patient_id.required' => 'The patient field is required.',
            'patient_id.exists' => 'The selected patient is invalid.',
            'visit_type_id.required' => 'The visit type field is required.',
            'visit_type_id.exists' => 'The selected visit type is invalid.',
            'status_id.required' => 'The status field is required.',
            'status_id.exists' => 'The selected status is invalid.',
            'assigned_clinic_id.exists' => 'The selected clinic is invalid.',
            'assigned_doctor_id.exists' => 'The selected doctor is invalid.',
            'created_by_staff_id.required' => 'The created by staff field is required.',
            'created_by_staff_id.exists' => 'The selected staff member is invalid.',
            'visit_date.required' => 'The visit date field is required.',
            'visit_date.after_or_equal' => 'The visit date must be today or a future date.',
            'visit_time.required' => 'The visit time field is required.',
            'visit_time.date_format' => 'The visit time must be in HH:MM format.',
            'priority_flag.required' => 'The priority field is required.',
            'priority_flag.in' => 'The priority must be one of: low, medium, high, urgent.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Auto-generate visit number if not provided
        if (!$this->has('visit_number') && $this->isMethod('POST')) {
            $this->merge([
                'visit_number' => \App\Models\PatientVisit::generateVisitNumber(),
            ]);
        }

        // Set created_by_staff_id to current user if not provided
        if (!$this->has('created_by_staff_id') && Auth::check()) {
            $this->merge([
                'created_by_staff_id' => Auth::id(),
            ]);
        }
    }
}
