<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\AppointmentMethod;
use App\Services\AppointmentMethodService;
use App\Http\Requests\StoreAppointmentMethodRequest;
use App\Http\Requests\UpdateAppointmentMethodRequest;

class AppointmentMethodController extends Controller
{
    public function __construct(private readonly AppointmentMethodService $appointmentMethodService)
    {
    }

    public function index()
    {
        return Inertia::render('AppointmentMethods/Index', [
            'methods' => $this->appointmentMethodService->getAllMethods(),
        ]);
    }

    public function create()
    {
        return Inertia::render('AppointmentMethods/Create');
    }

    public function store(StoreAppointmentMethodRequest $request)
    {
        $this->appointmentMethodService->createMethod($request->validated());

        return redirect()->route('appointment-methods.index');
    }

    public function show(AppointmentMethod $appointmentMethod)
    {
        return Inertia::render('AppointmentMethods/Show', [
            'method' => $appointmentMethod,
        ]);
    }

    public function edit(AppointmentMethod $appointmentMethod)
    {
        return Inertia::render('AppointmentMethods/Edit', [
            'method' => $appointmentMethod,
        ]);
    }

    public function update(UpdateAppointmentMethodRequest $request, AppointmentMethod $appointmentMethod)
    {
        $this->appointmentMethodService->updateMethod($appointmentMethod, $request->validated());

        return redirect()->route('appointment-methods.index');
    }

    public function destroy(AppointmentMethod $appointmentMethod)
    {
        $this->appointmentMethodService->deleteMethod($appointmentMethod);

        return redirect()->route('appointment-methods.index');
    }
}
