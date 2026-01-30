<?php

namespace App\Services;

use App\Models\LabSample;

class LabSampleService
{
    public function searchLabSamples($query = null, $status = 'all')
    {
        $samples = LabSample::with([
            'visitOrderItem.service',
            'visitOrderItem.order.visit.patient',
            'sampleType',
            'collectedBy',
            'receivedBy',
        ]);

        // Apply search filter
        if (! empty($query)) {
            $samples = $samples->where(function ($q) use ($query) {
                $q->where('sample_number', 'like', "%{$query}%")
                    ->orWhereHas('sampleType', function ($subQ) use ($query) {
                        $subQ->where('name', 'like', "%{$query}%")
                            ->orWhere('code', 'like', "%{$query}%");
                    })
                    ->orWhereHas('visitOrderItem.service', function ($subQ) use ($query) {
                        $subQ->where('name', 'like', "%{$query}%")
                            ->orWhere('code', 'like', "%{$query}%");
                    })
                    ->orWhereHas('visitOrderItem.order.visit.patient', function ($subQ) use ($query) {
                        $subQ->where('name', 'like', "%{$query}%");
                    });
            });
        }

        // Apply status filter
        if ($status !== 'all') {
            $samples = $samples->where('status', $status);
        }

        return $samples->latest('collected_at')->paginate(10);
    }

    public function getAllLabSamples()
    {
        return LabSample::with(['visitOrderItem', 'sampleType', 'collectedBy', 'receivedBy'])
            ->latest()
            ->paginate(10);
    }

    public function getLabSampleById($id)
    {
        return LabSample::with(['visitOrderItem', 'sampleType', 'collectedBy', 'receivedBy'])->find($id);
    }

    public function getLabSampleByNumber($sampleNumber)
    {
        return LabSample::where('sample_number', $sampleNumber)
            ->with(['visitOrderItem', 'sampleType', 'collectedBy', 'receivedBy'])
            ->first();
    }

    public function createLabSample(array $data): LabSample
    {
        $data['sample_number'] = $this->generateSampleNumber();

        return LabSample::create($data);
    }

    public function updateLabSample(string $id, array $data): LabSample
    {
        $labSample = LabSample::findOrFail($id);
        $labSample->update($data);

        return $labSample;
    }

    public function deleteLabSample(string $id): void
    {
        LabSample::findOrFail($id)->delete();
    }

    public function restoreLabSample(string $id): void
    {
        LabSample::withTrashed()->findOrFail($id)->restore();
    }

    public function getTrashedLabSamples()
    {
        return LabSample::onlyTrashed()->get();
    }

    public function collectSample(array $data): LabSample
    {
        $data['status'] = 'collected';
        $data['collected_at'] = now();

        return $this->createLabSample($data);
    }

    public function receiveSample(string $id, int $receivedBy): LabSample
    {
        $labSample = LabSample::findOrFail($id);
        $labSample->update([
            'status' => 'received',
            'received_by' => $receivedBy,
            'received_at' => now(),
        ]);

        return $labSample;
    }

    public function rejectSample(string $id, string $reason): LabSample
    {
        $labSample = LabSample::findOrFail($id);
        $labSample->update([
            'status' => 'rejected',
            'rejection_reason' => $reason,
        ]);

        return $labSample;
    }

    private function generateSampleNumber(): string
    {
        $prefix = 'SMP';
        $date = now()->format('Ymd');
        $last = LabSample::where('sample_number', 'like', "{$prefix}{$date}%")
            ->orderBy('sample_number', 'desc')
            ->value('sample_number');
        $sequence = $last ? (int) substr($last, -4) + 1 : 1;

        return $prefix.$date.str_pad($sequence, 4, '0', STR_PAD_LEFT);
    }
}
