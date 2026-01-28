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
        int $durationMinutes = 30,
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

        $start = Carbon::parse($date . ' ' . $time);
        $end = $start->copy()->addMinutes($durationMinutes);
        $workingStart = Carbon::parse($date . ' ' . $workingHour->start_time);
        $workingEnd = Carbon::parse($date . ' ' . $workingHour->end_time);

        // Treat end_time as exclusive: appointments must end on or before end_time
        if ($start < $workingStart || $end > $workingEnd) {
            throw ValidationException::withMessages([
                'appointment_time' => 'Selected time is outside doctor working hours.',
            ]);
        }

        // Existing overlap check
        $query = Appointment::where('doctor_id', $doctorId)
            ->where('appointment_date', $date)
            ->where('status', '!=', 'cancelled');

        if ($ignoreAppointmentId !== null) {
            $query->where('id', '!=', $ignoreAppointmentId);
        }

        $existingAppointments = $query->get();

        foreach ($existingAppointments as $appointment) {
            $existingStart = Carbon::parse($date . ' ' . $appointment->appointment_time);
            $existingEnd = $existingStart->copy()->addMinutes($appointment->duration_minutes ?? 30);

            if ($start < $existingEnd && $end > $existingStart) {
                throw ValidationException::withMessages([
                    'appointment_time' => 'Doctor already has an appointment during this time.',
                ]);
            }
        }

    }
}
