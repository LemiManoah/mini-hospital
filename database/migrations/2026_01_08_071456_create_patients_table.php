<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('patient_number')->unique();

            $table->string('first_name');
            $table->string('last_name');
            $table->date('date_of_birth')->nullable();
            $table->integer('age')->nullable();
            $table->enum('age_unit', ['years', 'months', 'days'])->nullable();


            $table->string('preferred_language')->nullable()->default('English');
            $table->string('religion')->nullable();

            $table->foreignId('country_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('address_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('patient_category_id')->nullable()->constrained()->nullOnDelete();

            $table->date('registration_date')->nullable();

            $table->string('gender', 20);
            $table->string('marital_status', 20);

            $table->string('next_of_kin_name')->nullable();
            $table->string('next_of_kin_number')->nullable();
            $table->string('next_of_kin_relationship', 30)->nullable();

            $table->string('phone_number');
            $table->string('alternative_phone_number')->nullable();

            $table->softDeletes();
            $table->timestamps();

            $table->index(['patient_number', 'first_name', 'last_name', 'phone_number']);
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
