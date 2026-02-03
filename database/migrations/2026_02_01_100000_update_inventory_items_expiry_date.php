<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inventory_items', function (Blueprint $table) {
            if (Schema::hasColumn('inventory_items', 'default_expiry_days')) {
                $table->dropColumn('default_expiry_days');
            }
            if (! Schema::hasColumn('inventory_items', 'default_expiry_date')) {
                $table->date('default_expiry_date')->nullable()->after('is_expirable');
            }
        });
    }

    public function down(): void
    {
        Schema::table('inventory_items', function (Blueprint $table) {
            if (Schema::hasColumn('inventory_items', 'default_expiry_date')) {
                $table->dropColumn('default_expiry_date');
            }
            if (! Schema::hasColumn('inventory_items', 'default_expiry_days')) {
                $table->unsignedInteger('default_expiry_days')->nullable()->after('is_expirable');
            }
        });
    }
};
