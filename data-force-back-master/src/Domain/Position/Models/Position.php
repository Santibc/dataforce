<?php

namespace Src\Domain\Position\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Src\Domain\Position\QueryBuilder\PositionQueryBuilder;
use Src\Domain\User\Models\User;

class Position extends Model
{
    use HasFactory;

    protected $table = 'positions';

    protected $fillable = [
        'name',
        'from',
        'to',
        'color',
        'company_id',
    ];

    protected $casts = [
        'from' => 'datetime',
        'to' => 'datetime',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    public function newEloquentBuilder($query)
    {
        return new PositionQueryBuilder($query);
    }
}
