<?php

namespace Src\Domain\Performance\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Src\Domain\Document\Models\Document;
use Src\Domain\Performance\QueryBuilders\PerformanceQueryBuilder;
use Src\Domain\User\Models\User;

class Performance extends Model
{
    use HasFactory;

    protected $table = 'performance';

    protected $fillable = [
        'serial_number',
        'driver_amazon_id',
        'overall_tier',
        'fico_score',
        'seatbelt_off_rate',
        'speeding_event_ratio',
        'distraction_rate',
        'following_distance_rate',
        'signal_violations_rate',
        'cdf',
        'dcr',
        'pod', // pod_opps
        'cc',
        'delivered',
        'week',
        'year',
        'key_focus_area',
        'ced',
        'dsb',
        'swc_pod',
        'swc_cc',
        'swc_ad',
        'dsb_dnr',
        'psb',
        'document_id',

    ];

    public function newEloquentBuilder($query)
    {
        return new PerformanceQueryBuilder($query);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'driver_amazon_id', 'driver_amazon_id');
    }

    public function document()
    {
        return $this->belongsTo(Document::class, 'document_id', 'id');
    }
}
