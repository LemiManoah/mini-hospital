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
            $table->foreignId('lab_test_id')->constrained('lab_services')->onDelete('cascade');
            $table->string('option_value', 200);
            $table->string('label', 200);
            $table->boolean('is_abnormal')->default(false);
            $table->integer('sort_order')->default(0);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->softDeletes();
            $table->timestamps();

            $table->index('lab_test_id');
            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lab_result_options');
    }
};
