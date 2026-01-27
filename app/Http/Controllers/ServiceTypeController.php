<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceTypeRequest;
use App\Http\Requests\UpdateServiceTypeRequest;
use App\Models\ServiceType;
use App\Services\ServiceTypeService;
use Inertia\Inertia;

class ServiceTypeController extends Controller
{
    public function __construct(private readonly ServiceTypeService $serviceTypeService)
    {
        $this->authorizeResource(ServiceType::class, 'service_type');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('ServiceTypes/Index', [
            'serviceTypes' => $this->serviceTypeService->getAllServiceTypes(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('ServiceTypes/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreServiceTypeRequest $request)
    {
        $this->serviceTypeService->createServiceType($request->validated());

        return redirect()->route('service-types.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(ServiceType $serviceType)
    {
        return Inertia::render('ServiceTypes/Show', [
            'serviceType' => $serviceType,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ServiceType $serviceType)
    {
        return Inertia::render('ServiceTypes/Edit', [
            'serviceType' => $serviceType,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateServiceTypeRequest $request, ServiceType $serviceType)
    {
        $this->serviceTypeService->updateServiceType($serviceType, $request->validated());

        return redirect()->route('service-types.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ServiceType $serviceType)
    {
        $this->serviceTypeService->deleteServiceType($serviceType);

        return redirect()->route('service-types.index');
    }
}
