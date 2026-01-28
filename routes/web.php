<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\AllergyController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ClinicController;
use App\Http\Controllers\PatientCategoryController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ServiceTypeController;
use App\Http\Controllers\Settings\RoleController;
use App\Http\Controllers\StaffProfileController;
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
    Route::resource('staff-profile', StaffProfileController::class);
    Route::resource('services', ServiceController::class);
    Route::resource('service-types', ServiceTypeController::class);
});

require __DIR__.'/settings.php';
