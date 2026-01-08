<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Address extends Model
{
    /** @use HasFactory<\Database\Factories\AddressFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'district',
        'city',
        'county',
        'patient_id',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
