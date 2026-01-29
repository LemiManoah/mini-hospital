<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisitPrescription extends Model
{
    /** @use HasFactory<\Database\Factories\VisitPrescriptionFactory> */
    use HasFactory;

    protected $fillable = [
        'visit_id',
        'prescribed_by',
        'status',
    ];

    public function visit()
    {
        return $this->belongsTo(PatientVisit::class, 'visit_id');
    }

    public function prescribedBy()
    {
        return $this->belongsTo(User::class, 'prescribed_by');
    }

    public function items()
    {
        return $this->hasMany(VisitPrescriptionItem::class, 'visit_prescription_id');
    }
}
