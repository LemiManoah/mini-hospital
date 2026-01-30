<?php

namespace App\Http\Controllers;

use App\Http\Requests\LabResultParameterRequest;
use App\Services\LabResultParameterService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class LabResultParameterController extends Controller
{
    public function __construct(
        protected LabResultParameterService $labResultParameterService
    ) {}

    public function create()
    {
        $services = \App\Models\LabService::active()->get(['id', 'name', 'code']);

        return Inertia::render('LabResultParameters/Create', [
            'services' => $services,
        ]);
    }

    public function store(LabResultParameterRequest $request): RedirectResponse
    {
        $this->labResultParameterService->createLabResultParameter($request->validated());

        return redirect()
            ->route('lab-result-options.index')
            ->with('success', 'Lab Result Parameter created successfully');
    }

    public function edit(string $id)
    {
        $labResultParameter = $this->labResultParameterService->getLabResultParameterById($id);
        $services = \App\Models\LabService::active()->get(['id', 'name', 'code']);

        return Inertia::render('LabResultParameters/Edit', [
            'labResultParameter' => $labResultParameter,
            'services' => $services,
        ]);
    }

    public function update(LabResultParameterRequest $request, string $id): RedirectResponse
    {
        $this->labResultParameterService->updateLabResultParameter($id, $request->validated());

        return redirect()
            ->route('lab-result-options.index')
            ->with('success', 'Lab Result Parameter updated successfully');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->labResultParameterService->deleteLabResultParameter($id);

        return back()->with('success', 'Lab Result Parameter deleted successfully');
    }
}
