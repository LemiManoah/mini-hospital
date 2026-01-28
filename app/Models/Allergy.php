<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Allergy extends Model
{
    /** @use HasFactory<\Database\Factories\AllergyFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'severity',
        'reaction_type',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function getDisplayNameAttribute(): string
    {
        return "{$this->name} ({$this->severity})";
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeBySeverity($query, $severity)
    {
        return $query->where('severity', $severity);
    }

    public function patients()
    {
        return $this->belongsToMany(Patient::class)
            ->withPivot('notes', 'diagnosed_date', 'severity', 'is_active')
            ->withTimestamps();
    }
}
