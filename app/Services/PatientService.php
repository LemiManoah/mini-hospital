<?php

namespace App\Services;

use App\Models\Patient;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class PatientService
{
    public function getAllPatients(int $perPage = 15): LengthAwarePaginator
    {
        return Patient::with(['patientCategory', 'address'])
            ->latest()
            ->paginate($perPage);
    }

    public function getPatientById(string $id): Patient
    {
        return Patient::with(['patientCategory', 'address'])
            ->findOrFail($id);
    }

    public function createPatient(array $data): Patient
    {
        return Patient::create($data);
    }

    public function updatePatient(string $id, array $data): Patient
    {
        $patient = $this->getPatientById($id);
        $patient->update($data);
        
        return $patient->fresh(['patientCategory', 'address']);
    }

    public function deletePatient(string $id): void
    {
        $this->getPatientById($id)->delete();
    }

    public function restorePatient(string $id): void
    {
        Patient::withTrashed()->findOrFail($id)->restore();
    }

    public function searchPatients(string $term): LengthAwarePaginator
    {
        return Patient::where(function($query) use ($term) {
                $query->where('patient_number', 'like', "%{$term}%")
                    ->orWhere('first_name', 'like', "%{$term}%")
                    ->orWhere('last_name', 'like', "%{$term}%")
                    ->orWhere('phone_number', 'like', "%{$term}%")
                    ->orWhere('alternative_phone_number', 'like', "%{$term}%");
            })
            ->with(['patientCategory', 'address'])
            ->latest()
            ->paginate(15)
            ->withQueryString();
    }

    public function generatePatientNumber(): string
    {
        $lastPatient = Patient::latest('id')->first();
        $nextId = $lastPatient ? $lastPatient->id + 1 : 1;
        
        return 'PAT-' . str_pad($nextId, 6, '0', STR_PAD_LEFT);
    }
}
