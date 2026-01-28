<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Services\AllergyService;
use App\Http\Requests\AllergyRequest;
use Illuminate\Http\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;

class AllergyController extends Controller
{
    public function __construct(
        protected AllergyService $allergyService
    ) {}

    public function index(Request $request)
    {
        $search = $request->get('search');

        if (!empty($search)) {
            $allergies = $this->allergyService->searchAllergies($search);
        } else {
            $allergies = $this->allergyService->getAllAllergies();
        }

        return Inertia::render('Allergy/Index', [
            'allergies' => $allergies,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Allergy/Create');
    }

    public function store(AllergyRequest $request): RedirectResponse
    {
        $this->allergyService->createAllergy($request->validated());

        return redirect()
            ->route('allergies.index')
            ->with('success', 'Allergy created successfully');
    }

    public function edit(string $id)
    {
        $allergy = $this->allergyService->getAllergyById($id);

        return Inertia::render('Allergy/Edit', [
            'allergy' => $allergy,
        ]);
    }

    public function update(AllergyRequest $request, string $id): RedirectResponse
    {
        $this->allergyService->updateAllergy($id, $request->validated());

        return back()->with('success', 'Allergy updated successfully');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->allergyService->deleteAllergy($id);

        return back()->with('success', 'Allergy deleted successfully');
    }

    public function restore(string $id): RedirectResponse
    {
        $this->allergyService->restoreAllergy($id);

        return back()->with('success', 'Allergy restored successfully');
    }
}
