<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MedicalUnit extends Model
{
    /** @use HasFactory<\Database\Factories\MedicalUnitFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'category',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function getDisplayNameAttribute(): string
    {
        return "{$this->name} ({$this->code})";
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeSolid($query)
    {
        return $query->where('category', 'solid');
    }

    public function scopeLiquid($query)
    {
        return $query->where('category', 'liquid');
    }

    public function scopeTopical($query)
    {
        return $query->where('category', 'topical');
    }

    public function scopeInhalation($query)
    {
        return $query->where('category', 'inhalation');
    }
}
