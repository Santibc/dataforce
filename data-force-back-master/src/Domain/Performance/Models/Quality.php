<?php

namespace Src\Domain\Performance\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Src\Domain\Document\Models\Document;
use Src\Domain\Performance\QueryBuilders\PerformanceQueryBuilder;

class Quality extends Model
{
    use HasFactory;

    protected $table = 'qualitys';

    protected $fillable = [
        'value',
        'customer_delivery_experience',
        'customer_escalation_defect',
        'customer_delivery_feedback',
        'delivery_completion_rate',
        'delivered_and_received',
        'standard_work_compliance',
        'photo_on_delivery',
        'contact_compliance',
        'attended_delivery_accuracy',
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
