<?php

namespace App\Services;

use App\Models\Appointment;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Actions\Appointments\EnsureDoctorIsAvailable;

class AppointmentService
{
    public function __construct(
        protected EnsureDoctorIsAvailable $ensureDoctorIsAvailable
    ) {}
    public function getAllAppointments(int $perPage = 15): LengthAwarePaginator
    {
        return Appointment::with(['patient', 'doctor'])
            ->latest()
            ->paginate($perPage);
    }

    public function getAppointmentById(string $id): Appointment
    {
        return Appointment::with(['patient', 'doctor'])
            ->findOrFail($id);
    }

    public function createAppointment(array $data)
    {
        $this->ensureDoctorIsAvailable->execute(
            $data['doctor_id'],
            $data['appointment_date'],
            $data['appointment_time']
        );
        return DB::transaction(function () use ($data) {
            return Appointment::create($data);
        });
    }


    public function updateAppointment(string $id, array $data): Appointment
    {
        $appointment = $this->getAppointmentById($id);
        $this->ensureDoctorIsAvailable->execute(
            $data['doctor_id'],
            $data['appointment_date'],
            $data['appointment_time'],
            $appointment->id
        );
        $appointment->update($data);

        return $appointment->fresh(['patient', 'doctor']);
    }

    public function deleteAppointment(string $id): void
    {
        $this->getAppointmentById($id)->delete();
    }

    public function restoreAppointment(string $id): void
    {
        Appointment::withTrashed()->findOrFail($id)->restore();
    }

    public function searchAppointments(string $term): LengthAwarePaginator
    {
        return Appointment::where(function ($query) use ($term) {
            $query->where('appointment_date', 'like', "%{$term}%")
                ->orWhere('status', 'like', "%{$term}%")
                ->orWhere('doctor_id', 'like', "%{$term}%")
                ->orWhere('appointment_time', 'like', "%{$term}%");
        })
            ->with(['patient', 'doctor'])
            ->latest()
            ->paginate(15)
            ->withQueryString();
    }
}
