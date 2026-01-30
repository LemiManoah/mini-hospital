<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VisitOrder extends Model
{
    /** @use HasFactory<\Database\Factories\VisitOrderFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'visit_id',
        'ordered_by',
        'order_type',
        'order_number',
        'status',
        'priority',
        'clinical_notes',
        'doctor_instructions',
        'requested_at',
        'started_processing_at',
        'completed_at',
        'cancelled_at',
        'cancellation_reason',
        'cancelled_by',
    ];

    protected $casts = [
        'requested_at' => 'datetime',
        'started_processing_at' => 'datetime',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public function visit()
    {
        return $this->belongsTo(PatientVisit::class, 'visit_id');
    }

    public function orderedBy()
    {
        return $this->belongsTo(User::class, 'ordered_by');
    }

    public function cancelledBy()
    {
        return $this->belongsTo(User::class, 'cancelled_by');
    }

    public function items()
    {
        return $this->hasMany(VisitOrderItem::class, 'visit_order_id');
    }

    public function results()
    {
        return $this->hasMany(VisitResult::class, 'visit_order_id');
    }
}
