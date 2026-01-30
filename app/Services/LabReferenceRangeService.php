<?php

namespace App\Services;

use App\Models\LabReferenceRange;

class LabReferenceRangeService
{
    public function getAllLabReferenceRanges()
    {
        return LabReferenceRange::with('labResultParameter')->paginate(10);
    }

    public function getLabReferenceRangesByParameter($parameterId)
    {
        return LabReferenceRange::where('lab_result_parameter_id', $parameterId)
            ->with('labResultParameter')
            ->get();
    }

    public function getLabReferenceRangeById($id)
    {
        return LabReferenceRange::with('labResultParameter')->findOrFail($id);
    }

    public function createLabReferenceRange(array $data): LabReferenceRange
    {
        return LabReferenceRange::create($data);
    }

    public function updateLabReferenceRange(string $id, array $data): LabReferenceRange
    {
        $labReferenceRange = LabReferenceRange::findOrFail($id);
        $labReferenceRange->update($data);

        return $labReferenceRange;
    }

    public function deleteLabReferenceRange(string $id): void
    {
        LabReferenceRange::findOrFail($id)->delete();
    }
}
