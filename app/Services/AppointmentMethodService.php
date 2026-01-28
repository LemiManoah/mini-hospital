<?php

namespace App\Services;

use App\Models\AppointmentMethod;
use Illuminate\Database\Eloquent\Collection;

class AppointmentMethodService
{
    public function getAllMethods(): Collection
    {
        return AppointmentMethod::orderBy('name')->get();
    }

    public function createMethod(array $data): AppointmentMethod
    {
        return AppointmentMethod::create($data);
    }

    public function updateMethod(AppointmentMethod $method, array $data): AppointmentMethod
    {
        $method->update($data);
        return $method;
    }

    public function deleteMethod(AppointmentMethod $method): void
    {
        $method->delete();
    }
}
