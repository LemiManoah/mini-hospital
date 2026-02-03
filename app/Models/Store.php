<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Store extends Model
{
    /** @use HasFactory<\Database\Factories\StoreFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'is_main',
        'allow_direct_receipt',
        'is_active',
        'notes',
    ];

    protected $casts = [
        'is_main' => 'boolean',
        'allow_direct_receipt' => 'boolean',
        'is_active' => 'boolean',
    ];

}
