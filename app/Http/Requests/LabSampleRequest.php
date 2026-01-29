<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LabSampleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sample_number' => 'sometimes|string|max:50|unique:lab_samples,sample_number',
            'visit_order_item_id' => 'required|exists:visit_order_items,id',
            'sample_type_id' => 'required|exists:lab_sample_types,id',
            'collected_by' => 'nullable|exists:users,id',
            'collected_at' => 'nullable|date',
            'container' => 'nullable|string|max:100',
            'volume' => 'nullable|string|max:50',
            'status' => 'sometimes|in:collected,received,rejected',
            'rejection_reason' => 'nullable|string|max:500',
            'received_by' => 'nullable|exists:users,id',
            'received_at' => 'nullable|date',
        ];
    }

    public function messages(): array
    {
        return [
            'sample_number.unique' => 'The sample number has already been taken.',
            'visit_order_item_id.required' => 'The visit order item is required.',
            'visit_order_item_id.exists' => 'The selected visit order item does not exist.',
            'sample_type_id.required' => 'The sample type is required.',
            'sample_type_id.exists' => 'The selected sample type does not exist.',
            'collected_by.exists' => 'The selected collector does not exist.',
            'container.max' => 'The container may not be greater than 100 characters.',
            'volume.max' => 'The volume may not be greater than 50 characters.',
            'status.in' => 'The status must be one of: collected, received, rejected.',
            'rejection_reason.max' => 'The rejection reason may not be greater than 500 characters.',
            'received_by.exists' => 'The selected receiver does not exist.',
        ];
    }
}
