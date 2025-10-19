<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KkmProgram extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_program',
        'tahun_akademik',
        'deskripsi',
    ];

    public function kkmKelompoks(): HasMany
    {
        return $this->hasMany(KkmKelompok::class);
    }
}
