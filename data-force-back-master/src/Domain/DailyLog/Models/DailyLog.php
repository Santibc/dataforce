<?php

namespace Src\Domain\DailyLog\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Src\Domain\Company\Models\Company;
use Src\Domain\DailyLog\QueryBuilder\DailyLogQueryBuilder;
use Src\Domain\User\Models\User;

class DailyLog extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'daily_logs';

    protected $fillable = [
        'date',
        'driver_id',
        'event_type',
        'description',
        'severity',
        'action_taken',
        'admin_id',
        'company_id',
        'status',
        'submitted_at',
    ];

    protected $casts = [
        'date' => 'date',
        'submitted_at' => 'datetime',
    ];

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function newEloquentBuilder($query)
    {
        return new DailyLogQueryBuilder($query);
    }
}
