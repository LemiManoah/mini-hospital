<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visit_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visit_id')->constrained('patient_visits')->onDelete('cascade');
            $table->foreignId('doctor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('complaint')->nullable();
            $table->text('examination')->nullable();
            $table->text('provisional_diagnosis')->nullable();
            $table->text('final_diagnosis')->nullable();
            $table->text('plan')->nullable();
            $table->timestamps();

            $table->index('visit_id');
            $table->index('doctor_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visit_notes');
    }
};
