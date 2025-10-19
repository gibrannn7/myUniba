<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Krs extends Model
{
    use HasFactory;

    protected $fillable = [
        'mahasiswa_profile_id',
        'tahun_akademik',
        'semester',
        'total_sks',
        'status',
        'catatan_penolakan',
    ];

    public function mahasiswaProfile(): BelongsTo
    {
        return $this->belongsTo(MahasiswaProfile::class);
    }

    public function krsDetails(): HasMany
    {
        return $this->hasMany(KrsDetail::class);
    }

    public function khs(): HasMany
    {
        return $this->hasMany(Khs::class);
    }
}
