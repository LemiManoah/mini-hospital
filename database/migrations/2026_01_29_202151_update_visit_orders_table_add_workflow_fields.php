<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('visit_orders', function (Blueprint $table) {
            // Order classification
            $table->string('order_number')->nullable()->after('order_type');
            $table->string('priority')->default('normal')->after('status');

            // Clinical context
            $table->text('clinical_notes')->nullable()->after('priority');
            $table->text('doctor_instructions')->nullable()->after('clinical_notes');

            // Workflow timestamps
            $table->timestamp('requested_at')->nullable()->after('doctor_instructions');
            $table->timestamp('started_processing_at')->nullable()->after('requested_at');
            $table->timestamp('completed_at')->nullable()->after('started_processing_at');
            $table->timestamp('cancelled_at')->nullable()->after('completed_at');

            // Cancellation fields
            $table->text('cancellation_reason')->nullable()->after('cancelled_at');
            $table->foreignId('cancelled_by')->nullable()->constrained('users')->nullOnDelete()->after('cancellation_reason');

            // Soft deletes
            $table->softDeletes()->after('updated_at');

            // Indexes
            $table->index('order_number');
            $table->index('priority');
            $table->index('requested_at');
        });

        // Update existing records to have default values
        DB::table('visit_orders')->whereNull('order_number')->update([
            'order_number' => DB::raw("'ORD-TEMP-' || id"),
            'requested_at' => DB::raw("'2025-01-29 10:00:00'"),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('visit_orders', function (Blueprint $table) {
            $table->dropColumn([
                'order_number',
                'priority',
                'clinical_notes',
                'doctor_instructions',
                'requested_at',
                'started_processing_at',
                'completed_at',
                'cancelled_at',
                'cancellation_reason',
                'cancelled_by',
            ]);
            $table->dropSoftDeletes();
        });
    }
};
