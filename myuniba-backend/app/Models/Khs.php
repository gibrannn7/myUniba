<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Khs extends Model
{
    use HasFactory;

    protected $fillable = [
        'mahasiswa_profile_id',
        'krs_id',
        'tahun_akademik',
        'semester',
        'ips',
        'ipk',
        'total_sks_semester',
    ];

    protected $casts = [
        'ips' => 'decimal:2',
        'ipk' => 'decimal:2',
        'total_sks_semester' => 'integer',
    ];

    public function mahasiswaProfile(): BelongsTo
    {
        return $this->belongsTo(MahasiswaProfile::class);
    }

    public function krs(): BelongsTo
    {
        return $this->belongsTo(Krs::class);
    }

    public function khsDetails(): HasMany
    {
        return $this->hasMany(KhsDetail::class);
    }
}
