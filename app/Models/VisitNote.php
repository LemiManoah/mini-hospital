<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisitNote extends Model
{
    /** @use HasFactory<\Database\Factories\VisitNoteFactory> */
    use HasFactory;

    protected $fillable = [
        'visit_id',
        'doctor_id',
        'complaint',
        'examination',
        'provisional_diagnosis',
        'final_diagnosis',
        'plan',
    ];

    public function visit()
    {
        return $this->belongsTo(PatientVisit::class, 'visit_id');
    }

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }
}
