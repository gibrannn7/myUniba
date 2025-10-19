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
        Schema::create('khs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_profile_id')->constrained('mahasiswa_profiles')->onDelete('cascade');
            $table->foreignId('krs_id')->constrained('krs')->onDelete('cascade');
            $table->string('tahun_akademik');
            $table->integer('semester');
            $table->decimal('ips', 5, 2); // Index Prestasi Semester
            $table->decimal('ipk', 5, 2); // Index Prestasi Kumulatif
            $table->integer('total_sks_semester');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('khs');
    }
};
