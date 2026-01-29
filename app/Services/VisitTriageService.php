<?php

namespace App\Services;

use App\Models\PatientVisit;
use App\Models\VisitStatus;
use App\Models\VisitTriage;

class VisitTriageService
{
    public function getTriageQueue(?string $search = null)
    {
        $triagedStatus = VisitStatus::where('code', 'TRI')->first();
        $registeredStatus = VisitStatus::where('code', 'REG')->first();

        return PatientVisit::with(['patient', 'status', 'assignedClinic'])
            ->when($registeredStatus, fn ($query) => $query->where('status_id', $registeredStatus->id))
            ->when(!$registeredStatus && $triagedStatus, fn ($query) => $query->where('status_id', '<>', $triagedStatus->id))
            ->when($search, function ($query, $search) {
                $query->where('visit_number', 'like', "%{$search}%")
                    ->orWhereHas('patient', function ($patientQuery) use ($search) {
                        $patientQuery->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%");
                    });
            })
            ->orderedByPriority()
            ->ordered()
            ->get();
    }

    public function getTriageRecords()
    {
        return VisitTriage::with(['visit.patient', 'visit.status', 'triagedBy'])
            ->latest('triage_at')
            ->paginate(10);
    }

    public function getTriageById(string $id)
    {
        return VisitTriage::with(['visit.patient', 'triagedBy'])->find($id);
    }

    public function createTriage(array $data): VisitTriage
    {
        $triage = VisitTriage::create($data);

        $triagedStatus = VisitStatus::where('code', 'TRI')->first();
        if ($triagedStatus) {
            PatientVisit::where('id', $triage->visit_id)
                ->update(['status_id' => $triagedStatus->id]);
        }

        return $triage;
    }

    public function updateTriage(string $id, array $data): VisitTriage
    {
        $triage = VisitTriage::findOrFail($id);
        $triage->update($data);
        return $triage;
    }

    public function deleteTriage(string $id): void
    {
        VisitTriage::findOrFail($id)->delete();
    }
}
