<?php

namespace Src\Domain\Shift\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Src\Domain\Jobsite\Models\Jobsite;
use Src\Domain\Shift\Collections\ShiftCollection;
use Src\Domain\Shift\QueryBuilder\ShiftQueryBuilder;
use Src\Domain\User\Models\User;

class Shift extends Model
{
    use HasFactory;

    protected $table = 'shifts';

    protected $fillable = [
        'name',
        'from',
        'to',
        'color',
        'jobsite_id',
        'user_id',
        'published',
        'confirmed',
        'delete_after_published',
    ];

    protected $casts = [
        'from' => 'datetime',
        'to' => 'datetime',
        'confirmed' => 'boolean',
    ];

    public function newEloquentBuilder($query)
    {
        return new ShiftQueryBuilder($query);
    }

    public function newCollection(array $models = [])
    {
        return new ShiftCollection($models);
    }

    public function jobsite()
    {
        return $this->belongsTo(Jobsite::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
