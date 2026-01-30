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
        'item_type',
        'item_id',
        'qty',
        'price',
        'notes',
    ];

    protected $casts = [
        'qty' => 'integer',
        'price' => 'decimal:2',
    ];

    // Polymorphic relationship to different service types
    public function item()
    {
        return $this->morphTo('item', 'item_type', 'item_id');
    }

    // Specific relationships for convenience
    public function service()
    {
        return $this->belongsTo(Service::class, 'item_id');
    }

    public function labService()
    {
        return $this->belongsTo(LabService::class, 'item_id');
    }

    // Legacy relationship for backward compatibility
    public function order()
    {
        return $this->belongsTo(VisitOrder::class, 'visit_order_id');
    }

    public function labSample()
    {
        return $this->hasOne(LabSample::class, 'visit_order_item_id');
    }

    public function result()
    {
        return $this->hasOne(VisitResult::class, 'visit_order_item_id');
    }
}
