<?php

namespace Src\Domain\Performance\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Src\Domain\Document\Models\Document;
use Src\Domain\Performance\QueryBuilders\PerformanceQueryBuilder;

class SafetyAndCompliance extends Model
{
    use HasFactory;

    protected $table = 'safetys_and_compliances';

    protected $fillable = [
        'value',
        'on_road_safety_score',
        'safe_driving_metric',
        'seatbelt_off_rate',
        'speeding_event_rate',
        'sign_violations_rate',
        'distractions_rate',
        'following_distance_rate',
        'breach_of_contract',
        'comprehensive_audit',
        'working_hour_compliance',
        'week',
        'year',
        'company_id',
        'document_id',

    ];

    public function newEloquentBuilder($query)
    {
        return new PerformanceQueryBuilder($query);
    }

    public function document(): void
    {
        $this->belongsTo(Document::class, 'document_id', 'id');
    }
}
