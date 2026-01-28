<?php

namespace App\Models;

use Carbon\Carbon;
use App\Models\Address;
use App\Models\Country;
use App\Enums\EnumsGender;
use App\Models\PatientCategory;
use App\Models\Appointment;
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
        'age',
        'age_unit',
        'gender',
        'marital_status',
        'preferred_language',
        'religion',
        'country_id',
        'address_id',
        'patient_category_id',
        'registration_date',
        'phone_number',
        'alternative_phone_number',
        'next_of_kin_name',
        'next_of_kin_number',
        'next_of_kin_relationship',
    ];

    protected $casts = [
        'gender' => EnumsGender::class,
        'marital_status' => EnumsMaritalStatus::class,
        'next_of_kin_relationship' => EnumsKinRelationship::class,
        'religion' => EnumsReligions::class,
        'date_of_birth' => 'date',
        'registration_date' => 'date',
    ];
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

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function allergies()
    {
        return $this->belongsToMany(Allergy::class)
            ->withPivot('notes', 'diagnosed_date', 'severity', 'is_active')
            ->withTimestamps();
    }

    public function activeAllergies()
    {
        return $this->belongsToMany(Allergy::class)
            ->withPivot('notes', 'diagnosed_date', 'severity', 'is_active')
            ->wherePivot('is_active', true)
            ->withTimestamps();
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
