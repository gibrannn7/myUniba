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
        Schema::create('kkm_pesertas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kkm_kelompok_id')->constrained('kkm_kelompoks')->onDelete('cascade');
            $table->foreignId('mahasiswa_profile_id')->constrained('mahasiswa_profiles')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kkm_pesertas');
    }
};
