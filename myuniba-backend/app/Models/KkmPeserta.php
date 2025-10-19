<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KkmPeserta extends Model
{
    use HasFactory;

    protected $fillable = [
        'kkm_kelompok_id',
        'mahasiswa_profile_id',
    ];

    public function kkmKelompok(): BelongsTo
    {
        return $this->belongsTo(KkmKelompok::class);
    }

    public function mahasiswaProfile(): BelongsTo
    {
        return $this->belongsTo(MahasiswaProfile::class);
    }

    public function kkmDokumens(): HasMany
    {
        return $this->hasMany(KkmDokumen::class);
    }
}
