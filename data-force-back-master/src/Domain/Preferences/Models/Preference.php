<?php

namespace Src\Domain\Preferences\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Src\Domain\Preferences\QueryBuilder\PreferenceQueryBuilder;
use Src\Domain\User\Models\User;

class Preference extends Model
{
    use HasFactory;

    protected $table = 'preferences';

    protected $fillable = [
        'date',
        'available',
        'user_id',
    ];

    protected $casts = [
        'date' => 'datetime',
        'available' => 'boolean',
    ];

    public function newEloquentBuilder($query)
    {
        return new PreferenceQueryBuilder($query);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
