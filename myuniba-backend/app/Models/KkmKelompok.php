<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KkmKelompok extends Model
{
    use HasFactory;

    protected $fillable = [
        'kkm_program_id',
        'nama_kelompok',
        'lokasi_kkm',
        'dosen_pembimbing_id',
    ];

    public function kkmProgram(): BelongsTo
    {
        return $this->belongsTo(KkmProgram::class);
    }

    public function dosenPembimbing(): BelongsTo
    {
        return $this->belongsTo(DosenProfile::class, 'dosen_pembimbing_id');
    }

    public function kkmPesertas(): HasMany
    {
        return $this->hasMany(KkmPeserta::class);
    }
}
