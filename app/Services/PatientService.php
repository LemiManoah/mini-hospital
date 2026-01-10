<?php

namespace App\Services;

use App\Models\Patient;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

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
        return DB::transaction(function () use ($data) {
            $patient = Patient::create([
                ...$data,
                'patient_number' => 'TEMP',
            ]);

            $patient->update([
                'patient_number' => 'PAT-' . str_pad($patient->id, 6, '0', STR_PAD_LEFT),
            ]);

            return $patient;
        });
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
        return Patient::where(function ($query) use ($term) {
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
}
