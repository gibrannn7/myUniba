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
        Schema::create('pmb_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->json('data_pribadi')->nullable(); // Contains all form data from step 1
            $table->json('data_keluarga')->nullable();
            $table->enum('status_pendaftaran', [
                'mengisi_formulir', 
                'menunggu_pembayaran', 
                'pembayaran_diverifikasi', 
                'seleksi', 
                'diterima', 
                'ditolak'
            ])->default('mengisi_formulir');
            $table->foreignId('tagihan_id')->nullable()->constrained('tagihans')->onDelete('set null');
            $table->string('photo_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pmb_registrations');
    }
};
