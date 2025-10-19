<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PmbRegistration extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'data_pribadi',
        'data_keluarga',
        'status_pendaftaran',
        'tagihan_id',
        'photo_path',
    ];

    protected $casts = [
        'data_pribadi' => 'array',
        'data_keluarga' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tagihan(): BelongsTo
    {
        return $this->belongsTo(Tagihan::class);
    }
}
