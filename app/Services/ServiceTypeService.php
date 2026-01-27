<?php

namespace App\Services;

use App\Models\ServiceType;
use Illuminate\Database\Eloquent\Collection;

class ServiceTypeService
{
    public function getAllServiceTypes(): Collection
    {
        return ServiceType::all();
    }

    public function createServiceType(array $data): ServiceType
    {
        return ServiceType::create($data);
    }

    public function getServiceTypeById(string $id): ServiceType
    {
        return ServiceType::findOrFail($id);
    }

    public function updateServiceType(ServiceType $serviceType, array $data): ServiceType
    {
        $serviceType->update($data);

        return $serviceType;
    }

    public function deleteServiceType(ServiceType $serviceType): void
    {
        $serviceType->delete();
    }
}
