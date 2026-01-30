<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class LabResultOption extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'lab_service_id',
        'lab_result_type_id',
        'option_name',
        'option_code',
        'symbol',
        'is_abnormal',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'is_abnormal' => 'boolean',
        'display_order' => 'integer',
        'is_active' => 'boolean',
    ];

    public function labService(): BelongsTo
    {
        return $this->belongsTo(LabService::class);
    }

    public function labResultType(): BelongsTo
    {
        return $this->belongsTo(LabResultType::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order', 'asc')->orderBy('option_name', 'asc');
    }

    public function scopeAbnormal($query)
    {
        return $query->where('is_abnormal', true);
    }

    public function scopeNormal($query)
    {
        return $query->where('is_abnormal', false);
    }
}
