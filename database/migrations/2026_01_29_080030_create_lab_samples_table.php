<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lab_samples', function (Blueprint $table) {
            $table->id();
            $table->string('sample_number', 50)->unique();
            $table->foreignId('visit_order_item_id')->constrained('visit_order_items')->onDelete('cascade');
            $table->foreignId('sample_type_id')->constrained('lab_sample_types');
            $table->foreignId('collected_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('collected_at')->nullable();
            $table->string('container')->nullable();
            $table->string('volume')->nullable();
            $table->enum('status', ['collected', 'received', 'rejected'])->default('collected');
            $table->text('rejection_reason')->nullable();
            $table->foreignId('received_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('received_at')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index('sample_number');
            $table->index('status');
            $table->index('collected_at');
            $table->index('received_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lab_samples');
    }
};
