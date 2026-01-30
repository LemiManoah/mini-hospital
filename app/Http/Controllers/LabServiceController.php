<?php

namespace App\Http\Controllers;

use App\Http\Requests\LabServiceRequest;
use App\Services\LabSampleTypeService;
use App\Services\LabServiceCategoryService;
use App\Services\LabServiceService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class LabServiceController extends Controller
{
    public function __construct(
        protected LabServiceService $labServiceService,
        protected LabServiceCategoryService $labServiceCategoryService,
        protected LabSampleTypeService $labSampleTypeService
    ) {}

    public function index()
    {
        $search = request()->get('search');
        $category = request()->get('category');

        if (! empty($search) || ! empty($category)) {
            $labServices = $this->labServiceService->searchLabServices($search);
            if ($category) {
                $labServices = $labServices->where('lab_service_category_id', $category);
            }
            $labServices = $labServices->paginate(10)->withQueryString();
        } elseif ($category) {
            $labServices = $this->labServiceService->getLabServicesByCategory($category);
        } else {
            $labServices = $this->labServiceService->getAllLabServices();
        }

        $categories = $this->labServiceCategoryService->getActiveLabServiceCategories();

        if (request()->wantsJson()) {
            // Load sample type relationship for consultation panel
            if (method_exists($labServices, 'items')) {
                // It's a paginated collection
                $labServices->getCollection()->load('sampleType');
            } else {
                // It's a regular collection
                $labServices->load('sampleType');
            }

            // Format the response for the consultation panel
            return response()->json([
                'data' => $labServices->items() ?? $labServices,
            ]);
        }

        return Inertia::render('LabServices/Index', [
            'labServices' => $labServices,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'category' => $category,
            ],
        ]);
    }

    public function create()
    {
        $categories = $this->labServiceCategoryService->getActiveLabServiceCategories();
        $sampleTypes = $this->labSampleTypeService->getActiveLabSampleTypes();

        return Inertia::render('LabServices/Create', [
            'categories' => $categories->items(),
            'sampleTypes' => $sampleTypes->items(),
        ]);
    }

    public function store(LabServiceRequest $request): RedirectResponse
    {
        $this->labServiceService->createLabService($request->validated());

        return redirect()
            ->route('lab-services.index')
            ->with('success', 'Lab Service created successfully');
    }

    public function edit(string $id)
    {
        $labService = $this->labServiceService->getLabServiceById($id);
        $categories = $this->labServiceCategoryService->getActiveLabServiceCategories();
        $sampleTypes = $this->labSampleTypeService->getActiveLabSampleTypes();

        return Inertia::render('LabServices/Edit', [
            'labService' => $labService,
            'categories' => $categories->items(),
            'sampleTypes' => $sampleTypes->items(),
        ]);
    }

    public function update(LabServiceRequest $request, string $id): RedirectResponse
    {
        $this->labServiceService->updateLabService($id, $request->validated());

        return redirect()
            ->route('lab-services.index')
            ->with('success', 'Lab Service updated successfully');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->labServiceService->deleteLabService($id);

        return back()->with('success', 'Lab Service deleted successfully');
    }

    public function restore(string $id): RedirectResponse
    {
        $this->labServiceService->restoreLabService($id);

        return back()->with('success', 'Lab Service restored successfully');
    }

    public function toggleActive(string $id): RedirectResponse
    {
        $labService = $this->labServiceService->toggleActiveStatus($id);
        $status = $labService->is_active ? 'activated' : 'deactivated';

        return redirect()
            ->route('lab-services.index')
            ->with('success', "Lab Service {$status} successfully");
    }
}
