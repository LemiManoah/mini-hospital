<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StaffProfile extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'staff_number',
        'gender',
        'phone_number',
        'alternative_phone_number',
        'user_id',
        'clinic_id',
        'address_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function getDisplayNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
