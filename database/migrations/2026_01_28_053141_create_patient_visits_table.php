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
        Schema::create('patient_visits', function (Blueprint $table) {
            $table->id();
            $table->string('visit_number')->unique();
            $table->foreignId('patient_id')->constrained()->onDelete('cascade');
            $table->foreignId('visit_type_id')->constrained()->onDelete('restrict');
            $table->foreignId('status_id')->constrained('visit_statuses')->onDelete('restrict');
            $table->foreignId('assigned_clinic_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('assigned_doctor_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('created_by_staff_id')->constrained()->onDelete('restrict');
            $table->date('visit_date');
            $table->time('visit_time');
            $table->enum('priority_flag', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->softDeletes();
            $table->timestamps();

            $table->index('visit_number');
            $table->index('patient_id');
            $table->index('visit_type_id');
            $table->index('status_id');
            $table->index('visit_date');
            $table->index('priority_flag');
            $table->index(['visit_date', 'visit_time']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patient_visits');
    }
};
