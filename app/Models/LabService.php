<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LabService extends Model
{
    /** @use HasFactory<\Database\Factories\LabServiceFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'lab_service_category_id',
        'name',
        'code',
        'description',
        'price',
        'sample_type_id',
        'lab_result_type_id',
        'result_fields',
        'reference_range',
        'clinical_notes',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'result_fields' => 'array',
        'is_active' => 'boolean',
    ];

    public function labServiceCategory()
    {
        return $this->belongsTo(LabServiceCategory::class);
    }

    public function sampleType()
    {
        return $this->belongsTo(LabSampleType::class, 'sample_type_id');
    }

    public function resultOptions()
    {
        return $this->hasMany(LabResultOption::class);
    }

    public function resultParameters()
    {
        return $this->hasMany(LabResultParameter::class);
    }

    public function labResultType()
    {
        return $this->belongsTo(LabResultType::class);
    }

    public function getDisplayNameAttribute(): string
    {
        return "{$this->code} - {$this->name}";
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeInactive($query)
    {
        return $query->where('is_active', false);
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('lab_service_category_id', $categoryId);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
