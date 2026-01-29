<?php

namespace App\Http\Controllers;

use App\Http\Requests\VisitTriageRequest;
use App\Models\PatientVisit;
use App\Services\VisitTriageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class VisitTriageController extends Controller
{
    public function __construct(
        protected VisitTriageService $visitTriageService
    ) {}

    public function index(Request $request)
    {
        $search = $request->get('search');

        return Inertia::render('Triage/Index', [
            'queueVisits' => $this->visitTriageService->getTriageQueue($search),
            'triageRecords' => $this->visitTriageService->getTriageRecords(),
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(Request $request)
    {
        $visitId = $request->get('visit_id');
        $visit = $visitId ? PatientVisit::with(['patient', 'status'])->find($visitId) : null;
        $queueVisits = $this->visitTriageService->getTriageQueue();

        return Inertia::render('Triage/Create', [
            'visit' => $visit,
            'queueVisits' => $queueVisits,
        ]);
    }

    public function store(VisitTriageRequest $request): RedirectResponse
    {
        $payload = $request->validated();
        $payload['triage_by'] = Auth::id();
        $payload['triage_at'] = now();

        $this->visitTriageService->createTriage($payload);

        return redirect()
            ->route('triage.index')
            ->with('success', 'Triage recorded successfully');
    }

    public function edit(string $id)
    {
        $triage = $this->visitTriageService->getTriageById($id);

        return Inertia::render('Triage/Edit', [
            'triage' => $triage,
        ]);
    }

    public function update(VisitTriageRequest $request, string $id): RedirectResponse
    {
        $payload = $request->validated();
        $this->visitTriageService->updateTriage($id, $payload);

        return redirect()
            ->route('triage.index')->with('success', 'Triage updated successfully');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->visitTriageService->deleteTriage($id);

        return redirect()
            ->route('triage.index')
            ->with('success', 'Triage deleted successfully');
    }
}
