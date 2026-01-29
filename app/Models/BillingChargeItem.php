<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BillingChargeItem extends Model
{
    /** @use HasFactory<\Database\Factories\BillingChargeItemFactory> */
    use HasFactory;

    protected $fillable = [
        'visit_id',
        'item_type',
        'item_id',
        'qty',
        'unit_price',
        'total',
        'payer_type',
        'status',
    ];

    protected $casts = [
        'qty' => 'integer',
        'unit_price' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function visit()
    {
        return $this->belongsTo(PatientVisit::class, 'visit_id');
    }
}
