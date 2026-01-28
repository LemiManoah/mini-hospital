<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Services\VisitTypeService;
use App\Http\Requests\VisitTypeRequest;
use Illuminate\Http\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;

class VisitTypeController extends Controller
{
    public function __construct(
        protected VisitTypeService $visitTypeService
    ) {}

    public function index(Request $request)
    {
        $search = $request->get('search');

        if (!empty($search)) {
            $visitTypes = $this->visitTypeService->searchVisitTypes($search);
        } else {
            $visitTypes = $this->visitTypeService->getAllVisitTypes();
        }

        return Inertia::render('VisitType/Index', [
            'visitTypes' => $visitTypes,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('VisitType/Create');
    }

    public function store(VisitTypeRequest $request): RedirectResponse
    {
        $this->visitTypeService->createVisitType($request->validated());

        return redirect()
            ->route('visit-types.index')
            ->with('success', 'Visit Type created successfully');
    }

    public function edit(string $id)
    {
        $visitType = $this->visitTypeService->getVisitTypeById($id);

        return Inertia::render('VisitType/Edit', [
            'visitType' => $visitType,
        ]);
    }

    public function update(VisitTypeRequest $request, string $id): RedirectResponse
    {
        $this->visitTypeService->updateVisitType($id, $request->validated());

        return redirect()->route('visit-types.index')->with('success', 'Visit Type updated successfully');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->visitTypeService->deleteVisitType($id);

        return redirect()->route('visit-types.index')->with('success', 'Visit Type deleted successfully');
    }

    public function restore(string $id): RedirectResponse
    {
        $this->visitTypeService->restoreVisitType($id);

        return redirect()->route('visit-types.index')->with('success', 'Visit Type restored successfully');
    }

    public function toggleActive(string $id): RedirectResponse
    {
        $visitType = $this->visitTypeService->toggleActiveStatus($id);
        $status = $visitType->is_active ? 'activated' : 'deactivated';

        return redirect()->route('visit-types.index')->with('success', "Visit Type {$status} successfully");
    }
}
