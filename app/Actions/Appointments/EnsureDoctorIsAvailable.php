<?php

namespace App\Actions\Appointments;

use App\Models\Appointment;
use Illuminate\Validation\ValidationException;

class EnsureDoctorIsAvailable
{
    public function execute(
        int $doctorId,
        string $date,
        string $time,
        ?int $ignoreAppointmentId = null
    ): void {
        $query = Appointment::where('doctor_id', $doctorId)
            ->where('appointment_date', $date)
            ->where('appointment_time', $time)
            ->where('status', '!=', 'cancelled');

        if ($ignoreAppointmentId) {
            $query->where('id', '!=', $ignoreAppointmentId);
        }

        if ($query->exists()) {
            throw ValidationException::withMessages([
                'appointment_time' => 'This doctor already has an appointment at the selected time.',
            ]);
        }
    }
}
