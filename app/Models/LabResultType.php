<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LabResultType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'result_format',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function labServices(): HasMany
    {
        return $this->hasMany(LabService::class);
    }

    public function labResultOptions(): HasMany
    {
        return $this->hasMany(LabResultOption::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByFormat($query, string $format)
    {
        return $query->where('result_format', $format);
    }
}
