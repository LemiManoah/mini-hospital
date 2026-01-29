<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('billing_charge_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visit_id')->constrained('patient_visits')->onDelete('cascade');
            $table->string('item_type');
            $table->unsignedBigInteger('item_id')->nullable();
            $table->unsignedInteger('qty')->default(1);
            $table->decimal('unit_price', 10, 2)->default(0);
            $table->decimal('total', 10, 2)->default(0);
            $table->string('payer_type')->default('cash');
            $table->string('status')->default('unpaid');
            $table->timestamps();

            $table->index('visit_id');
            $table->index('item_type');
            $table->index('item_id');
            $table->index('payer_type');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('billing_charge_items');
    }
};
