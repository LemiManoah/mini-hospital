<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visit_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visit_id')->constrained('patient_visits')->onDelete('cascade');
            $table->foreignId('ordered_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('order_type');
            $table->string('status')->default('requested');
            $table->timestamps();

            $table->index('visit_id');
            $table->index('ordered_by');
            $table->index('order_type');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visit_orders');
    }
};
