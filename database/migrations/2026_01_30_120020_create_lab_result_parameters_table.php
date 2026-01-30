<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lab_result_parameters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lab_service_id')->constrained()->onDelete('cascade');
            $table->string('parameter_name');
            $table->string('parameter_code')->nullable();
            $table->string('unit')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('display_order')->default(0);
            $table->timestamps();

            $table->index(['lab_service_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lab_result_parameters');
    }
};
