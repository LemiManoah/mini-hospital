<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VisitStatus extends Model
{
    /** @use HasFactory<\Database\Factories\VisitStatusFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'sequence',
        'is_terminal',
    ];

    protected $casts = [
        'is_terminal' => 'boolean',
        'sequence' => 'integer',
    ];

    public function getDisplayNameAttribute(): string
    {
        return "{$this->code} - {$this->name}";
    }

    public function scopeTerminal($query)
    {
        return $query->where('is_terminal', true);
    }

    public function scopeNonTerminal($query)
    {
        return $query->where('is_terminal', false);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sequence', 'asc');
    }
}
