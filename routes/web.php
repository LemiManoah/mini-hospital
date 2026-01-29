<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\AllergyController;
use App\Http\Controllers\AppointmentCategoryController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AppointmentMethodController;
use App\Http\Controllers\ClinicController;
use App\Http\Controllers\DoctorWorkingHourController;
use App\Http\Controllers\PatientCategoryController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PatientVisitController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ServiceTypeController;
use App\Http\Controllers\VisitNoteController;
use App\Http\Controllers\VisitTriageController;
use App\Http\Controllers\Settings\RoleController;
use App\Http\Controllers\StaffProfileController;
use App\Http\Controllers\LabServiceController;
use App\Http\Controllers\LabServiceCategoryController;
use App\Http\Controllers\LabSampleTypeController;
use App\Http\Controllers\LabResultOptionController;
use App\Http\Controllers\LabSampleController;
use App\Http\Controllers\VisitOrderController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('patients', PatientController::class);
    Route::resource('patient-categories', PatientCategoryController::class);
    Route::resource('addresses', AddressController::class);
    Route::resource('allergies', AllergyController::class);
    Route::resource('appointments', AppointmentController::class);
    Route::get('/calendar', [AppointmentController::class, 'calendarView'])->name('appointments.calendar');
    
    // Patient allergy management
    Route::post('patients/{patient}/allergies', [PatientController::class, 'attachAllergy'])->name('patients.allergies.attach');
    Route::delete('patients/{patient}/allergies/{allergy}', [PatientController::class, 'detachAllergy'])->name('patients.allergies.detach');
    Route::put('patients/{patient}/allergies/{allergy}', [PatientController::class, 'updatePatientAllergy'])->name('patients.allergies.update');
    
    Route::resource('roles', RoleController::class);
    Route::resource('clinics', ClinicController::class);
    Route::resource('appointment-methods', AppointmentMethodController::class);
    Route::resource('appointment-categories', AppointmentCategoryController::class);
    Route::resource('doctor-working-hours', DoctorWorkingHourController::class);
    Route::resource('staff-profile', StaffProfileController::class);
    Route::resource('services', ServiceController::class);
    Route::resource('service-types', ServiceTypeController::class);
    Route::resource('triage', VisitTriageController::class);
    Route::resource('consultations', VisitNoteController::class);
    Route::resource('patient-visits', PatientVisitController::class);

    Route::post('/visits/quick-create', [PatientVisitController::class, 'quickStore'])
        ->name('visits.quick-store');

    Route::get('/visits', [PatientVisitController::class, 'index'])
        ->name('visits.index');

    Route::get('/visits/{visit}', [PatientVisitController::class, 'show'])
        ->name('visits.show');

    // Lab Management
    Route::resource('lab-services', LabServiceController::class);
    Route::resource('lab-service-categories', LabServiceCategoryController::class);
    Route::resource('lab-sample-types', LabSampleTypeController::class);
    Route::resource('lab-result-options', LabResultOptionController::class);
    Route::resource('lab-samples', LabSampleController::class);
    Route::post('/lab-samples/{id}/receive', [LabSampleController::class, 'receive'])->name('lab-samples.receive');
    Route::post('/lab-samples/{id}/reject', [LabSampleController::class, 'reject'])->name('lab-samples.reject');
    Route::post('/lab-samples/collect', [LabSampleController::class, 'collect'])->name('lab-samples.collect');

    // Visit Orders
    Route::post('/visit-orders', [VisitOrderController::class, 'store'])->name('visit-orders.store');
    Route::get('/lab/queue', [VisitOrderController::class, 'labQueue'])->name('lab.queue');
    Route::get('/patients/{patientId}/lab-history', [VisitOrderController::class, 'patientLabHistory'])->name('patients.lab-history');
    Route::put('/visit-orders/{orderId}/status', [VisitOrderController::class, 'updateStatus'])->name('visit-orders.update-status');

});

require __DIR__.'/settings.php';
