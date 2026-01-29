<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visit_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visit_order_id')->constrained('visit_orders')->onDelete('cascade');
            $table->text('result_payload')->nullable();
            $table->foreignId('recorded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();

            $table->index('visit_order_id');
            $table->index('recorded_by');
            $table->index('verified_by');
            $table->index('verified_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visit_results');
    }
};
