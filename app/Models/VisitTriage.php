<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisitTriage extends Model
{
    /** @use HasFactory<\Database\Factories\VisitTriageFactory> */
    use HasFactory;

    protected $table = 'visit_triage';

    protected $fillable = [
        'visit_id',
        'vitals_json',
        'triage_notes',
        'triage_by',
        'triage_at',
    ];

    protected $casts = [
        'vitals_json' => 'array',
        'triage_at' => 'datetime',
    ];

    public function visit()
    {
        return $this->belongsTo(PatientVisit::class, 'visit_id');
    }

    public function triagedBy()
    {
        return $this->belongsTo(User::class, 'triage_by');
    }
}
