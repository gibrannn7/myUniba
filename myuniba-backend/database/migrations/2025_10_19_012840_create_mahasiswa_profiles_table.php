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
        Schema::create('mahasiswa_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('nim')->unique();
            $table->string('nama_lengkap');
            $table->string('tempat_lahir');
            $table->date('tanggal_lahir');
            $table->enum('jenis_kelamin', ['L', 'P']);
            $table->string('agama');
            $table->string('golongan_darah')->nullable();
            $table->string('kewarganegaraan');
            $table->string('nik');
            $table->string('nisn')->nullable();
            $table->string('npsn_sekolah_asal')->nullable();
            $table->string('nama_sekolah_asal')->nullable();
            $table->string('tahun_lulus')->nullable();
            $table->text('alamat_lengkap');
            $table->string('rt')->nullable();
            $table->string('rw')->nullable();
            $table->string('desa_kelurahan');
            $table->string('kecamatan');
            $table->string('kabupaten_kota');
            $table->string('provinsi');
            $table->string('kode_pos');
            $table->string('email');
            $table->string('no_whatsapp');
            $table->foreignId('program_studi_id')->constrained('program_studis')->onDelete('restrict');
            $table->enum('waktu_belajar', ['Pagi', 'Sore', 'Malam', 'Jumat-Minggu'])->default('Pagi');
            $table->string('ukuran_almamater')->default('M');
            $table->enum('status', ['aktif', 'cuti', 'lulus', 'drop_out'])->default('aktif');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mahasiswa_profiles');
    }
};
