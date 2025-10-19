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
        Schema::create('kkm_kelompoks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kkm_program_id')->constrained('kkm_programs')->onDelete('cascade');
            $table->string('nama_kelompok');
            $table->text('lokasi_kkm');
            $table->foreignId('dosen_pembimbing_id')->constrained('dosen_profiles')->onDelete('restrict');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kkm_kelompoks');
    }
};
