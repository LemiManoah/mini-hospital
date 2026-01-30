<?php

namespace App\Http\Controllers;

use App\Http\Requests\LabSampleRequest;
use App\Services\LabSampleService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LabSampleController extends Controller
{
    public function __construct(
        protected LabSampleService $labSampleService
    ) {}

    public function index(Request $request)
    {
        $search = $request->get('search');
        $status = $request->get('status', 'all');

        $labSamples = $this->labSampleService->searchLabSamples($search, $status);

        return Inertia::render('LabSamples/Index', [
            'labSamples' => $labSamples,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('LabSamples/Create');
    }

    public function store(LabSampleRequest $request): RedirectResponse
    {
        $this->labSampleService->createLabSample($request->validated());

        return redirect()
            ->route('lab-samples.index')
            ->with('success', 'Lab Sample created successfully');
    }

    public function show(string $id)
    {
        $labSample = $this->labSampleService->getLabSampleById($id);

        return Inertia::render('LabSamples/Show', [
            'labSample' => $labSample,
        ]);
    }

    public function edit(string $id)
    {
        $labSample = $this->labSampleService->getLabSampleById($id);

        return Inertia::render('LabSamples/Edit', [
            'labSample' => $labSample,
        ]);
    }

    public function update(LabSampleRequest $request, string $id): RedirectResponse
    {
        $this->labSampleService->updateLabSample($id, $request->validated());

        return redirect()
            ->route('lab-samples.index')
            ->with('success', 'Lab Sample updated successfully');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->labSampleService->deleteLabSample($id);

        return back()->with('success', 'Lab Sample deleted successfully');
    }

    public function restore(string $id): RedirectResponse
    {
        $this->labSampleService->restoreLabSample($id);

        return back()->with('success', 'Lab Sample restored successfully');
    }
}
