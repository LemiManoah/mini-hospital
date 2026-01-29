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
            $table->foreignId('lab_service_category_id')->constrained('lab_service_categories')->onDelete('cascade');
            $table->string('name', 200);
            $table->string('code', 50)->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2)->default(0);
            $table->string('sample_type_code', 20)->nullable();
            $table->json('result_fields')->nullable();
            $table->text('reference_range')->nullable();
            $table->text('clinical_notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->softDeletes();
            $table->timestamps();

            $table->index('lab_service_category_id');
            $table->index('code');
            $table->index('is_active');
            $table->index('sample_type_code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lab_services');
    }
};
