# Project Workflow Review

## User & Profile Management
**Implied workflow**
- Register/login users (Fortify), edit profile, manage password/2FA.
- Admin creates staff users, assigns roles, and creates a staff profile tied to the user.

**Will it work?** Partially, with blockers:
- No routes for user admin CRUD, so `UsersController` is unreachable. `routes/web.php`
- `CreateUserRequest` allows a nullable password, but the action enforces a required password; if the UI omits it, creation fails. `app/Http/Requests/CreateUserRequest.php`, `app/Actions/Users/CreateNewUserWithProfile.php`
- Roles are inconsistent: create uses `roles[]` (ids) while update expects `role` (name). This mismatch will confuse UI/data. `app/Actions/Users/CreateNewUserWithProfile.php`, `app/Actions/Users/UpdateUserWithProfile.php`, `app/Http/Requests/UpdateUserRequest.php`
- Staff profile creation via `StaffProfileController` is broken:
  - Generates/checks `staff_profile_number`, but table uses `staff_number` and there is no `staff_profile_number` column. This will query a non‑existent column and fail. `app/Http/Controllers/StaffProfileController.php`, `database/migrations/2026_01_12_123942_create_staff_profiles_table.php`
  - Staff profile “show” tries to eager load an `appointments` relation that doesn’t exist, which will error. `app/Http/Controllers/StaffProfileController.php`, `app/Models/StaffProfile.php`
  - `UpdateStaffProfileRequest` uses `$this->route('id')`, but the resource param is `{staff_profile}`; uniqueness rules won’t exclude the current record. `app/Http/Requests/UpdateStaffProfileRequest.php`, `routes/web.php`
  - Search returns a query builder, not a paginated/loaded result, so index search likely breaks Inertia expectations. `app/Services/StaffProfileService.php`

**Missing**
- User CRUD routes and UI wiring (resource routes for users).
- Working staff profile lifecycle (field name mismatch, missing relations).
- Consistent role assignment contract between create/update.

## Patient Intake & Allergies
**Implied workflow**
- Create patient with demographics and category.
- Attach/detach/update patient allergies.

**Will it work?** Mostly, with minor issues:
- Patient CRUD looks consistent and uses services/requests. `app/Http/Controllers/PatientController.php`
- Allergy attach/detach/update is implemented and uses pivot data. `app/Http/Controllers/PatientController.php`
- `PatientVisit::getDisplayNameAttribute()` references `$this->patient->name`, but patients only have `first_name`/`last_name`. Display name may be blank. `app/Models/PatientVisit.php`, `app/Models/Patient.php`

**Missing/weak**
- A computed patient full name accessor or using first/last in visit display.

## Appointments
**Implied workflow**
- Create appointment: choose patient + doctor + date/time.
- Enforce doctor availability via working hours.

**Will it work?** Partially:
- Appointment CRUD, filters, and calendar view exist. `app/Http/Controllers/AppointmentController.php`
- Availability checks are implemented with working hours and double‑booking. `app/Actions/Appointments/EnsureDoctorIsAvailable.php`
- No CRUD for doctor working hours; if hours aren’t seeded, appointment creation fails (“Doctor does not work on this day”). `app/Models/DoctorWorkingHour.php`, `app/Actions/Appointments/EnsureDoctorIsAvailable.php`

**Missing**
- Doctor working hours management UI/routes.

## Patient Visits
**Implied workflow**
- Register a visit (visit number, type, status, assign clinic/doctor).
- Update status, assign clinic/doctor, reschedule, prioritize.
- Show visit details.

**Will it work?** No, major blockers:
- No routes for `PatientVisitController` index/create/store/update; only `visits.show` and `visits.quick-store` are defined. Controller redirects to `patient-visits.*` routes that don’t exist. `routes/web.php`, `app/Http/Controllers/PatientVisitController.php`
- Migration FKs for `patient_visits` likely fail: `assigned_clinic_id`, `assigned_doctor_id`, `created_by_staff_id` use `constrained()` without specifying tables, so Laravel will look for `assigned_clinics`, `assigned_doctors`, and `created_by_staffs` tables that don’t exist. `database/migrations/2026_01_28_053141_create_patient_visits_table.php`
- `PatientVisitRequest` requires `status_id`, `created_by_staff_id`, `visit_date`, `visit_time`, but the controller intends to set these after validation; validation will fail if the form doesn’t send them. `app/Http/Requests/PatientVisitRequest.php`, `app/Http/Controllers/PatientVisitController.php`

**Missing**
- Routes for full visit CRUD.
- Correct FK constraints in migration.
- Request rules aligned with controller auto‑defaults.

## Services & Service Types
**Implied workflow**
- Manage service types and services (cost/price).

**Will it work?** Yes, basic CRUD:
- Controllers and services are consistent. `app/Http/Controllers/ServiceController.php`, `app/Services/ServiceService.php`
- No obvious blockers.
