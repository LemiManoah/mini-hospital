<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lab_services', function (Blueprint $table) {
            $table->id();

            // Lab-specific categorization (separate from general service_types)
            $table->foreignId('lab_service_category_id')->constrained('lab_service_categories');

            // Basic service information
            $table->string('name'); // e.g., "Complete Blood Count"
            $table->string('code')->unique(); // e.g., "CBC"
            $table->text('description')->nullable();

            // Pricing
            $table->decimal('price', 10, 2);

            // Lab-specific fields (not in general services)
            $table->foreignId('sample_type_id')->nullable()->constrained('lab_sample_types'); // Direct foreign key
            $table->foreignId('lab_result_type_id')->nullable()->constrained('lab_result_types'); // Result format type
            $table->json('result_fields')->nullable(); // Structure for lab results
            $table->text('reference_range')->nullable(); // Normal values
            $table->text('clinical_notes')->nullable(); // Interpretation guidelines

            // Status and tracking
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('lab_service_category_id');
            $table->index('code');
            $table->index('sample_type_id');
            $table->index('is_active');
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('lab_services');
    }
};
