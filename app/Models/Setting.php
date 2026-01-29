<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    /** @use HasFactory<\Database\Factories\SettingFactory> */
    use HasFactory;

    protected $fillable = [
        'allow_service_before_payment',
        'allow_lab_before_payment',
        'allow_pharmacy_before_payment',
        'enforce_insurance_preauth',
        'allow_partial_payment',
        'require_doctor_verification_for_results',
    ];

    protected $casts = [
        'allow_service_before_payment' => 'boolean',
        'allow_lab_before_payment' => 'boolean',
        'allow_pharmacy_before_payment' => 'boolean',
        'enforce_insurance_preauth' => 'boolean',
        'allow_partial_payment' => 'boolean',
        'require_doctor_verification_for_results' => 'boolean',
    ];
}
