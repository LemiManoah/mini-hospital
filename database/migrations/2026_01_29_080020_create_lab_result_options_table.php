<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lab_result_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lab_service_id')->constrained()->onDelete('cascade');
            $table->foreignId('lab_result_type_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('option_name');
            $table->string('option_code')->nullable();
            $table->string('symbol')->nullable();
            $table->boolean('is_abnormal')->default(false);
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['lab_service_id', 'lab_result_type_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lab_result_options');
    }
};
