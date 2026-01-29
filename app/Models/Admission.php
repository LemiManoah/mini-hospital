<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admission extends Model
{
    /** @use HasFactory<\Database\Factories\AdmissionFactory> */
    use HasFactory;

    protected $fillable = [
        'visit_id',
        'ward_id',
        'bed_id',
        'admitting_doctor_id',
        'admitted_at',
        'status',
    ];

    protected $casts = [
        'admitted_at' => 'datetime',
    ];

    public function visit()
    {
        return $this->belongsTo(PatientVisit::class, 'visit_id');
    }

    public function admittingDoctor()
    {
        return $this->belongsTo(User::class, 'admitting_doctor_id');
    }
}
