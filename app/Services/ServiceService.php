<?php

namespace App\Services;

use App\Models\Service;
use Illuminate\Database\Eloquent\Collection;

class ServiceService
{
    public function getAllServices(): Collection
    {
        return Service::with('serviceType')->get();
    }

    public function createService(array $data): Service
    {
        return Service::create($data);
    }

    public function getServiceById(string $id): Service
    {
        return Service::with('serviceType')->findOrFail($id);
    }

    public function updateService(Service $service, array $data): Service
    {
        $service->update($data);

        return $service;
    }

    public function deleteService(Service $service): void
    {
        $service->delete();
    }
}
