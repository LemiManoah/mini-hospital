<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visit_id')->constrained('patient_visits')->onDelete('cascade');
            $table->unsignedBigInteger('ward_id')->nullable();
            $table->unsignedBigInteger('bed_id')->nullable();
            $table->foreignId('admitting_doctor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('admitted_at')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();

            $table->index('visit_id');
            $table->index('ward_id');
            $table->index('bed_id');
            $table->index('admitting_doctor_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admissions');
    }
};
