<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\VisitStatus;
use App\Models\PatientVisit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\PatientVisitService;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\PatientVisitRequest;

class PatientVisitController extends Controller
{
    public function __construct(
        protected PatientVisitService $patientVisitService
    ) {}

    public function index(Request $request)
    {
        $search = $request->get('search');
        $filter = $request->get('filter');
        if (!$filter && $request->routeIs('visits.index')) {
            $filter = 'active';
        }
        $filter = $filter ?? 'all';
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');

        if ($filter === 'today') {
            $patientVisits = $this->patientVisitService->getTodayVisits();
        } elseif ($filter === 'upcoming') {
            $patientVisits = $this->patientVisitService->getUpcomingVisits();
        } elseif ($filter === 'past') {
            $patientVisits = $this->patientVisitService->getPastVisits();
        } elseif ($filter === 'active') {
            $patientVisits = $this->patientVisitService->getActiveVisits();
        } elseif ($filter === 'completed') {
            $patientVisits = $this->patientVisitService->getCompletedVisits();
        } elseif ($startDate && $endDate) {
            $patientVisits = $this->patientVisitService->getVisitsByDateRange($startDate, $endDate);
        } elseif (!empty($search)) {
            $patientVisits = $this->patientVisitService->searchPatientVisits($search);
        } else {
            $patientVisits = $this->patientVisitService->getAllPatientVisits();
        }

        return Inertia::render('PatientVisit/Index', [
            'patientVisits' => $patientVisits,
            'filters' => [
                'search' => $search,
                'filter' => $filter,
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
            'statistics' => $this->patientVisitService->getVisitStatistics(),
        ]);
    }

    public function create()
    {
        return Inertia::render('PatientVisit/Create', [
            'visitNumber' => \App\Models\PatientVisit::generateVisitNumber(),
        ]);
    }

    public function store(PatientVisitRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        
        // Set default values
        $validated['status_id'] = VisitStatus::where('code', 'REG')->first()->id;
        $validated['visit_date'] = $validated['visit_date'] ?? now()->toDateString();
        $validated['visit_time'] = $validated['visit_time'] ?? now()->toTimeString();
        $validated['created_by_staff_id'] = Auth::id();
        
        // Set priority based on visit type
        $validated['priority_flag'] = $validated['visit_type_id'] === \App\Models\VisitType::where('code', 'EMR')->first()->id ? 'urgent' : 'medium';
        
        $visit = $this->patientVisitService->createPatientVisit($validated);

        return redirect()
            ->route('patient-visits.index')
            ->with('success', 'Patient Visit created successfully');
    }

    public function quickStore(Request $request): RedirectResponse
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'visit_type_id' => 'required|exists:visit_types,id',
            'priority_flag' => 'sometimes|in:low,medium,high,urgent',
        ]);

        $data = [
            'patient_id' => $request->patient_id,
            'visit_type_id' => $request->visit_type_id,
            'status_id' => VisitStatus::where('code', 'REG')->first()->id,
            'assigned_clinic_id' => $request->assigned_clinic_id ?? null,
            'assigned_doctor_id' => $request->assigned_doctor_id ?? null,
            'created_by_staff_id' => Auth::id(),
            'visit_date' => now()->toDateString(),
            'visit_time' => now()->toTimeString(),
            'priority_flag' => $request->priority_flag ?? 'medium',
        ];

        $visit = $this->patientVisitService->createPatientVisit($data);

        return redirect()
            ->route('patient-visits.show', $visit->id)
            ->with('success', 'Patient Visit created successfully');
    }

    public function show(string $id)
    {
        $patientVisit = $this->patientVisitService->getPatientVisitById($id);

        return Inertia::render('PatientVisit/Show', [
            'patientVisit' => $patientVisit,
        ]);
    }

    public function edit(string $id)
    {
        $patientVisit = $this->patientVisitService->getPatientVisitById($id);

        return Inertia::render('PatientVisit/Edit', [
            'patientVisit' => $patientVisit,
        ]);
    }

    public function update(PatientVisitRequest $request, string $id): RedirectResponse
    {
        $this->patientVisitService->updatePatientVisit($id, $request->validated());

        return back()->with('success', 'Patient Visit updated successfully');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->patientVisitService->deletePatientVisit($id);

        return back()->with('success', 'Patient Visit deleted successfully');
    }

    public function restore(string $id): RedirectResponse
    {
        $this->patientVisitService->restorePatientVisit($id);

        return back()->with('success', 'Patient Visit restored successfully');
    }

    public function updateStatus(Request $request, string $id): RedirectResponse
    {
        $request->validate([
            'status_id' => 'required|exists:visit_statuses,id',
        ]);

        $this->patientVisitService->updateVisitStatus($id, $request->status_id);

        return back()->with('success', 'Visit status updated successfully');
    }

    public function assignDoctor(Request $request, string $id): RedirectResponse
    {
        $request->validate([
            'doctor_id' => 'nullable|exists:users,id',
        ]);

        $this->patientVisitService->assignDoctor($id, $request->doctor_id);

        return back()->with('success', 'Doctor assigned successfully');
    }

    public function assignClinic(Request $request, string $id): RedirectResponse
    {
        $request->validate([
            'clinic_id' => 'nullable|exists:clinics,id',
        ]);

        $this->patientVisitService->assignClinic($id, $request->clinic_id);

        return back()->with('success', 'Clinic assigned successfully');
    }

    public function updatePriority(Request $request, string $id): RedirectResponse
    {
        $request->validate([
            'priority_flag' => 'required|in:low,medium,high,urgent',
        ]);

        $this->patientVisitService->updatePriority($id, $request->priority_flag);

        return back()->with('success', 'Priority updated successfully');
    }

    public function reschedule(Request $request, string $id): RedirectResponse
    {
        $request->validate([
            'visit_date' => 'required|date',
            'visit_time' => 'required|date_format:H:i',
        ]);

        $this->patientVisitService->rescheduleVisit(
            $id,
            $request->visit_date,
            $request->visit_time
        );

        return back()->with('success', 'Visit rescheduled successfully');
    }

    public function byPatient($patientId, Request $request)
    {
        $patientVisits = $this->patientVisitService->getPatientVisitsByPatient($patientId);

        return Inertia::render('PatientVisit/PatientVisits', [
            'patientVisits' => $patientVisits,
            'patientId' => $patientId,
        ]);
    }

    public function today(Request $request)
    {
        $patientVisits = $this->patientVisitService->getTodayVisits();

        return Inertia::render('PatientVisit/Today', [
            'patientVisits' => $patientVisits,
        ]);
    }

    public function dashboard(Request $request)
    {
        $statistics = $this->patientVisitService->getVisitStatistics();
        $todayVisits = $this->patientVisitService->getTodayVisits();

        return Inertia::render('PatientVisit/Dashboard', [
            'statistics' => $statistics,
            'todayVisits' => $todayVisits,
        ]);
    }
}
