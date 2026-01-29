<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VisitNoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'visit_id' => 'required|exists:patient_visits,id',
            'complaint' => 'nullable|string|max:2000',
            'examination' => 'nullable|string|max:2000',
            'provisional_diagnosis' => 'nullable|string|max:2000',
            'final_diagnosis' => 'nullable|string|max:2000',
            'plan' => 'nullable|string|max:2000',
        ];
    }

    public function messages()
    {
        return [
            'visit_id.required' => 'The visit is required.',
            'visit_id.exists' => 'The selected visit does not exist.',
            'complaint.max' => 'The complaint must not exceed 2000 characters.',
            'examination.max' => 'The examination must not exceed 2000 characters.',
            'provisional_diagnosis.max' => 'The provisional diagnosis must not exceed 2000 characters.',
            'final_diagnosis.max' => 'The final diagnosis must not exceed 2000 characters.',
            'plan.max' => 'The plan must not exceed 2000 characters.',
        ];
    }
}
