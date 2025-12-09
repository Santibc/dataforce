<?php

namespace Src\Domain\Performance\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Src\Domain\Company\Models\Company;
use Src\Domain\Document\Models\Document;
use Src\Domain\Performance\QueryBuilders\PerformanceQueryBuilder;

class Team extends Model
{
    use HasFactory;

    protected $table = 'teams';

    protected $fillable = [
        'value',
        'high_performers_share',
        'low_performers_share',
        'tenured_workforce',
        'week',
        'year',
        'company_id',
        'document_id',

    ];

    public function newEloquentBuilder($query)
    {
        return new PerformanceQueryBuilder($query);
    }

    public function document()
    {
        return $this->belongsTo(Document::class, 'document_id', 'id');
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id', 'id');
    }
}
