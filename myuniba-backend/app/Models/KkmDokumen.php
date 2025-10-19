<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KkmDokumen extends Model
{
    use HasFactory;

    protected $fillable = [
        'kkm_peserta_id',
        'jenis_dokumen',
        'file_path',
        'status',
    ];

    public function kkmPeserta(): BelongsTo
    {
        return $this->belongsTo(KkmPeserta::class);
    }
}
