<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tagihan extends Model
{
    use HasFactory;

    protected $fillable = [
        'mahasiswa_profile_id',
        'tahun_akademik',
        'jenis_tagihan',
        'jumlah_tagihan',
        'tenggat_waktu',
        'status',
    ];

    protected $casts = [
        'tenggat_waktu' => 'datetime',
        'jumlah_tagihan' => 'decimal:2',
    ];

    public function mahasiswaProfile(): BelongsTo
    {
        return $this->belongsTo(MahasiswaProfile::class);
    }
}
