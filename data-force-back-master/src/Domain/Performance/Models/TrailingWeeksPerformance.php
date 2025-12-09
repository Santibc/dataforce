<?php

namespace Src\Domain\Performance\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Src\Domain\Document\Models\Document;
use Src\Domain\User\Models\User;

class TrailingWeeksPerformance extends Model
{
    use HasFactory;

    protected $table = 'trailing_weeks_performances';

    protected $fillable = [
        'driver_amazon_id',
        'year',
        'week',

        'fico_score',
        'seatbelt_off_rate',
        'speeding_event_ratio',
        'distraction_rate',
        'following_distance_rate',
        'signal_violations_rate',

        'cdf',
        'dcr',
        'dsb',
        'swc_pod',
        'psb',
        'swc_cc',
        'swc_ad',

        'performer_status',
        'weeks_fantastic',
        'weeks_great',
        'weeks_fair',
        'weeks_poor',
        'document_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'driver_amazon_id', 'driver_amazon_id');
    }

    public function document(): void
    {
        $this->belongsTo(Document::class, 'document_id', 'id');
    }
}
