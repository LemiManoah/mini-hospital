# EnsureDoctorIsAvailable

Brief explanation of the `EnsureDoctorIsAvailable` action (file: `app/Actions/Appointments/EnsureDoctorIsAvailable.php`).

## Purpose

This action validates whether a doctor is available for a requested appointment slot. It is meant to be called before creating or updating an appointment to prevent scheduling outside of a doctor's working hours or creating double-bookings.

## Inputs

- `int $doctorId` — ID of the doctor (users table).
- `string $date` — Appointment date (parsable by Carbon).
- `string $time` — Appointment start time (parsable by Carbon; normalized internally to `H:i:s`).
- `?int $ignoreAppointmentId` — Optional appointment id to ignore when checking for conflicts (used when updating an existing appointment).

## Behavior / Checks

1. Compute day of week from `$date` using `Carbon::parse($date)->dayOfWeek` (0 = Sunday, 1 = Monday, ...).
2. Look up `DoctorWorkingHour` where `doctor_id` and `day_of_week` match. If none found, throw a `ValidationException` with message key `appointment_date` and message `Doctor does not work on this day.`
3. Normalize incoming `$time` to `H:i:s` with Carbon before comparing.
4. Check that `$time` falls inside the doctor's working hours. The implementation treats the `end_time` as exclusive (i.e., `$time >= end_time` fails). If the time is outside, throw `ValidationException` with key `appointment_time` and message `Selected time is outside doctor working hours.`
5. Check for double-booking: query `appointments` for entries with the same doctor, date, time, and a status other than `cancelled`. If `$ignoreAppointmentId` is provided, exclude that appointment from the check (use `!== null` for strict check). If a conflicting appointment exists, throw `ValidationException` with key `appointment_time` and message `Doctor already has an appointment at this time.`

## Exceptions thrown

- `Illuminate\Validation\ValidationException` — used to return specific field validation errors for the appointment date/time.

## Notes & Recommendations

- Time normalization: the action already normalizes `$time` to `H:i:s` (recommended to avoid format mismatches).
- End-time behavior: current logic treats `end_time` as exclusive. If you want to allow appointments starting at `end_time`, adjust the comparison.
- Validation: ensure incoming request validation enforces a consistent `appointment_time` format (e.g., `date_format:H:i`) to reduce parsing surprises.
- Overlapping appointments: the current implementation checks equality on `appointment_time`. If appointments have durations, update the logic to detect overlapping intervals rather than exact equality.
- Tests: add unit tests around edge-cases (boundary times, daylight savings, updates that ignore the appointment being updated, and DB-driver differences if raw SQL is used elsewhere).

## Example usage

Called from `AppointmentService::createAppointment()` and `::updateAppointment()`:

```php
$this->ensureDoctorIsAvailable->execute(
    $data['doctor_id'],
    $data['appointment_date'],
    $data['appointment_time'],
    $ignoreAppointmentId // optional
);
```

If the action throws, controller code should handle the `ValidationException` (Laravel will convert it into validation responses for Inertia/API routes).

---

File location: `app/Actions/Appointments/EnsureDoctorIsAvailable.php`. Keep this README in sync with any future changes to the action logic.