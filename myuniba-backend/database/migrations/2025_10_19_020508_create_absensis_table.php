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
        Schema::create('absensis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jadwal_kuliah_id')->constrained('jadwal_kuliahs')->onDelete('cascade');
            $table->foreignId('mahasiswa_profile_id')->constrained('mahasiswa_profiles')->onDelete('cascade');
            $table->date('tanggal_perkuliahan');
            $table->enum('status_kehadiran', ['hadir', 'sakit', 'izin', 'alpa']);
            $table->enum('metode_absensi', ['qr', 'face_geo']);
            $table->string('latitude')->nullable();
            $table->string('longitude')->nullable();
            $table->text('face_recognition_data')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absensis');
    }
};
