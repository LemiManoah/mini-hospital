<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PatientVisit extends Model
{
    /** @use HasFactory<\Database\Factories\PatientVisitFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'visit_number',
        'patient_id',
        'visit_type_id',
        'status_id',
        'assigned_clinic_id',
        'assigned_doctor_id',
        'created_by_staff_id',
        'visit_date',
        'visit_time',
        'priority_flag',
    ];

    protected $casts = [
        'visit_date' => 'date',
        'visit_time' => 'datetime:H:i:s',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function visitType()
    {
        return $this->belongsTo(VisitType::class);
    }

    public function status()
    {
        return $this->belongsTo(VisitStatus::class, 'status_id');
    }

    public function assignedClinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function assignedDoctor()
    {
        return $this->belongsTo(User::class, 'assigned_doctor_id');
    }

    public function createdByStaff()
    {
        return $this->belongsTo(User::class, 'created_by_staff_id');
    }

    public function getDisplayNameAttribute(): string
    {
        $patientName = $this->patient?->name ?? 'Unknown Patient';
        return "{$this->visit_number} - {$patientName} - " . $this->visit_date->format('d/m/Y');
    }

    public function getFullVisitDateTimeAttribute(): string
    {
        return $this->visit_date->format('d/m/Y') . ' ' . $this->visit_time->format('H:i');
    }

    public function scopeByPatient($query, $patientId)
    {
        return $query->where('patient_id', $patientId);
    }

    public function scopeByVisitType($query, $visitTypeId)
    {
        return $query->where('visit_type_id', $visitTypeId);
    }

    public function scopeByStatus($query, $statusId)
    {
        return $query->where('status_id', $statusId);
    }

    public function scopeByDate($query, $date)
    {
        return $query->where('visit_date', $date);
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('visit_date', [$startDate, $endDate]);
    }

    public function scopeByPriority($query, $priority)
    {
        return $query->where('priority_flag', $priority);
    }

    public function scopeToday($query)
    {
        return $query->where('visit_date', today());
    }

    public function scopeUpcoming($query)
    {
        return $query->where('visit_date', '>=', today());
    }

    public function scopePast($query)
    {
        return $query->where('visit_date', '<', today());
    }

    public function scopeActive($query)
    {
        return $query->whereHas('status', function ($q) {
            $q->where('is_terminal', false);
        });
    }

    public function scopeCompleted($query)
    {
        return $query->whereHas('status', function ($q) {
            $q->where('is_terminal', true);
        });
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('visit_date', 'desc')
                     ->orderBy('visit_time', 'desc');
    }

    public function scopeOrderedByPriority($query)
    {
        $priorityOrder = ['urgent' => 1, 'high' => 2, 'medium' => 3, 'low' => 4];
        return $query->orderByRaw("FIELD(priority_flag, 'urgent', 'high', 'medium', 'low')")
                     ->orderBy('visit_date')
                     ->orderBy('visit_time');
    }

    public static function generateVisitNumber(): string
    {
        $date = now()->format('Ymd');
        $lastVisit = static::where('visit_number', 'like', "V{$date}%")
                           ->orderBy('visit_number', 'desc')
                           ->first();
        
        if ($lastVisit) {
            $lastSequence = intval(substr($lastVisit->visit_number, -4));
            $newSequence = $lastSequence + 1;
        } else {
            $newSequence = 1;
        }
        
        return "V{$date}" . str_pad($newSequence, 4, '0', STR_PAD_LEFT);
    }
}
