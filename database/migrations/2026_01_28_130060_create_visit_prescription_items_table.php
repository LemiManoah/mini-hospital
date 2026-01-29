<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visit_prescription_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visit_prescription_id')
                ->constrained('visit_prescriptions')
                ->onDelete('cascade');
            $table->unsignedBigInteger('drug_id')->nullable();
            $table->string('dosage')->nullable();
            $table->string('frequency')->nullable();
            $table->unsignedInteger('duration_days')->nullable();
            $table->unsignedInteger('qty')->default(1);
            $table->decimal('price', 10, 2)->default(0);
            $table->boolean('external_purchase')->default(false);
            $table->timestamps();

            $table->index('visit_prescription_id');
            $table->index('drug_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visit_prescription_items');
    }
};
