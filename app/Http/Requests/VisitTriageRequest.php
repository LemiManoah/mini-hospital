<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VisitTriageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'visit_id' => 'required|exists:patient_visits,id',
            'vitals_json' => 'nullable|array',
            'vitals_json.bp' => 'nullable|string|max:50',
            'vitals_json.hr' => 'nullable|string|max:50',
            'vitals_json.temp' => 'nullable|string|max:50',
            'vitals_json.spo2' => 'nullable|string|max:50',
            'vitals_json.weight' => 'nullable|string|max:50',
            'vitals_json.height' => 'nullable|string|max:50',
            'triage_notes' => 'nullable|string|max:2000',
        ];
    }
}
