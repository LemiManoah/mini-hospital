<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LabReferenceRange extends Model
{
    use HasFactory;

    protected $fillable = [
        'lab_result_parameter_id',
        'age_range_from',
        'age_range_to',
        'sex',
        'phase',
        'weeks_from',
        'weeks_to',
        'min_value',
        'max_value',
        'reference_text',
        'is_active',
    ];

    protected $casts = [
        'min_value' => 'decimal:4',
        'max_value' => 'decimal:4',
        'is_active' => 'boolean',
    ];

    public function labResultParameter(): BelongsTo
    {
        return $this->belongsTo(LabResultParameter::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeForAge($query, $age)
    {
        return $query->where(function ($q) use ($age) {
            $q->whereNull('age_range_from')
                ->orWhere(function ($subQ) use ($age) {
                    $subQ->where('age_range_from', '<=', $age)
                        ->where(function ($subSubQ) use ($age) {
                            $subSubQ->whereNull('age_range_to')
                                ->orWhere('age_range_to', '>=', $age);
                        });
                });
        });
    }

    public function scopeForSex($query, $sex)
    {
        return $query->where(function ($q) use ($sex) {
            $q->where('sex', 'both')
                ->orWhere('sex', strtolower($sex));
        });
    }

    public function scopeForPhase($query, $phase)
    {
        return $query->where(function ($q) use ($phase) {
            $q->whereNull('phase')
                ->orWhere('phase', $phase);
        });
    }

    public function scopeForWeeks($query, $weeks)
    {
        return $query->where(function ($q) use ($weeks) {
            $q->whereNull('weeks_from')
                ->orWhere(function ($subQ) use ($weeks) {
                    $subQ->where('weeks_from', '<=', $weeks)
                        ->where(function ($subSubQ) use ($weeks) {
                            $subSubQ->whereNull('weeks_to')
                                ->orWhere('weeks_to', '>=', $weeks);
                        });
                });
        });
    }
}
