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
        Schema::table('appointments', function (Blueprint $table) {
            $table->foreignId('appointment_method_id')->nullable()->constrained('appointment_methods')->nullOnDelete();
            $table->foreignId('appointment_category_id')->nullable()->constrained('appointment_categories')->nullOnDelete();
            $table->unsignedInteger('duration_minutes')->default(30);
            $table->foreignId('clinic_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('service_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('priority_flag', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->string('cancellation_reason')->nullable();
            $table->foreignId('rescheduled_from_id')->nullable()->constrained('appointments')->nullOnDelete();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('checked_in_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->string('virtual_link')->nullable();
            $table->string('platform')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropForeign(['appointment_method_id']);
            $table->dropForeign(['appointment_category_id']);
            $table->dropForeign(['clinic_id']);
            $table->dropForeign(['service_id']);
            $table->dropForeign(['rescheduled_from_id']);

            $table->dropColumn([
                'appointment_method_id',
                'appointment_category_id',
                'duration_minutes',
                'clinic_id',
                'service_id',
                'priority_flag',
                'cancellation_reason',
                'rescheduled_from_id',
                'confirmed_at',
                'checked_in_at',
                'completed_at',
                'virtual_link',
                'platform',
            ]);
        });
    }
};
