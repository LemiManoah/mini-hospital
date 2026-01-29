<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->boolean('allow_service_before_payment')->default(false);
            $table->boolean('allow_lab_before_payment')->default(false);
            $table->boolean('allow_pharmacy_before_payment')->default(false);
            $table->boolean('enforce_insurance_preauth')->default(false);
            $table->boolean('allow_partial_payment')->default(false);
            $table->boolean('require_doctor_verification_for_results')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
