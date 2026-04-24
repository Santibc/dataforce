<?php

namespace Src\Domain\DailyLog\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Src\Domain\Company\Models\Company;
use Src\Domain\DailyLog\QueryBuilder\EventTypeQueryBuilder;

class EventType extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'event_types';

    protected $fillable = [
        'company_id',
        'name',
        'slug',
        'default_severity',
        'default_description',
        'default_action_taken',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function newEloquentBuilder($query)
    {
        return new EventTypeQueryBuilder($query);
    }
}
