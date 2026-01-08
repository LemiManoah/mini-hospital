<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PatientCategory extends Model
{
    /** @use HasFactory<\Database\Factories\PatientCategoryFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'is_insurance',
        'is_active',
    ];

    protected $casts = [
        'is_insurance' => 'boolean',
        'is_active' => 'boolean',
    ];

    //related to Patients
    public function patients()
    {
        return $this->hasMany(Patient::class);
    }
}
