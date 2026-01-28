<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use App\Services\DoctorWorkingHourService;
use App\Http\Requests\StoreDoctorWorkingHourRequest;
use App\Http\Requests\UpdateDoctorWorkingHourRequest;

class DoctorWorkingHourController extends Controller
{
    public function __construct(
        protected DoctorWorkingHourService $doctorWorkingHourService
    ) {}

    public function index(Request $request)
    {
        $doctorId = $request->get('doctor_id');

        $workingHours = $this->doctorWorkingHourService->getDoctorsWithWorkingHours($doctorId);
        $doctors = User::role('doctor')->select('id', 'name')->orderBy('name')->get();

        return Inertia::render('DoctorWorkingHours/Index', [
            'workingHours' => $workingHours,
            'doctors' => $doctors,
            'filters' => [
                'doctor_id' => $doctorId,
            ],
            'days' => $this->dayOptions(),
        ]);
    }

    public function create()
    {
        $doctors = User::role('doctor')->select('id', 'name')->orderBy('name')->get();

        return Inertia::render('DoctorWorkingHours/Create', [
            'doctors' => $doctors,
            'days' => $this->dayOptions(),
        ]);
    }

    public function store(StoreDoctorWorkingHourRequest $request): RedirectResponse
    {
        $this->doctorWorkingHourService->createWorkingHour($request->validated());

        return redirect()
            ->route('doctor-working-hours.index')
            ->with('success', 'Working hours created successfully.');
    }

    public function edit(string $id)
    {
        $workingHour = $this->doctorWorkingHourService->getWorkingHourById($id);
        $doctors = User::role('doctor')->select('id', 'name')->orderBy('name')->get();

        return Inertia::render('DoctorWorkingHours/Edit', [
            'workingHour' => $workingHour,
            'doctors' => $doctors,
            'days' => $this->dayOptions(),
        ]);
    }

    public function update(UpdateDoctorWorkingHourRequest $request, string $id): RedirectResponse
    {
        $this->doctorWorkingHourService->updateWorkingHour($id, $request->validated());

        return redirect()
            ->route('doctor-working-hours.index')
            ->with('success', 'Working hours updated successfully.');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->doctorWorkingHourService->deleteWorkingHour($id);

        return back()->with('success', 'Working hours deleted successfully.');
    }

    private function dayOptions(): array
    {
        return [
            ['value' => 0, 'label' => 'Sunday'],
            ['value' => 1, 'label' => 'Monday'],
            ['value' => 2, 'label' => 'Tuesday'],
            ['value' => 3, 'label' => 'Wednesday'],
            ['value' => 4, 'label' => 'Thursday'],
            ['value' => 5, 'label' => 'Friday'],
            ['value' => 6, 'label' => 'Saturday'],
        ];
    }
}
