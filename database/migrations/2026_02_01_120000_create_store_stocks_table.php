<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('store_stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
            $table->foreignId('inventory_item_id')->constrained('inventory_items')->onDelete('cascade');
            $table->integer('on_hand')->default(0);
            $table->unsignedInteger('reorder_level')->nullable();
            $table->timestamps();

            $table->unique(['store_id', 'inventory_item_id']);
            $table->index(['store_id']);
            $table->index(['inventory_item_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('store_stocks');
    }
};
