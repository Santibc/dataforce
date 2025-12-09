<?php

namespace Src\Domain\Coaching\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Src\Domain\User\Models\User;

class Coaching extends Model
{
    use HasFactory;

    protected $table = 'coachings';

    protected $fillable = [
        'subject',
        'year',
        'week',
        'category',
        'content',
        'user_id',
        'type',
        'read',
    ];

    protected $casts = [
        'read' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
