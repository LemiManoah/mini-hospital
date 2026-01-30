<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LabResultParameter extends Model
{
    use HasFactory;

    protected $fillable = [
        'lab_service_id',
        'parameter_name',
        'parameter_code',
        'unit',
        'is_active',
        'display_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'display_order' => 'integer',
    ];

    public function labService(): BelongsTo
    {
        return $this->belongsTo(LabService::class);
    }

    public function referenceRanges(): HasMany
    {
        return $this->hasMany(LabReferenceRange::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order', 'asc')->orderBy('parameter_name', 'asc');
    }
}
