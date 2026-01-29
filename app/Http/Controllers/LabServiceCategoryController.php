<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Services\LabServiceCategoryService;
use App\Http\Requests\LabServiceCategoryRequest;
use Illuminate\Http\RedirectResponse;

class LabServiceCategoryController extends Controller
{
    public function __construct(
        protected LabServiceCategoryService $labServiceCategoryService
    ) {}

    public function index()
    {
        $search = request()->get('search');
        $activeOnly = request()->boolean('active_only');

        if (!empty($search)) {
            $labServiceCategories = $this->labServiceCategoryService->searchLabServiceCategories($search);
        } else {
            $labServiceCategories = $activeOnly
                ? $this->labServiceCategoryService->getActiveLabServiceCategories()
                : $this->labServiceCategoryService->getAllLabServiceCategories();
        }

        if (request()->wantsJson()) {
            return response()->json($labServiceCategories);
        }

        return Inertia::render('LabServiceCategories/Index', [
            'labServiceCategories' => $labServiceCategories,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('LabServiceCategories/Create');
    }

    public function store(LabServiceCategoryRequest $request): RedirectResponse
    {
        $this->labServiceCategoryService->createLabServiceCategory($request->validated());

        return redirect()
            ->route('lab-service-categories.index')
            ->with('success', 'Lab Service Category created successfully');
    }

    public function edit(string $id)
    {
        $labServiceCategory = $this->labServiceCategoryService->getLabServiceCategoryById($id);

        return Inertia::render('LabServiceCategories/Edit', [
            'labServiceCategory' => $labServiceCategory,
        ]);
    }

    public function update(LabServiceCategoryRequest $request, string $id): RedirectResponse
    {
        $this->labServiceCategoryService->updateLabServiceCategory($id, $request->validated());

        return redirect()
            ->route('lab-service-categories.index')
            ->with('success', 'Lab Service Category updated successfully');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->labServiceCategoryService->deleteLabServiceCategory($id);

        return back()->with('success', 'Lab Service Category deleted successfully');
    }

    public function restore(string $id): RedirectResponse
    {
        $this->labServiceCategoryService->restoreLabServiceCategory($id);

        return back()->with('success', 'Lab Service Category restored successfully');
    }

    public function toggleActive(string $id): RedirectResponse
    {
        $labServiceCategory = $this->labServiceCategoryService->toggleActiveStatus($id);
        $status = $labServiceCategory->is_active ? 'activated' : 'deactivated';

        return redirect()
            ->route('lab-service-categories.index')
            ->with('success', "Lab Service Category {$status} successfully");
    }
}
