<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('visit_results', function (Blueprint $table) {
            $table->foreignId('visit_order_item_id')
                ->nullable()
                ->after('visit_order_id')
                ->constrained('visit_order_items')
                ->onDelete('cascade');

            $table->index('visit_order_item_id');
            $table->unique('visit_order_item_id');
        });
    }

    public function down(): void
    {
        Schema::table('visit_results', function (Blueprint $table) {
            $table->dropUnique(['visit_order_item_id']);
            $table->dropIndex(['visit_order_item_id']);
            $table->dropConstrainedForeignId('visit_order_item_id');
        });
    }
};
