<?php

namespace App\Services;

use App\Models\PatientVisit;
use App\Models\VisitNote;
use App\Models\VisitStatus;

class VisitNoteService
{
    public function getConsultationQueue(?string $search = null)
    {
        $triagedStatus = VisitStatus::where('code', 'TRI')->first();
        $consultationStatus = VisitStatus::where('code', 'CON')->first();

        return PatientVisit::with(['patient', 'status', 'assignedClinic', 'assignedDoctor'])
            ->when($triagedStatus, function ($query) use ($triagedStatus, $consultationStatus) {
                $query->where('status_id', $triagedStatus->id);
                if ($consultationStatus) {
                    $query->orWhere('status_id', $consultationStatus->id);
                }
            })
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

    public function getConsultationNotes()
    {
        return VisitNote::with(['visit.patient', 'doctor'])
            ->latest()
            ->paginate(10);
    }

    public function getVisitNoteById(string $id)
    {
        return VisitNote::with(['visit.patient', 'doctor'])->find($id);
    }

    public function createVisitNote(array $data): VisitNote
    {
        $note = VisitNote::create($data);

        $consultationStatus = VisitStatus::where('code', 'CON')->first();
        if ($consultationStatus) {
            PatientVisit::where('id', $note->visit_id)
                ->update(['status_id' => $consultationStatus->id]);
        }

        return $note;
    }

    public function updateVisitNote(string $id, array $data): VisitNote
    {
        $note = VisitNote::findOrFail($id);
        $note->update($data);
        return $note;
    }

    public function deleteVisitNote(string $id): void
    {
        VisitNote::findOrFail($id)->delete();
    }
}
