<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Services\LabSampleService;
use App\Http\Requests\LabSampleRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LabSampleController extends Controller
{
    public function __construct(
        protected LabSampleService $labSampleService
    ) {}

    public function index()
    {
        $search = request()->get('search');
        $status = request()->get('status');

        if (!empty($search) || !empty($status)) {
            $labSamples = $this->labSampleService->searchLabSamples($search);
            if ($status) {
                $labSamples = $labSamples->where('status', $status);
            }
        } else {
            $labSamples = $this->labSampleService->getAllLabSamples();
        }

        return Inertia::render('LabSamples/Index', [
            'labSamples' => $labSamples,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('LabSamples/Create');
    }

    public function store(LabSampleRequest $request): RedirectResponse
    {
        $this->labSampleService->createLabSample($request->validated());

        return redirect()
            ->route('lab-samples.index')
            ->with('success', 'Lab Sample created successfully');
    }

    public function show(string $id)
    {
        $labSample = $this->labSampleService->getLabSampleById($id);

        return Inertia::render('LabSamples/Show', [
            'labSample' => $labSample,
        ]);
    }

    public function edit(string $id)
    {
        $labSample = $this->labSampleService->getLabSampleById($id);

        return Inertia::render('LabSamples/Edit', [
            'labSample' => $labSample,
        ]);
    }

    public function update(LabSampleRequest $request, string $id): RedirectResponse
    {
        $this->labSampleService->updateLabSample($id, $request->validated());

        return redirect()
            ->route('lab-samples.index')
            ->with('success', 'Lab Sample updated successfully');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->labSampleService->deleteLabSample($id);

        return back()->with('success', 'Lab Sample deleted successfully');
    }

    public function restore(string $id): RedirectResponse
    {
        $this->labSampleService->restoreLabSample($id);

        return back()->with('success', 'Lab Sample restored successfully');
    }

    public function collect(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'visit_order_item_id' => 'required|exists:visit_order_items,id',
            'sample_type_id' => 'required|exists:lab_sample_types,id',
            'container' => 'nullable|string|max:100',
            'volume' => 'nullable|string|max:50',
        ]);

        $this->labSampleService->collectSample([
            ...$validated,
            'collected_by' => Auth::id(),
        ]);

        return back()->with('success', 'Sample collected successfully');
    }

    public function receive(string $id): RedirectResponse
    {
        $this->labSampleService->receiveSample($id, Auth::id());

        return back()->with('success', 'Sample received successfully');
    }

    public function reject(Request $request, string $id): RedirectResponse
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ]);

        $this->labSampleService->rejectSample($id, $validated['rejection_reason']);

        return back()->with('success', 'Sample rejected');
    }
}
