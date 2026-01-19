<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Services\ClinicService;
use App\Http\Requests\ClinicRequest;
use Illuminate\Http\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;

class ClinicController extends Controller
{
    public function __construct(
        protected ClinicService $clinicService
    ) {}

    public function index(Request $request)
    {
        $search = $request->get('search');

        if (!empty($search)) {
            $clinics = $this->clinicService->searchClinics($search);
        } else {
            $clinics = $this->clinicService->getAllClinics();
        }

        return Inertia::render('Clinics/Index', [
            'clinics' => $clinics,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Clinics/Create');
    }

    public function store(ClinicRequest $request): RedirectResponse
    {
        $this->clinicService->createClinic($request->validated());

        return redirect()
            ->route('clinics.index')
            ->with('success', 'Clinic created successfully');
    }

    public function edit(string $id)
    {
        $clinic = $this->clinicService->getClinicById($id);

        return Inertia::render('Clinics/Edit', [
            'clinic' => $clinic,
        ]);
    }

    public function update(ClinicRequest $request, string $id): RedirectResponse
    {
        $this->clinicService->updateClinic($id, $request->validated());

        return redirect()->route('clinics.index')->with('success', 'Clinic updated successfully');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->clinicService->deleteClinic($id);

        return back()->with('success', 'Clinic deleted successfully');
    }

    public function restore(string $id): RedirectResponse
    {
        $this->clinicService->restoreClinic($id);

        return back()->with('success', 'Clinic restored successfully');
    }
}
