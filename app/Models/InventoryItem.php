<?php

namespace App\Models;

use App\Enums\EnumsInventoryItemType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\InventoryItemCategory;

class InventoryItem extends Model
{
    /** @use HasFactory<\Database\Factories\InventoryItemFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'generic_name',
        'code',
        'item_type',
        'item_category_id',
        'unit_of_measure',
        'is_controlled',
        'is_expirable',
        'default_expiry_date',
        'min_stock',
        'reorder_level',
        'cost_price',
        'selling_price',
        'is_active',
        'notes',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'item_type' => EnumsInventoryItemType::class,
        'is_controlled' => 'boolean',
        'is_expirable' => 'boolean',
        'is_active' => 'boolean',
        'cost_price' => 'decimal:2',
        'selling_price' => 'decimal:2',
        'default_expiry_date' => 'date',
    ];

    public function category()
    {
        return $this->belongsTo(InventoryItemCategory::class, 'item_category_id');
    }


    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
