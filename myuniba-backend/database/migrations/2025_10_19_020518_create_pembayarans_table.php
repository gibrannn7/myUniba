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
        Schema::create('pembayarans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_profile_id')->constrained('mahasiswa_profiles')->onDelete('cascade');
            $table->foreignId('tagihan_id')->nullable()->constrained('tagihans')->onDelete('set null');
            $table->string('nomor_virtual_account');
            $table->decimal('jumlah_pembayaran', 15, 2);
            $table->dateTime('tanggal_pembayaran');
            $table->string('metode_pembayaran'); // e.g., 'Midtrans', 'BNI VA'
            $table->enum('status_pembayaran', ['pending', 'success', 'failed'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayarans');
    }
};
