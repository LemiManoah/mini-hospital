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
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('patient_number')->unique();

            $table->string('first_name');
            $table->string('last_name');
            $table->date('date_of_birth');

            $table->boolean('is_pediatric')->default(false);
            $table->integer('age_years')->nullable();
            $table->integer('age_months')->nullable();

            $table->string('preferred_language')->nullable();
            $table->string('religion')->nullable();
            $table->unsignedBigInteger('country_id')->nullable();
            $table->unsignedBigInteger('address_id')->nullable();


            $table->date('registration_date');
            $table->boolean('is_active')->default(true);

            $table->string('gender');
            $table->string('marital_status');

            $table->unsignedBigInteger('patient_category_id')->nullable();

            $table->string('next_of_kin_name')->nullable();
            $table->string('next_of_kin_number')->nullable();
            $table->string('next_of_kin_relationship')->nullable();

            $table->string('phone_number');
            $table->string('alternative_phone_number')->nullable();
            $table->boolean('phone_owner')->default(true);

            $table->timestamps();

            $table->foreign('patient_category_id')->references('id')->on('patient_categories');
            $table->foreign('country_id')->references('id')->on('countries');
            $table->foreign('address_id')->references('id')->on('addresses');
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
