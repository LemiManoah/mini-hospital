<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\AppointmentCategory;
use App\Services\AppointmentCategoryService;
use App\Http\Requests\StoreAppointmentCategoryRequest;
use App\Http\Requests\UpdateAppointmentCategoryRequest;

class AppointmentCategoryController extends Controller
{
    public function __construct(private readonly AppointmentCategoryService $appointmentCategoryService)
    {
    }

    public function index()
    {
        return Inertia::render('AppointmentCategories/Index', [
            'categories' => $this->appointmentCategoryService->getAllCategories(),
        ]);
    }

    public function create()
    {
        return Inertia::render('AppointmentCategories/Create');
    }

    public function store(StoreAppointmentCategoryRequest $request)
    {
        $this->appointmentCategoryService->createCategory($request->validated());

        return redirect()->route('appointment-categories.index');
    }

    public function show(AppointmentCategory $appointmentCategory)
    {
        return Inertia::render('AppointmentCategories/Show', [
            'category' => $appointmentCategory,
        ]);
    }

    public function edit(AppointmentCategory $appointmentCategory)
    {
        return Inertia::render('AppointmentCategories/Edit', [
            'category' => $appointmentCategory,
        ]);
    }

    public function update(UpdateAppointmentCategoryRequest $request, AppointmentCategory $appointmentCategory)
    {
        $this->appointmentCategoryService->updateCategory($appointmentCategory, $request->validated());

        return redirect()->route('appointment-categories.index');
    }

    public function destroy(AppointmentCategory $appointmentCategory)
    {
        $this->appointmentCategoryService->deleteCategory($appointmentCategory);

        return redirect()->route('appointment-categories.index');
    }
}
