<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisitResult extends Model
{
    /** @use HasFactory<\Database\Factories\VisitResultFactory> */
    use HasFactory;

    protected $fillable = [
        'visit_order_id',
        'visit_order_item_id',
        'result_payload',
        'recorded_by',
        'verified_by',
        'verified_at',
    ];

    protected $casts = [
        'verified_at' => 'datetime',
        'result_payload' => 'array',
    ];

    public function order()
    {
        return $this->belongsTo(VisitOrder::class, 'visit_order_id');
    }

    public function item()
    {
        return $this->belongsTo(VisitOrderItem::class, 'visit_order_item_id');
    }

    public function recordedBy()
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    public function verifiedBy()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}
