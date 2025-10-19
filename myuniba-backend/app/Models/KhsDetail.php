<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KhsDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'khs_id',
        'mata_kuliah_id',
        'nilai_huruf',
        'nilai_angka',
    ];

    protected $casts = [
        'nilai_angka' => 'decimal:2',
    ];

    public function khs(): BelongsTo
    {
        return $this->belongsTo(Khs::class);
    }

    public function mataKuliah(): BelongsTo
    {
        return $this->belongsTo(MataKuliah::class);
    }
}
