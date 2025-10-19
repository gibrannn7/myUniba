<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Absensi extends Model
{
    use HasFactory;

    protected $fillable = [
        'jadwal_kuliah_id',
        'mahasiswa_profile_id',
        'tanggal_perkuliahan',
        'status_kehadiran',
        'metode_absensi',
        'latitude',
        'longitude',
        'face_recognition_data',
    ];

    protected $casts = [
        'tanggal_perkuliahan' => 'date',
    ];

    public function jadwalKuliah(): BelongsTo
    {
        return $this->belongsTo(JadwalKuliah::class);
    }

    public function mahasiswaProfile(): BelongsTo
    {
        return $this->belongsTo(MahasiswaProfile::class);
    }
}
