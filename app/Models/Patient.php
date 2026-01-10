<?php

namespace App\Models;

use Carbon\Carbon;
use App\Models\Address;
use App\Models\Country;
use App\Enums\EnumsGender;
use App\Models\PatientCategory;
use App\Enums\EnumsMaritalStatus;
use App\Enums\EnumsKinRelationship;
use App\Enums\EnumsReligions;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Patient extends Model
{
    /** @use HasFactory<\Database\Factories\PatientFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'patient_number',
        'first_name',
        'last_name',
        'date_of_birth',
        'preferred_language',
        'religion',
        'country_id',
        'address_id',
        'registration_date',
        'is_active',    
        'gender',
        'marital_status',
        'patient_category_id',
        'next_of_kin_name',
        'next_of_kin_number',
        'next_of_kin_relationship',
        'phone_number',
        'alternative_phone_number',
        'phone_owner',
    ];

    protected $casts = [
        'gender' => EnumsGender::class,
        'marital_status' => EnumsMaritalStatus::class,
        'next_of_kin_relationship' => EnumsKinRelationship::class,
        'religion' => EnumsReligions::class,
        'phone_owner' => 'boolean',
        'date_of_birth' => 'date',
        'registration_date' => 'date',
        'is_active' => 'boolean',
    ];
    protected $appends = ['age'];

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function patientCategory()
    {
        return $this->belongsTo(PatientCategory::class);
    }

    public function getAgeAttribute(): string
    {
        if (!$this->date_of_birth) {
            return '';
        }

        $dob = Carbon::parse($this->date_of_birth);
        $years = $dob->age;
        $months = $dob->diffInMonths(now()) % 12;

        return "{$years}y {$months}m";
    }
}
