<?php

namespace App\Services;

use App\Models\LabResultOption;
use App\Models\LabService;

class LabResultOptionService
{
    public function searchLabResultOptions($query)
    {
        return LabResultOption::query()
            ->where(function ($q) use ($query) {
                $q->where('option_name', 'like', "%{$query}%")
                    ->orWhere('option_code', 'like', "%{$query}%")
                    ->orWhere('symbol', 'like', "%{$query}%")
                    ->orWhereHas('labService', function ($serviceQ) use ($query) {
                        $serviceQ->where('name', 'like', "%{$query}%")
                            ->orWhere('code', 'like', "%{$query}%");
                    });
            })
            ->with(['labService', 'labResultType']);
    }

    public function getAllLabResultOptions()
    {
        return LabResultOption::with(['labService', 'labResultType'])->ordered()->paginate(10);
    }

    public function getLabResultOptionsByTest($labTestId)
    {
        return LabResultOption::where('lab_service_id', $labTestId)->ordered()->get();
    }

    public function getLabResultOptionById($id)
    {
        return LabResultOption::with(['labService', 'labResultType'])->find($id);
    }

    public function createLabResultOption(array $data): LabResultOption
    {
        if (empty($data['lab_result_type_id']) && ! empty($data['lab_service_id'])) {
            $service = LabService::find($data['lab_service_id']);
            if ($service?->lab_result_type_id) {
                $data['lab_result_type_id'] = $service->lab_result_type_id;
            }
        }

        return LabResultOption::create($data);
    }

    public function updateLabResultOption(string $id, array $data): LabResultOption
    {
        $labResultOption = LabResultOption::findOrFail($id);

        if (empty($data['lab_result_type_id']) && ! empty($data['lab_service_id'])) {
            $service = LabService::find($data['lab_service_id']);
            if ($service?->lab_result_type_id) {
                $data['lab_result_type_id'] = $service->lab_result_type_id;
            }
        }

        $labResultOption->update($data);

        return $labResultOption;
    }

    public function deleteLabResultOption(string $id): void
    {
        LabResultOption::findOrFail($id)->delete();
    }

    public function restoreLabResultOption(string $id): void
    {
        LabResultOption::withTrashed()->findOrFail($id)->restore();
    }

    public function getTrashedLabResultOptions()
    {
        return LabResultOption::onlyTrashed()->get();
    }

    public function reorderOptions(array $optionIds): void
    {
        foreach ($optionIds as $index => $id) {
            LabResultOption::where('id', $id)->update(['display_order' => $index]);
        }
    }
}
