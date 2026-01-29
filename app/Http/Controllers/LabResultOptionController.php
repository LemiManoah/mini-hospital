<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Services\LabResultOptionService;
use App\Http\Requests\LabResultOptionRequest;
use Illuminate\Http\RedirectResponse;

class LabResultOptionController extends Controller
{
    public function __construct(
        protected LabResultOptionService $labResultOptionService
    ) {}

    public function index()
    {
        $search = request()->get('search');

        if (!empty($search)) {
            $labResultOptions = $this->labResultOptionService->searchLabResultOptions($search);
        } else {
            $labResultOptions = $this->labResultOptionService->getAllLabResultOptions();
        }

        return Inertia::render('LabResultOptions/Index', [
            'labResultOptions' => $labResultOptions,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        $services = \App\Models\LabService::active()->get(['id', 'name']);

        return Inertia::render('LabResultOptions/Create', [
            'services' => $services,
        ]);
    }

    public function store(LabResultOptionRequest $request): RedirectResponse
    {
        $this->labResultOptionService->createLabResultOption($request->validated());

        return redirect()
            ->route('lab-result-options.index')
            ->with('success', 'Lab Result Option created successfully');
    }

    public function edit(string $id)
    {
        $labResultOption = $this->labResultOptionService->getLabResultOptionById($id);
        $services = \App\Models\LabService::active()->get(['id', 'name']);

        return Inertia::render('LabResultOptions/Edit', [
            'labResultOption' => $labResultOption,
            'services' => $services,
        ]);
    }

    public function update(LabResultOptionRequest $request, string $id): RedirectResponse
    {
        $this->labResultOptionService->updateLabResultOption($id, $request->validated());

        return redirect()
            ->route('lab-result-options.index')
            ->with('success', 'Lab Result Option updated successfully');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->labResultOptionService->deleteLabResultOption($id);

        return back()->with('success', 'Lab Result Option deleted successfully');
    }

    public function restore(string $id): RedirectResponse
    {
        $this->labResultOptionService->restoreLabResultOption($id);

        return back()->with('success', 'Lab Result Option restored successfully');
    }
}
