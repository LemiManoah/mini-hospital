<?php

namespace App\Services;

use App\Models\DoctorWorkingHour;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class DoctorWorkingHourService
{
    public function getAllWorkingHours(?string $doctorId = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = DoctorWorkingHour::with('doctor')
            ->orderBy('doctor_id')
            ->orderBy('day_of_week');

        if (!empty($doctorId)) {
            $query->where('doctor_id', $doctorId);
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function getDoctorsWithWorkingHours(?string $doctorId = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = User::role('doctor')
            ->with(['workingHours' => function ($hours) {
                $hours->orderBy('day_of_week');
            }])
            ->orderBy('name');

        if (!empty($doctorId)) {
            $query->where('id', $doctorId);
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function getWorkingHourById(string $id): DoctorWorkingHour
    {
        return DoctorWorkingHour::with('doctor')->findOrFail($id);
    }

    public function createWorkingHour(array $data): DoctorWorkingHour
    {
        return DoctorWorkingHour::create($data);
    }

    public function updateWorkingHour(string $id, array $data): DoctorWorkingHour
    {
        $workingHour = DoctorWorkingHour::findOrFail($id);
        $workingHour->update($data);

        return $workingHour->fresh(['doctor']);
    }

    public function deleteWorkingHour(string $id): void
    {
        DoctorWorkingHour::findOrFail($id)->delete();
    }
}
