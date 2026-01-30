<?php

namespace App\Http\Controllers;

use App\Http\Requests\LabResultOptionRequest;
use App\Services\LabResultOptionService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class LabResultOptionController extends Controller
{
    public function __construct(
        protected LabResultOptionService $labResultOptionService
    ) {}

    public function index()
    {
        $search = request()->get('search');

        $query = \App\Models\LabService::query()
            ->with([
                'labResultType',
                'resultOptions' => function ($q) {
                    $q->ordered();
                },
                'resultParameters' => function ($q) {
                    $q->ordered()->with('referenceRanges');
                },
            ]);

        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $labServices = $query->orderBy('name')->get();

        return Inertia::render('LabResultOptions/Index', [
            'labServices' => $labServices,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        $services = \App\Models\LabService::active()->get(['id', 'name', 'code']);

        return Inertia::render('LabResultOptions/Create', [
            'services' => $services,
        ]);
    }

    public function store(LabResultOptionRequest $request): RedirectResponse
    {
        $this->labResultOptionService->createLabResultOption($request->validated());

        return redirect()
            ->route('lab-result-options.index')
            ->with('success', 'Lab Result Option created successfully');
    }

    public function edit(string $id)
    {
        $labResultOption = $this->labResultOptionService->getLabResultOptionById($id);
        $services = \App\Models\LabService::active()->get(['id', 'name', 'code']);

        return Inertia::render('LabResultOptions/Edit', [
            'labResultOption' => $labResultOption,
            'services' => $services,
        ]);
    }

    public function update(LabResultOptionRequest $request, string $id): RedirectResponse
    {
        $this->labResultOptionService->updateLabResultOption($id, $request->validated());

        return redirect()
            ->route('lab-result-options.index')
            ->with('success', 'Lab Result Option updated successfully');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->labResultOptionService->deleteLabResultOption($id);

        return back()->with('success', 'Lab Result Option deleted successfully');
    }

    public function restore(string $id): RedirectResponse
    {
        $this->labResultOptionService->restoreLabResultOption($id);

        return back()->with('success', 'Lab Result Option restored successfully');
    }
}
