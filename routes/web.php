<?php

use Inertia\Inertia;
use Laravel\Fortify\Features;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClinicController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\AllergyController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\LabResultController;
use App\Http\Controllers\LabSampleController;
use App\Http\Controllers\VisitNoteController;
use App\Http\Controllers\LabServiceController;
use App\Http\Controllers\VisitOrderController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\MedicalUnitController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\ServiceTypeController;
use App\Http\Controllers\VisitTriageController;
use App\Http\Controllers\PatientVisitController;
use App\Http\Controllers\StaffProfileController;
use App\Http\Controllers\LabSampleTypeController;
use App\Http\Controllers\Settings\RoleController;
use App\Http\Controllers\LabResultOptionController;
use App\Http\Controllers\PatientCategoryController;
use App\Http\Controllers\AppointmentMethodController;
use App\Http\Controllers\DoctorWorkingHourController;
use App\Http\Controllers\LabReferenceRangeController;
use App\Http\Controllers\LabResultParameterController;
use App\Http\Controllers\LabServiceCategoryController;
use App\Http\Controllers\AppointmentCategoryController;

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
    Route::resource('medical-units', MedicalUnitController::class);
    Route::resource('suppliers', SupplierController::class);

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
    Route::resource('lab-result-parameters', LabResultParameterController::class)->except(['index', 'show']);
    Route::resource('lab-reference-ranges', LabReferenceRangeController::class)->except(['index', 'show']);
    Route::resource('lab-samples', LabSampleController::class);

    // Visit Orders
    Route::post('/visit-orders', [VisitOrderController::class, 'store'])->name('visit-orders.store');
    Route::get('/lab/queue', [VisitOrderController::class, 'labQueue'])->name('lab.queue');
    Route::put('/lab-queue/{orderId}/pick-samples', [VisitOrderController::class, 'pickSamples'])->name('lab.queue.pick-samples');
    Route::put('/lab-queue/items/{itemId}/pick-sample', [VisitOrderController::class, 'pickSampleItem'])->name('lab.queue.pick-sample-item');
    Route::get('/lab/results', [LabResultController::class, 'index'])->name('lab.results.index');
    Route::put('/lab/results/items/{itemId}', [LabResultController::class, 'storeItemResult'])->name('lab.results.store');
    Route::put('/lab/results/items/{itemId}/verify', [LabResultController::class, 'verifyItemResult'])->name('lab.results.verify');
    Route::get('/lab/results/visit/{visitId}/print', [LabResultController::class, 'printVisitResults'])->name('lab.results.print');
    Route::get('/patients/{patientId}/lab-history', [VisitOrderController::class, 'patientLabHistory'])->name('patients.lab-history');
    Route::put('/visit-orders/{orderId}/status', [VisitOrderController::class, 'updateStatus'])->name('visit-orders.update-status');

});

require __DIR__.'/settings.php';
