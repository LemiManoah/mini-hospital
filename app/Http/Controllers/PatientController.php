<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Services\PatientService;
use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use App\Enums\EnumsKinRelationship;
use App\Enums\EnumsGender;
use App\Enums\EnumsMaritalStatus;
use App\Enums\EnumsReligions;
use App\Models\PatientCategory;
use App\Models\Address;
use App\Models\Country;

class PatientController extends Controller
{
    public function __construct(
        protected PatientService $patientService,
    ) {
    }

    public function index(Request $request)
    {
        $search = $request->get('search');

        if (!empty($search)) {
            $patients = $this->patientService->searchPatients($search);
        } else {
            $patients = $this->patientService->getAllPatients();
        }

        return Inertia::render('Patients/Index', [
            'patients' => $patients,
            'filters' => [
                'search' => $search,
            ],
            'kinRelationships' => EnumsKinRelationship::options(),
            'genders' => EnumsGender::options(),
            'maritalStatuses' => EnumsMaritalStatus::options(),
            'religions' => EnumsReligions::options(),
        ]);
    }

    public function create()
    {
        $countries = Country::select('id', 'name')->orderBy('name')->get();

        $patientCategories = PatientCategory::select('id', 'name')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        $addresses = Address::select('id', 'district', 'city', 'county')
            ->orderBy('district')
            ->orderBy('city')
            ->get();

        return Inertia::render('Patients/Create', [
            'patientCategories' => $patientCategories,
            'addresses' => $addresses,
            'countries' => $countries,
            'registrationDate' => now()->format('Y-m-d'),
            'kinRelationships' => EnumsKinRelationship::options(),
            'genders' => EnumsGender::options(),
            'maritalStatuses' => EnumsMaritalStatus::options(),
            'religions' => EnumsReligions::options(),
        ]);
    }

    public function store(StorePatientRequest $request)
    {
        $this->patientService->createPatient($request->validated());

        return redirect()
            ->route('patients.index')
            ->with('success', 'Patient created successfully');
    }

    public function show(string $id)
    {
        $patient = $this->patientService->getPatientById($id);

        return Inertia::render('Patients/Show', [
            'patient' => $patient,
            'kinRelationships' => EnumsKinRelationship::options(),
            'genders' => EnumsGender::options(),
            'maritalStatuses' => EnumsMaritalStatus::options(),
            'religions' => EnumsReligions::options(),
        ]);
    }

    public function edit(string $id)
    {
        $patient = $this->patientService->getPatientById($id);
        $countries = Country::select('id', 'name')->orderBy('name')->get();

        $patientCategories = PatientCategory::select('id', 'name')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        $addresses = Address::select('id', 'district', 'city', 'county')
            ->orderBy('district')
            ->orderBy('city')
            ->get();

        return Inertia::render('Patients/Edit', [
            'countries' => $countries,
            'patientCategories' => $patientCategories,
            'addresses' => $addresses,
            'patient' => $patient,
            'kinRelationships' => EnumsKinRelationship::options(),
            'genders' => EnumsGender::options(),
            'maritalStatuses' => EnumsMaritalStatus::options(),
            'religions' => EnumsReligions::options(),
        ]);
    }

    public function update(UpdatePatientRequest $request, string $id)
    {
        $this->patientService->updatePatient($id, $request->validated());

        return redirect()->route('patients.index')->with('success', 'Patient updated successfully');
    }

    public function destroy(string $id)
    {
        $this->patientService->deletePatient($id);

        return redirect()->route('patients.index')->with('success', 'Patient deleted successfully');
    }

    public function restore(string $id)
    {
        $this->patientService->restorePatient($id);

        return redirect()->route('patients.index')->with('success', 'Patient restored successfully');
    }
}
