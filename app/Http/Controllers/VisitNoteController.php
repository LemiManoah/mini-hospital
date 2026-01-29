<?php

namespace App\Http\Controllers;

use App\Http\Requests\VisitNoteRequest;
use App\Models\PatientVisit;
use App\Services\VisitNoteService;
use App\Models\VisitStatus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class VisitNoteController extends Controller
{
    public function __construct(
        protected VisitNoteService $visitNoteService
    ) {}

    public function index(Request $request)
    {
        $search = $request->get('search');

        return Inertia::render('Consultation/Index', [
            'queueVisits' => $this->visitNoteService->getConsultationQueue($search),
            'consultationNotes' => $this->visitNoteService->getConsultationNotes(),
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(Request $request)
    {
        $visitId = $request->get('visit_id');
        $visit = $visitId ? PatientVisit::with(['patient', 'status', 'assignedClinic'])->find($visitId) : null;
        $queueVisits = $this->visitNoteService->getConsultationQueue();

        if ($visit) {
            $consultationStatus = VisitStatus::where('code', 'CON')->first();
            if ($consultationStatus) {
                $visit->update(['status_id' => $consultationStatus->id]);
                $visit->load('status');
            }
        }

        return Inertia::render('Consultation/Create', [
            'visit' => $visit,
            'queueVisits' => $queueVisits,
        ]);
    }

    public function store(VisitNoteRequest $request): RedirectResponse
    {
        $payload = $request->validated();
        $payload['doctor_id'] = Auth::id();

        $this->visitNoteService->createVisitNote($payload);

        return redirect()
            ->route('consultations.index')
            ->with('success', 'Consultation saved successfully');
    }

    public function edit(string $id)
    {
        $note = $this->visitNoteService->getVisitNoteById($id);

        return Inertia::render('Consultation/Edit', [
            'note' => $note,
        ]);
    }

    public function update(VisitNoteRequest $request, string $id): RedirectResponse
    {
        $payload = $request->validated();
        $this->visitNoteService->updateVisitNote($id, $payload);

        return back()->with('success', 'Consultation updated successfully');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->visitNoteService->deleteVisitNote($id);

        return back()->with('success', 'Consultation deleted successfully');
    }
}
