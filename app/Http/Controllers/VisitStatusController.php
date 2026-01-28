<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Services\VisitStatusService;
use App\Http\Requests\VisitStatusRequest;
use Illuminate\Http\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;

class VisitStatusController extends Controller
{
    public function __construct(
        protected VisitStatusService $visitStatusService
    ) {}

    public function index(Request $request)
    {
        $search = $request->get('search');

        if (!empty($search)) {
            $visitStatuses = $this->visitStatusService->searchVisitStatuses($search);
        } else {
            $visitStatuses = $this->visitStatusService->getAllVisitStatuses();
        }

        return Inertia::render('VisitStatus/Index', [
            'visitStatuses' => $visitStatuses,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        $nextSequence = $this->visitStatusService->getNextSequence();

        return Inertia::render('VisitStatus/Create', [
            'nextSequence' => $nextSequence,
        ]);
    }

    public function store(VisitStatusRequest $request): RedirectResponse
    {
        $this->visitStatusService->createVisitStatus($request->validated());

        return redirect()
            ->route('visit-statuses.index')
            ->with('success', 'Visit Status created successfully');
    }

    public function edit(string $id)
    {
        $visitStatus = $this->visitStatusService->getVisitStatusById($id);

        return Inertia::render('VisitStatus/Edit', [
            'visitStatus' => $visitStatus,
        ]);
    }

    public function update(VisitStatusRequest $request, string $id): RedirectResponse
    {
        $this->visitStatusService->updateVisitStatus($id, $request->validated());

        return redirect()->route('visit-statuses.index')->with('success', 'Visit Status updated successfully');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->visitStatusService->deleteVisitStatus($id);

        return redirect()->route('visit-statuses.index')->with('success', 'Visit Status deleted successfully');
    }

    public function restore(string $id): RedirectResponse
    {
        $this->visitStatusService->restoreVisitStatus($id); 

        return redirect()->route('visit-statuses.index')->with('success', 'Visit Status restored successfully');
    }

    public function toggleTerminal(string $id): RedirectResponse
    {
        $visitStatus = $this->visitStatusService->toggleTerminalStatus($id);
        $status = $visitStatus->is_terminal ? 'marked as terminal' : 'marked as non-terminal';

        return redirect()->route('visit-statuses.index')->with('success', "Visit Status {$status} successfully");
    }

    public function reorder(Request $request): RedirectResponse
    {
        $orderedIds = $request->get('ordered_ids', []);
        $this->visitStatusService->reorderSequences($orderedIds);

        return redirect()->route('visit-statuses.index')->with('success', 'Visit Statuses reordered successfully');
    }
}
