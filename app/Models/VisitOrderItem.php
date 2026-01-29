<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisitOrderItem extends Model
{
    /** @use HasFactory<\Database\Factories\VisitOrderItemFactory> */
    use HasFactory;

    protected $fillable = [
        'visit_order_id',
        'service_id',
        'qty',
        'price',
    ];

    protected $casts = [
        'qty' => 'integer',
        'price' => 'decimal:2',
    ];

    public function order()
    {
        return $this->belongsTo(VisitOrder::class, 'visit_order_id');
    }

    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id');
    }
}
