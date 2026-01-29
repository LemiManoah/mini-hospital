<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisitPrescriptionItem extends Model
{
    /** @use HasFactory<\Database\Factories\VisitPrescriptionItemFactory> */
    use HasFactory;

    protected $fillable = [
        'visit_prescription_id',
        'drug_id',
        'dosage',
        'frequency',
        'duration_days',
        'qty',
        'price',
        'external_purchase',
    ];

    protected $casts = [
        'duration_days' => 'integer',
        'qty' => 'integer',
        'price' => 'decimal:2',
        'external_purchase' => 'boolean',
    ];

    public function prescription()
    {
        return $this->belongsTo(VisitPrescription::class, 'visit_prescription_id');
    }
}
