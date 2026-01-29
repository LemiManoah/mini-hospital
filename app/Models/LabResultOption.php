<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LabResultOption extends Model
{
    /** @use HasFactory<\Database\Factories\LabResultOptionFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'lab_test_id',
        'option_value',
        'label',
        'is_abnormal',
        'sort_order',
    ];

    protected $casts = [
        'is_abnormal' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function labTest()
    {
        return $this->belongsTo(Service::class, 'lab_test_id');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order', 'asc')->orderBy('label', 'asc');
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
