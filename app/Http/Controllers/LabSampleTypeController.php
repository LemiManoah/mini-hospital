<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Services\LabSampleTypeService;
use App\Http\Requests\LabSampleTypeRequest;
use Illuminate\Http\RedirectResponse;

class LabSampleTypeController extends Controller
{
    public function __construct(
        protected LabSampleTypeService $labSampleTypeService
    ) {}

    public function index()
    {
        $search = request()->get('search');

        if (!empty($search)) {
            $labSampleTypes = $this->labSampleTypeService->searchLabSampleTypes($search);
        } else {
            $labSampleTypes = $this->labSampleTypeService->getAllLabSampleTypes();
        }

        return Inertia::render('LabSampleTypes/Index', [
            'labSampleTypes' => $labSampleTypes,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('LabSampleTypes/Create');
    }

    public function store(LabSampleTypeRequest $request): RedirectResponse
    {
        $this->labSampleTypeService->createLabSampleType($request->validated());

        return redirect()
            ->route('lab-sample-types.index')
            ->with('success', 'Lab Sample Type created successfully');
    }

    public function edit(string $id)
    {
        $labSampleType = $this->labSampleTypeService->getLabSampleTypeById($id);

        return Inertia::render('LabSampleTypes/Edit', [
            'labSampleType' => $labSampleType,
        ]);
    }

    public function update(LabSampleTypeRequest $request, string $id): RedirectResponse
    {
        $this->labSampleTypeService->updateLabSampleType($id, $request->validated());

        return redirect()
            ->route('lab-sample-types.index')
            ->with('success', 'Lab Sample Type updated successfully');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->labSampleTypeService->deleteLabSampleType($id);

        return back()->with('success', 'Lab Sample Type deleted successfully');
    }

    public function restore(string $id): RedirectResponse
    {
        $this->labSampleTypeService->restoreLabSampleType($id);

        return back()->with('success', 'Lab Sample Type restored successfully');
    }

    public function toggleActive(string $id): RedirectResponse
    {
        $labSampleType = $this->labSampleTypeService->toggleActiveStatus($id);
        $status = $labSampleType->is_active ? 'activated' : 'deactivated';

        return redirect()
            ->route('lab-sample-types.index')
            ->with('success', "Lab Sample Type {$status} successfully");
    }
}
