<?php

namespace App\Services;
use App\Models\PatientVisit;

class PatientVisitService
{
    public function searchPatientVisits($query)
    {
        return PatientVisit::where('visit_number', 'like', "%$query%")
            ->orWhereHas('patient', function ($q) use ($query) {
                $q->where('first_name', 'like', "%$query%")
                  ->orWhere('last_name', 'like', "%$query%");
            })
            ->orWhereHas('visitType', function ($q) use ($query) {
                $q->where('name', 'like', "%$query%");
            });
    }

    public function getAllPatientVisits()
    {
        return PatientVisit::with(['patient', 'visitType', 'status', 'assignedClinic', 'assignedDoctor'])
                           ->ordered()
                           ->paginate(15);
    }

    public function getTodayVisits()
    {
        return PatientVisit::with(['patient', 'visitType', 'status', 'assignedClinic', 'assignedDoctor'])
                           ->today()
                           ->orderedByPriority()
                           ->paginate(15);
    }

    public function getUpcomingVisits()
    {
        return PatientVisit::with(['patient', 'visitType', 'status', 'assignedClinic', 'assignedDoctor'])
                           ->upcoming()
                           ->ordered()
                           ->paginate(15);
    }

    public function getPastVisits()
    {
        return PatientVisit::with(['patient', 'visitType', 'status', 'assignedClinic', 'assignedDoctor'])
                           ->past()
                           ->ordered()
                           ->paginate(15);
    }

    public function getActiveVisits()
    {
        return PatientVisit::with(['patient', 'visitType', 'status', 'assignedClinic', 'assignedDoctor'])
                           ->active()
                           ->orderedByPriority()
                           ->paginate(15);
    }

    public function getCompletedVisits()
    {
        return PatientVisit::with(['patient', 'visitType', 'status', 'assignedClinic', 'assignedDoctor'])
                           ->completed()
                           ->ordered()
                           ->paginate(15);
    }

    public function getPatientVisitsByPatient($patientId)
    {
        return PatientVisit::with(['visitType', 'status', 'assignedClinic', 'assignedDoctor'])
                           ->byPatient($patientId)
                           ->ordered()
                           ->paginate(15);
    }

    public function getPatientVisitById($id)
    {
        return PatientVisit::with(['patient', 'visitType', 'status', 'assignedClinic', 'assignedDoctor', 'createdByStaff'])
                           ->find($id);
    }

    public function getPatientVisitByNumber($visitNumber)
    {
        return PatientVisit::with(['patient', 'visitType', 'status', 'assignedClinic', 'assignedDoctor', 'createdByStaff'])
                           ->where('visit_number', $visitNumber)
                           ->first();
    }

    public function createPatientVisit(array $data): PatientVisit
    {
        // Auto-generate visit number if not provided
        if (!isset($data['visit_number'])) {
            $data['visit_number'] = PatientVisit::generateVisitNumber();
        }

        return PatientVisit::create($data);
    }

    public function updatePatientVisit(string $id, array $data): PatientVisit
    {
        $patientVisit = PatientVisit::findOrFail($id);
        $patientVisit->update($data);
        return $patientVisit;
    }

    public function deletePatientVisit(string $id): void
    {
        PatientVisit::findOrFail($id)->delete();
    }

    public function restorePatientVisit(string $id): void
    {
        PatientVisit::withTrashed()->findOrFail($id)->restore();
    }

    public function getTrashedPatientVisits()
    {
        return PatientVisit::onlyTrashed()->with(['patient', 'visitType', 'status'])->get();
    }

    public function updateVisitStatus(string $id, int $statusId): PatientVisit
    {
        $patientVisit = PatientVisit::findOrFail($id);
        $patientVisit->status_id = $statusId;
        $patientVisit->save();
        return $patientVisit;
    }

    public function assignDoctor(string $id, ?int $doctorId): PatientVisit
    {
        $patientVisit = PatientVisit::findOrFail($id);
        $patientVisit->assigned_doctor_id = $doctorId;
        $patientVisit->save();
        return $patientVisit;
    }

    public function assignClinic(string $id, ?int $clinicId): PatientVisit
    {
        $patientVisit = PatientVisit::findOrFail($id);
        $patientVisit->assigned_clinic_id = $clinicId;
        $patientVisit->save();
        return $patientVisit;
    }

    public function updatePriority(string $id, string $priority): PatientVisit
    {
        $patientVisit = PatientVisit::findOrFail($id);
        $patientVisit->priority_flag = $priority;
        $patientVisit->save();
        return $patientVisit;
    }

    public function rescheduleVisit(string $id, string $date, string $time): PatientVisit
    {
        $patientVisit = PatientVisit::findOrFail($id);
        $patientVisit->visit_date = $date;
        $patientVisit->visit_time = $time;
        $patientVisit->save();
        return $patientVisit;
    }

    public function getVisitStatistics()
    {
        $total = PatientVisit::count();
        $today = PatientVisit::today()->count();
        $upcoming = PatientVisit::upcoming()->count();
        $completed = PatientVisit::completed()->count();
        $active = PatientVisit::active()->count();
        $urgent = PatientVisit::byPriority('urgent')->count();

        return [
            'total' => $total,
            'today' => $today,
            'upcoming' => $upcoming,
            'completed' => $completed,
            'active' => $active,
            'urgent' => $urgent,
        ];
    }

    public function getVisitsByDateRange($startDate, $endDate)
    {
        return PatientVisit::with(['patient', 'visitType', 'status', 'assignedClinic', 'assignedDoctor'])
                           ->byDateRange($startDate, $endDate)
                           ->ordered()
                           ->paginate(15);
    }
}
