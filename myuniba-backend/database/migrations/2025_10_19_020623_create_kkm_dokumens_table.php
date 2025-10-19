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
        Schema::create('kkm_dokumens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kkm_peserta_id')->constrained('kkm_pesertas')->onDelete('cascade');
            $table->string('jenis_dokumen'); // e.g., 'Laporan Akhir', 'Logbook'
            $table->string('file_path');
            $table->enum('status', ['submitted', 'approved', 'revision'])->default('submitted');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kkm_dokumens');
    }
};
