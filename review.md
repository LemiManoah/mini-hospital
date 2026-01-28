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

**Will it work?** Partially, with gaps and data issues:
- Appointment CRUD, filters, and calendar view exist. `app/Http/Controllers/AppointmentController.php`
- Availability checks are implemented with working hours and exact time double‑booking. `app/Actions/Appointments/EnsureDoctorIsAvailable.php`
- Calendar can break because `appointment_time` is cast to a datetime and then concatenated into an ISO string (e.g., `date + 'T' + datetime`), producing invalid `start` values. `app/Models/Appointment.php`, `app/Http/Controllers/AppointmentController.php`
- Edit form loads all users as doctors (not role filtered), while create uses only doctors; inconsistent and allows non‑doctor selection. `app/Http/Controllers/AppointmentController.php`
- Store/update only validate `doctor_id exists:users,id` and don’t confirm doctor role. `app/Http/Requests/StoreAppointmentRequest.php`, `app/Http/Requests/UpdateAppointmentRequest.php`
- No duration/overlap model: double‑booking check only protects exact same time; overlapping appointments are allowed.
- No linkage to services/billing/clinic/room; appointment is isolated from the rest of the care/billing flow.

**Missing (business requirements)**
- Appointment method (in‑person / phone / video / home visit).
- Appointment categories/reasons (e.g., consultation, follow‑up, lab, procedure).
- Location context (clinic, room, or telemedicine link).
- Duration and overlap handling.
- Cancellation/no‑show reasons and reschedule tracking.
- Reminders/notifications (email/SMS/WhatsApp) and confirmation status.
- Triage/priority for urgent appointment types.
- Integration with patient visits (appointment → visit creation/check‑in).

**What to change so it meets business requirements**
1) **Schema extensions**
   - Add `appointment_method_id` (or enum), `appointment_category_id`, `duration_minutes`, `clinic_id`, `room_id` (optional), `service_id` (optional), `cancellation_reason`, `rescheduled_from_id` (self‑FK), `checked_in_at`, `completed_at`.
   - If telemedicine is used, add `virtual_link` and `platform`.
2) **Reference data**
   - Create `appointment_methods` and `appointment_categories` (seeded) for consistent reporting.
3) **Validation & roles**
   - Validate `doctor_id` against role `doctor` (or add a `doctors` table).
   - Enforce `appointment_time` format and handle time zones consistently.
4) **Scheduling logic**
   - Use duration to prevent overlaps, not just exact time matches.
   - Consider buffer times and working‑hours breaks.
5) **Calendar correctness**
   - Ensure `appointment_time` serializes as `HH:mm:ss` string (not datetime) before concatenation.
   - Or build `start` with a proper DateTime value in the controller.
6) **Workflow**
   - Add “check‑in → visit creation” path from appointment.
   - Add status transitions with validations (scheduled → confirmed → checked‑in → completed / no‑show / cancelled).

## Patient Visits
**Implied workflow**
- Register a visit (visit number, type, status, assign clinic/doctor).
- Update status, assign clinic/doctor, reschedule, prioritize.
- Show visit details.

**Will it work?** No, major blockers and missing UI:
- No routes for `PatientVisitController` index/create/store/update; only `visits.show` and `visits.quick-store` are defined. Controller redirects to `patient-visits.*` routes that don’t exist. `routes/web.php`, `app/Http/Controllers/PatientVisitController.php`
- No UI pages for patient visits (no `resources/js/pages/PatientVisit/*`), so the module has no screens. `resources/js/pages`
- Migration FKs for `patient_visits` likely fail: `assigned_clinic_id`, `assigned_doctor_id`, `created_by_staff_id` use `constrained()` without specifying tables, so Laravel will look for `assigned_clinics`, `assigned_doctors`, and `created_by_staffs` tables that don’t exist. `database/migrations/2026_01_28_053141_create_patient_visits_table.php`
- `PatientVisitRequest` requires `status_id`, `created_by_staff_id`, `visit_date`, `visit_time`, but the controller intends to set these after validation; validation will fail if the form doesn’t send them. `app/Http/Requests/PatientVisitRequest.php`, `app/Http/Controllers/PatientVisitController.php`
- `PatientVisitService::searchPatientVisits()` returns a query builder without pagination; controller expects a ready dataset. `app/Services/PatientVisitService.php`
- Status transitions are not enforced (any status can be set at any time). `app/Services/PatientVisitService.php`

**Missing (functional requirements)**
- Visit intake data (chief complaint, triage/vitals, history, notes).
- Clinical workflow artifacts (diagnoses, orders, prescriptions, lab/imaging results).
- Billing linkage (services performed during visit, charges, insurance category, payments).
- Link from appointments to visits (check‑in from appointment).
- Role‑based access control for visit actions (triage, assign doctor, discharge).
- Audit trail of who updated status/assigned clinic/doctor.

**What to change so it becomes fully functional**
1) **Schema fixes**
   - Fix FKs to correct tables: `assigned_clinic_id -> clinics`, `assigned_doctor_id -> users`, `created_by_staff_id -> users` (or `staff_profiles` if that is the intended owner).
   - Add fields for intake/triage (complaint, vitals JSON, triage notes, triage_by, triage_at).
   - Add medical documentation (diagnosis codes, visit notes, treatment plan).
   - Add linkage tables for `visit_services`, `visit_orders`, `visit_prescriptions`, `visit_results`.
2) **Routes + UI**
   - Add `Route::resource('patient-visits', PatientVisitController::class)` and views for index/create/show/edit + dashboard.
   - Add quick‑create UI for front desk and triage queue.
3) **Validation & defaults**
   - Make `status_id`, `created_by_staff_id`, `visit_date`, `visit_time` optional in request when controller sets defaults.
   - Validate `assigned_doctor_id` against doctor role.
4) **Workflow**
   - Enforce status transitions (registered → triaged → consultation → results → discharged/closed).
   - Add “check‑in” from appointment to create a visit and link `appointment_id`.
5) **Integration**
   - Tie visit to services and billing (service items + costs).
   - Surface visit history on patient profile.

## Services & Service Types
**Implied workflow**
- Manage service types and services (cost/price).

**Will it work?** Yes, basic CRUD:
- Controllers and services are consistent. `app/Http/Controllers/ServiceController.php`, `app/Services/ServiceService.php`
- No obvious blockers.
