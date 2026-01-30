<?php

namespace App\Services;

use App\Models\LabResultParameter;

class LabResultParameterService
{
    public function getAllLabResultParameters()
    {
        return LabResultParameter::with(['labService', 'referenceRanges'])->ordered()->paginate(10);
    }

    public function getLabResultParametersByService($labServiceId)
    {
        return LabResultParameter::where('lab_service_id', $labServiceId)
            ->ordered()
            ->with('referenceRanges')
            ->get();
    }

    public function getLabResultParameterById($id)
    {
        return LabResultParameter::with(['labService', 'referenceRanges'])->findOrFail($id);
    }

    public function createLabResultParameter(array $data): LabResultParameter
    {
        return LabResultParameter::create($data);
    }

    public function updateLabResultParameter(string $id, array $data): LabResultParameter
    {
        $labResultParameter = LabResultParameter::findOrFail($id);
        $labResultParameter->update($data);

        return $labResultParameter;
    }

    public function deleteLabResultParameter(string $id): void
    {
        LabResultParameter::findOrFail($id)->delete();
    }
}
