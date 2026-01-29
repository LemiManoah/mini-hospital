<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LabSample extends Model
{
    /** @use HasFactory<\Database\Factories\LabSampleFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'sample_number',
        'visit_order_item_id',
        'sample_type_id',
        'collected_by',
        'collected_at',
        'container',
        'volume',
        'status',
        'rejection_reason',
        'received_by',
        'received_at',
    ];

    protected $casts = [
        'collected_at' => 'datetime',
        'received_at' => 'datetime',
    ];

    public function visitOrderItem()
    {
        return $this->belongsTo(VisitOrderItem::class);
    }

    public function sampleType()
    {
        return $this->belongsTo(LabSampleType::class);
    }

    public function collectedBy()
    {
        return $this->belongsTo(User::class, 'collected_by');
    }

    public function receivedBy()
    {
        return $this->belongsTo(User::class, 'received_by');
    }

    public function scopeCollected($query)
    {
        return $query->where('status', 'collected');
    }

    public function scopeReceived($query)
    {
        return $query->where('status', 'received');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('collected_by', $userId)->orWhere('received_by', $userId);
    }
}
