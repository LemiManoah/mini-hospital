<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Patient;
use Inertia\Inertia;
use App\Models\Appointment;
use Illuminate\Http\Request;
use App\Enums\AppointmentStatus;
use Illuminate\Support\Facades\App;
use App\Services\AppointmentService;
use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Requests\UpdateAppointmentRequest;

class AppointmentController extends Controller
{
    public function __construct(protected AppointmentService $appointmentService)
    { 
    }
    public function index(Request $request)
    {
        $search = $request->get('search');

        if (!empty($search)) {
            $appointments = $this->appointmentService->searchAppointments($search);
        } else {
            $appointments = $this->appointmentService->getAllAppointments();
        }

        return Inertia::render('Appointments/Index', [
            'appointments' => $appointments,
            'filters' => [
                'search' => $search,
            ],
            'statuses' => AppointmentStatus::options(),
        ]);
    }

    public function create()
    {
        $doctors = User::select('id', 'name')->orderBy('name')->get();

        $patients = \App\Models\Patient::select('id', 'first_name', 'last_name')
            ->orderBy('first_name')
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'name' => "{$p->first_name} {$p->last_name}",
            ]);

        return Inertia::render('Appointments/Create', [
            'statuses' => AppointmentStatus::options(),
            'doctors' => $doctors,
            'patients' => $patients,
        ]);
    }

    public function store(StoreAppointmentRequest $request)
    {
        $this->appointmentService->createAppointment($request->validated());

        return redirect()
            ->route('appointments.index')
            ->with('success', 'Appointment created successfully');
    }

    public function edit(Appointment $appointment)
    {
        // Load the requested appointment with relations
        $appointment = $this->appointmentService->getAppointmentById($appointment->id);

        // Pass the single appointment instance to the view
        $doctors = User::select('id', 'name')->orderBy('name')->get();

        $patients = Patient::select('id', 'first_name', 'last_name')
            ->orderBy('first_name')
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'name' => "{$p->first_name} {$p->last_name}",
            ]);

        return Inertia::render('Appointments/Edit', [
            'appointment' => $appointment,
            'statuses' => AppointmentStatus::options(),
            'doctors' => $doctors,
            'patients' => $patients,
        ]);
    }

    public function update(UpdateAppointmentRequest $request, Appointment $appointment)
    {
        $this->appointmentService->updateAppointment($appointment->id, $request->validated());

        return redirect()->route('appointments.index')->with('success', 'Appointment updated');
    }

    public function destroy(Appointment $appointment)
    {
        // Mark appointment as cancelled via service for consistency
        $this->appointmentService->updateAppointment($appointment->id, ['status' => 'cancelled']);

        return back()->with('success', 'Appointment cancelled');
    }
}

