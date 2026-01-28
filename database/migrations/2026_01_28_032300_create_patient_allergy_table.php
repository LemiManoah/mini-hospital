<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('allergy_patient', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->onDelete('cascade');
            $table->foreignId('allergy_id')->constrained()->onDelete('cascade');
            $table->text('notes')->nullable(); // Patient-specific notes about the allergy
            $table->date('diagnosed_date')->nullable(); // When the allergy was diagnosed
            $table->string('severity')->default('moderate'); // Can override the default allergy severity
            $table->boolean('is_active')->default(true); // Can deactivate specific patient allergy
            $table->timestamps();

            $table->unique(['patient_id', 'allergy_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('allergy_patient');
    }
};
