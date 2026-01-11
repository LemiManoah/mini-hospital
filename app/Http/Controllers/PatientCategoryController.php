<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Address;
use App\Models\Country;
use Illuminate\Http\Request;
use App\Models\PatientCategory;
use App\Services\PatientCategoryService;
use App\Http\Requests\PatientCategoryRequest;


class PatientCategoryController extends Controller
{
    public function __construct(
        protected PatientCategoryService $service
    ) {}

    public function index(Request $request)
    {
        $search = $request->get('search');

        if (!empty($search)) {
            $patientCategories = $this->service->searchPatientCategory($search);
        } else {
            $patientCategories = $this->service->getAllPatientCategories();
        }
        return Inertia::render('PatientCategories/Index', [
            'patientCategories' => $patientCategories,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('PatientCategories/Create');
    }

    public function store(PatientCategoryRequest $request)
    {
        $this->service->createPatientCategory($request->validated());
        // dd($request->validated());

        return redirect()
            ->route('patient-categories.index')
            ->with('success', 'Patient category created successfully');
    }

    public function edit(string $id)
    {
        return Inertia::render('PatientCategories/Edit', [
            'patientCategory' => $this->service->getPatientCategoryById($id),
        ]);
    }

    public function update(PatientCategoryRequest $request, string $id)
    {
        $this->service->updatePatientCategory($id, $request->validated());

        return redirect()->route('patient-categories.index')->with('success', 'Patient category updated successfully');
    }

    public function destroy(string $id)
    {
        $this->service->deletePatientCategory($id);

        return back()->with('success', 'Patient category deleted successfully');
    }

    public function restore(string $id)
    {
        $this->service->restorePatientCategory($id);

        return back()->with('success', 'Patient category restored successfully');
    }
}


