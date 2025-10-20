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
        Schema::create('tagihans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_profile_id')->nullable()->constrained('mahasiswa_profiles')->onDelete('set null');
            $table->string('tahun_akademik');
            $table->string('jenis_tagihan'); // e.g., 'BOP', 'SKS', 'KKM', 'Pendaftaran'
            $table->decimal('jumlah_tagihan', 15, 2);
            $table->dateTime('tenggat_waktu');
            $table->enum('status', ['belum_dibayar', 'sebagian_dibayar', 'lunas'])->default('belum_dibayar');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tagihans');
    }
};
