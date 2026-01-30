<?php

namespace App\Services;

use App\Models\LabService;

class LabServiceService
{
    public function searchLabServices($query)
    {
        return LabService::where('name', 'like', "%{$query}%")
            ->orWhere('code', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->with(['labServiceCategory', 'sampleType'])
            ->paginate(10);
    }

    public function getAllLabServices()
    {
        return LabService::active()->with(['labServiceCategory', 'sampleType'])->paginate(10);
    }

    public function getActiveLabServices()
    {
        return LabService::active()->with(['labServiceCategory', 'sampleType'])->paginate(10);
    }

    public function getLabServicesByCategory($categoryId)
    {
        return LabService::byCategory($categoryId)
            ->active()
            ->with(['labServiceCategory', 'sampleType'])
            ->paginate(10);
    }

    public function getLabServiceById($id)
    {
        return LabService::with(['labServiceCategory', 'sampleType', 'resultOptions'])->find($id);
    }

    public function getLabServiceByCode($code)
    {
        return LabService::where('code', $code)->with(['labServiceCategory', 'sampleType'])->first();
    }

    public function createLabService(array $data): LabService
    {
        return LabService::create($data);
    }

    public function updateLabService(string $id, array $data): LabService
    {
        $labService = LabService::findOrFail($id);
        $labService->update($data);

        return $labService;
    }

    public function deleteLabService(string $id): void
    {
        LabService::findOrFail($id)->delete();
    }

    public function restoreLabService(string $id): void
    {
        LabService::withTrashed()->findOrFail($id)->restore();
    }

    public function getTrashedLabServices()
    {
        return LabService::onlyTrashed()->get();
    }

    public function toggleActiveStatus(string $id): LabService
    {
        $labService = LabService::findOrFail($id);
        $labService->is_active = ! $labService->is_active;
        $labService->save();

        return $labService;
    }
}
