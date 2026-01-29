<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisitOrder extends Model
{
    /** @use HasFactory<\Database\Factories\VisitOrderFactory> */
    use HasFactory;

    protected $fillable = [
        'visit_id',
        'ordered_by',
        'order_type',
        'status',
    ];

    public function visit()
    {
        return $this->belongsTo(PatientVisit::class, 'visit_id');
    }

    public function orderedBy()
    {
        return $this->belongsTo(User::class, 'ordered_by');
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
