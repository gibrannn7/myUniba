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
        Schema::create('keluarga_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_profile_id')->constrained('mahasiswa_profiles')->onDelete('cascade');
            $table->string('nama_ayah');
            $table->string('pekerjaan_ayah')->nullable();
            $table->string('penghasilan_ayah')->nullable(); // e.g., '<1jt', '1-3jt', '3-5jt', '>5jt'
            $table->string('nama_ibu');
            $table->string('pekerjaan_ibu')->nullable();
            $table->string('penghasilan_ibu')->nullable();
            $table->text('alamat_orang_tua');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('keluarga_profiles');
    }
};
