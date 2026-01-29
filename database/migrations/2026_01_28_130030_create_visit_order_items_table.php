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
            $table->foreignId('service_id')->nullable()->constrained('services')->nullOnDelete();
            $table->unsignedInteger('qty')->default(1);
            $table->decimal('price', 10, 2)->default(0);
            $table->timestamps();

            $table->index('visit_order_id');
            $table->index('service_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visit_order_items');
    }
};
