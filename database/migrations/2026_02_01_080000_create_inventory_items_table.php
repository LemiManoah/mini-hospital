<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('generic_name')->nullable();
            $table->string('code')->unique();
            $table->enum('item_type', ['drug', 'consumable', 'general_supply']);
            $table->foreignId('item_category_id')->constrained('inventory_item_categories')->onDelete('restrict');
            $table->string('unit_of_measure');
            $table->boolean('is_controlled')->default(false);
            $table->boolean('is_expirable')->default(false);
            $table->date('default_expiry_date')->nullable();
            $table->unsignedInteger('min_stock')->nullable();
            $table->unsignedInteger('reorder_level')->nullable();
            $table->decimal('cost_price', 12, 2)->nullable();
            $table->decimal('selling_price', 12, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['item_type', 'is_active']);
            $table->index(['item_category_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_items');
    }
};
