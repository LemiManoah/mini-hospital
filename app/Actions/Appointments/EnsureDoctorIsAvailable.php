<?php

namespace App\Actions\Appointments;

use Carbon\Carbon;
use App\Models\Appointment;
use App\Models\DoctorWorkingHour;
use Illuminate\Validation\ValidationException;

class EnsureDoctorIsAvailable
{
    public function execute(
        int $doctorId,
        string $date,
        string $time,
        ?int $ignoreAppointmentId = null
    ): void {
        $dayOfWeek = Carbon::parse($date)->dayOfWeek;

        // Normalize time to ensure consistent comparisons (H:i:s)
        $time = Carbon::parse($time)->format('H:i:s');

        $workingHour = DoctorWorkingHour::where('doctor_id', $doctorId)
            ->where('day_of_week', $dayOfWeek)
            ->first();

        if (! $workingHour) {
            throw ValidationException::withMessages([
                'appointment_date' => 'Doctor does not work on this day.',
            ]);
        }

        // Treat end_time as exclusive: appointments must start before end_time
        if ($time < $workingHour->start_time || $time >= $workingHour->end_time) {
            throw ValidationException::withMessages([
                'appointment_time' => 'Selected time is outside doctor working hours.',
            ]);
        }

        // Existing double-booking check (compare normalized time)
        $query = Appointment::where('doctor_id', $doctorId)
            ->where('appointment_date', $date)
            ->where('appointment_time', $time)
            ->where('status', '!=', 'cancelled');

        if ($ignoreAppointmentId !== null) {
            $query->where('id', '!=', $ignoreAppointmentId);
        }

        if ($query->exists()) {
            throw ValidationException::withMessages([
                'appointment_time' => 'Doctor already has an appointment at this time.',
            ]);
        }
    }
}
