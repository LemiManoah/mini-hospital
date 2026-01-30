<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lab_reference_ranges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lab_result_parameter_id')->constrained()->onDelete('cascade');
            $table->string('age_range_from')->nullable(); // e.g., "0", "5", "16"
            $table->string('age_range_to')->nullable();   // e.g., "16", "50", "120"
            $table->enum('sex', ['male', 'female', 'both'])->default('both');
            $table->string('phase')->nullable(); // For hormone tests: "Follicular Phase", "Ovulation Phase", etc.
            $table->string('weeks_from')->nullable(); // For pregnancy tests: "0", "13", "29"
            $table->string('weeks_to')->nullable();   // For pregnancy tests: "12", "28", "40"
            $table->decimal('min_value', 10, 4)->nullable();
            $table->decimal('max_value', 10, 4)->nullable();
            $table->string('reference_text')->nullable(); // For text-based references like "NONE"
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['lab_result_parameter_id', 'sex', 'age_range_from', 'age_range_to']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lab_reference_ranges');
    }
};
