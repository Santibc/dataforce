<?php

namespace Src\Domain\Adp\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Src\Domain\Company\Models\Company;
use Src\Domain\User\Models\User;

class AdpTimeCard extends Model
{
    protected $table = 'adp_time_cards';

    protected $fillable = [
        'company_id',
        'user_id',
        'adp_aoid',
        'time_card_id',
        'period_code',
        'period_start',
        'period_end',
        'period_status',
        'processing_status',
        'total_minutes',
        'period_totals',
        'daily_totals',
        'exceptions',
        'synced_at',
    ];

    protected $casts = [
        'period_start' => 'date',
        'period_end' => 'date',
        'total_minutes' => 'integer',
        'period_totals' => 'array',
        'daily_totals' => 'array',
        'exceptions' => 'array',
        'synced_at' => 'datetime',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** Horas decimales del periodo (p. ej. 510 min => 8.5). */
    public function getTotalHoursAttribute(): float
    {
        return round($this->total_minutes / 60, 2);
    }
}
