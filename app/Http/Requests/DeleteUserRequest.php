<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DeleteUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only allow deletion if user is not deleting themselves
        // and has permission to delete users
        $targetUserId = $this->route('user');
        $currentUserId = auth()->id();
        
        // For now, allow all authenticated users to delete other users
        // You can add role-based permissions later
        return $currentUserId !== null && $currentUserId !== $targetUserId;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // No validation rules needed for DELETE requests
            // Authorization is handled in the authorize() method
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
            'authorize' => 'You are not authorized to delete this user.',
        ];
    }
}
