<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visit_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visit_order_id')->constrained('visit_orders')->onDelete('cascade');

            // Polymorphic relationship to different service types
            $table->string('item_type'); // 'service', 'lab_service', 'pharmacy_service'
            $table->unsignedBigInteger('item_id'); // Points to service_id, lab_service_id, etc.

            $table->integer('qty')->default(1);
            $table->decimal('price', 10, 2);
            $table->text('notes')->nullable();
            $table->timestamps();

            // Indexes for polymorphic relationship
            $table->index(['item_type', 'item_id']);
            $table->index('visit_order_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visit_order_items');
    }
};
