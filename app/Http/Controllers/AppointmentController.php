<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Patient;
use App\Models\Clinic;
use App\Models\Service;
use App\Models\AppointmentMethod;
use App\Models\AppointmentCategory;
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
    public function __construct(protected AppointmentService $appointmentService) {}
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'from', 'to', 'doctor_id', 'patient_id']);

        // If any filter is provided, use the search method to apply filters
        $hasFilters = array_filter($filters, fn($v) => !is_null($v) && $v !== '');

        if (!empty($hasFilters)) {
            $appointments = $this->appointmentService->searchAppointments($filters);
        } else {
            $appointments = $this->appointmentService->getAllAppointments();
        }

        // Provide lists of doctors and patients for filters
        $doctors = User::role('doctor')->select('id', 'name')->orderBy('name')->get();

        $patients = Patient::select('id', 'first_name', 'last_name')
            ->orderBy('first_name')
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'name' => "{$p->first_name} {$p->last_name}",
            ]);

        return Inertia::render('Appointments/Index', [
            'appointments' => $appointments,
            'filters' => $filters,
            'statuses' => AppointmentStatus::options(),
            'doctors' => $doctors,
            'patients' => $patients,
        ]);
    }

    public function create()
    {
        $doctors = User::role('doctor')->select('id', 'name')->get();
        $methods = AppointmentMethod::active()->select('id', 'name')->orderBy('name')->get();
        $categories = AppointmentCategory::active()->select('id', 'name')->orderBy('name')->get();
        $clinics = Clinic::select('id', 'name')->orderBy('name')->get();
        $services = Service::select('id', 'name')->orderBy('name')->get();

        $patients = Patient::select('id', 'first_name', 'last_name')
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
            'methods' => $methods,
            'categories' => $categories,
            'clinics' => $clinics,
            'services' => $services,
            'priorities' => $this->priorityOptions(),
        ]);
    }

    public function store(StoreAppointmentRequest $request)
    {
        $this->appointmentService->createAppointment($request->validated());

        return redirect()
            ->route('appointments.index')
            ->with('success', 'Appointment created successfully');
    }

    public function show(string $id)
    {
        $appointment = $this->appointmentService->getAppointmentById($id);

        return Inertia::render('Appointments/Show', [
            'appointment' => $appointment->load(['patient', 'doctor', 'method', 'category', 'clinic', 'service']),
            'statuses' => AppointmentStatus::options(),
        ]);
    }

    public function edit(Appointment $appointment)
    {
        // Load the requested appointment with relations
        $appointment = $this->appointmentService->getAppointmentById($appointment->id);

        // Pass the single appointment instance to the view
        $doctors = User::role('doctor')->select('id', 'name')->orderBy('name')->get();
        $methods = AppointmentMethod::active()->select('id', 'name')->orderBy('name')->get();
        $categories = AppointmentCategory::active()->select('id', 'name')->orderBy('name')->get();
        $clinics = Clinic::select('id', 'name')->orderBy('name')->get();
        $services = Service::select('id', 'name')->orderBy('name')->get();

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
            'methods' => $methods,
            'categories' => $categories,
            'clinics' => $clinics,
            'services' => $services,
            'priorities' => $this->priorityOptions(),
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

    public function calendar()
    {
        $appointments = Appointment::with(['patient', 'doctor'])->get();

        return response()->json(
            $appointments->map(fn($appointment) => [
                'id' => $appointment->id,
                'title' => $appointment->patient->first_name . ' ' . $appointment->patient->last_name,
                'start' => $appointment->appointment_date->format('Y-m-d') . 'T' . $appointment->appointment_time,
                'end' => $appointment->appointment_date->format('Y-m-d') . 'T' . $this->calculateEndTime($appointment),
                'status' => $appointment->status,
            ])
        );
    }
    public function calendarView()
    {
        return Inertia::render('Appointments/Calendar', [
            'events' => Appointment::with('patient')->get()->map(fn($a) => [
                'id' => $a->id,
                'title' => $a->patient ? $a->patient->first_name . ' ' . $a->patient->last_name : 'Unknown Patient',
                'start' => $a->appointment_date->format('Y-m-d') . 'T' . $a->appointment_time,
                'end' => $a->appointment_date->format('Y-m-d') . 'T' . $this->calculateEndTime($a),
            ]),
        ]);
    }

    private function priorityOptions(): array
    {
        return [
            ['value' => 'low', 'label' => 'Low'],
            ['value' => 'medium', 'label' => 'Medium'],
            ['value' => 'high', 'label' => 'High'],
            ['value' => 'urgent', 'label' => 'Urgent'],
        ];
    }

    private function calculateEndTime(Appointment $appointment): string
    {
        $start = \Carbon\Carbon::parse($appointment->appointment_date->format('Y-m-d') . ' ' . $appointment->appointment_time);
        $end = $start->copy()->addMinutes($appointment->duration_minutes ?? 30);

        return $end->format('H:i:s');
    }
}
