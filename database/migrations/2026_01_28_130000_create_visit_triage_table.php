<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visit_triage', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visit_id')->constrained('patient_visits')->onDelete('cascade');
            $table->json('vitals_json')->nullable();
            $table->text('triage_notes')->nullable();
            $table->foreignId('triage_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('triage_at')->nullable();
            $table->timestamps();

            $table->index('visit_id');
            $table->index('triage_by');
            $table->index('triage_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visit_triage');
    }
};
