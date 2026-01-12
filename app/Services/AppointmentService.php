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

        $doctorId = $data['doctor_id'] ?? $appointment->doctor_id;
        $appointmentDate = $data['appointment_date'] ?? $appointment->appointment_date;
        $appointmentTime = $data['appointment_time'] ?? $appointment->appointment_time;

        $this->ensureDoctorIsAvailable->execute(
            $doctorId,
            $appointmentDate,
            $appointmentTime,
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

    public function searchAppointments(array $filters): LengthAwarePaginator
    {
        $query = Appointment::with(['patient', 'doctor'])->latest();

        if (!empty($filters['search'] ?? null)) {
            $term = $filters['search'];

            $query->where(function ($q) use ($term) {
                $q->where('appointment_date', 'like', "%{$term}%")
                    ->orWhere('appointment_time', 'like', "%{$term}%")
                    ->orWhere('status', 'like', "%{$term}%")
                    ->orWhere('doctor_id', 'like', "%{$term}%")
                    ->orWhereHas('doctor', fn($dq) => $dq->where('name', 'like', "%{$term}%"));

                // Use DB driver-aware concatenation for patient full name (SQLite uses ||)
                $driver = DB::getDriverName();
                $concatExpr = in_array($driver, ['sqlite', 'pgsql'])
                    ? "first_name || ' ' || last_name"
                    : "CONCAT(first_name, ' ', last_name)";

                $q->orWhereHas('patient', fn($pq) => $pq->whereRaw("{$concatExpr} LIKE ?", ["%{$term}%"]));
            });
        }

        if (!empty($filters['from'] ?? null)) {
            $query->where('appointment_date', '>=', $filters['from']);
        }

        if (!empty($filters['to'] ?? null)) {
            $query->where('appointment_date', '<=', $filters['to']);
        }

        if (!empty($filters['doctor_id'] ?? null)) {
            $query->where('doctor_id', $filters['doctor_id']);
        }

        if (!empty($filters['patient_id'] ?? null)) {
            $query->where('patient_id', $filters['patient_id']);
        }

        return $query->paginate(15)->withQueryString();
    }
}
