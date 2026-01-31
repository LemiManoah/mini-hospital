<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Services\MedicalUnitService;
use App\Http\Requests\MedicalUnitRequest;
use Illuminate\Http\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;

class MedicalUnitController extends Controller
{
    public function __construct(
        protected MedicalUnitService $medicalUnitService
    ) {}

    public function index(Request $request)
    {
        $search = $request->get('search');
        $category = $request->get('category');

        if (!empty($search)) {
            $medicalUnits = $this->medicalUnitService->searchMedicalUnits($search);
        } elseif (!empty($category)) {
            $medicalUnits = $this->medicalUnitService->getMedicalUnitsByCategory($category);
        } else {
            $medicalUnits = $this->medicalUnitService->getActiveMedicalUnits();
        }

        return Inertia::render('MedicalUnits/Index', [
            'medicalUnits' => $medicalUnits,
            'categories' => $this->medicalUnitService->getCategories(),
            'filters' => [
                'search' => $search,
                'category' => $category,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('MedicalUnits/Create', [
            'categories' => $this->medicalUnitService->getCategories(),
        ]);
    }

    public function store(MedicalUnitRequest $request): RedirectResponse
    {
        $this->medicalUnitService->createMedicalUnit($request->validated());

        return redirect()
            ->route('medical-units.index')
            ->with('success', 'Medical unit created successfully');
    }

    public function edit(string $id)
    {
        $medicalUnit = $this->medicalUnitService->getMedicalUnitById($id);

        return Inertia::render('MedicalUnits/Edit', [
            'medicalUnit' => $medicalUnit,
            'categories' => $this->medicalUnitService->getCategories(),
        ]);
    }

    public function update(MedicalUnitRequest $request, string $id): RedirectResponse
    {
        $this->medicalUnitService->updateMedicalUnit($id, $request->validated());

        return back()->with('success', 'Medical unit updated successfully');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->medicalUnitService->deleteMedicalUnit($id);

        return back()->with('success', 'Medical unit deleted successfully');
    }

    public function restore(string $id): RedirectResponse
    {
        $this->medicalUnitService->restoreMedicalUnit($id);

        return back()->with('success', 'Medical unit restored successfully');
    }
}
