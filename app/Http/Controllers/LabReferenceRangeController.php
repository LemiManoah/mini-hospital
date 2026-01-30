<?php

namespace App\Http\Controllers;

use App\Http\Requests\LabReferenceRangeRequest;
use App\Services\LabReferenceRangeService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class LabReferenceRangeController extends Controller
{
    public function __construct(
        protected LabReferenceRangeService $labReferenceRangeService
    ) {}

    public function create()
    {
        $parameterId = request()->get('parameter_id');
        $parameters = \App\Models\LabResultParameter::with('labService')
            ->when($parameterId, fn ($q) => $q->where('id', $parameterId))
            ->get(['id', 'lab_service_id', 'parameter_name']);

        return Inertia::render('LabReferenceRanges/Create', [
            'parameters' => $parameters,
            'parameterId' => $parameterId,
        ]);
    }

    public function store(LabReferenceRangeRequest $request): RedirectResponse
    {
        $this->labReferenceRangeService->createLabReferenceRange($request->validated());

        return redirect()
            ->route('lab-result-options.index')
            ->with('success', 'Lab Reference Range created successfully');
    }

    public function edit(string $id)
    {
        $labReferenceRange = $this->labReferenceRangeService->getLabReferenceRangeById($id);
        $parameters = \App\Models\LabResultParameter::with('labService')
            ->get(['id', 'lab_service_id', 'parameter_name']);

        return Inertia::render('LabReferenceRanges/Edit', [
            'labReferenceRange' => $labReferenceRange,
            'parameters' => $parameters,
        ]);
    }

    public function update(LabReferenceRangeRequest $request, string $id): RedirectResponse
    {
        $this->labReferenceRangeService->updateLabReferenceRange($id, $request->validated());

        return redirect()
            ->route('lab-result-options.index')
            ->with('success', 'Lab Reference Range updated successfully');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->labReferenceRangeService->deleteLabReferenceRange($id);

        return back()->with('success', 'Lab Reference Range deleted successfully');
    }
}
