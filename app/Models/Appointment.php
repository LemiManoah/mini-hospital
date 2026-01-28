<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Enums\AppointmentStatus;


class Appointment extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'patient_id',
        'doctor_id',
        'appointment_date',
        'appointment_time',
        'status',
        'notes',
        'appointment_method_id',
        'appointment_category_id',
        'duration_minutes',
        'clinic_id',
        'service_id',
        'priority_flag',
        'cancellation_reason',
        'rescheduled_from_id',
        'confirmed_at',
        'checked_in_at',
        'completed_at',
        'virtual_link',
        'platform',
    ];

    /* Relationships */

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }
    public function method()
    {
        return $this->belongsTo(AppointmentMethod::class, 'appointment_method_id');
    }

    public function category()
    {
        return $this->belongsTo(AppointmentCategory::class, 'appointment_category_id');
    }

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function rescheduledFrom()
    {
        return $this->belongsTo(self::class, 'rescheduled_from_id');
    }
    protected $casts = [
        'appointment_date' => 'date',
        'appointment_time' => 'string',
        'status' => AppointmentStatus::class,
        'duration_minutes' => 'integer',
        'confirmed_at' => 'datetime',
        'checked_in_at' => 'datetime',
        'completed_at' => 'datetime',
    ];
}
