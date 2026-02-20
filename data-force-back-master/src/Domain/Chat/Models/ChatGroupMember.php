<?php

namespace Src\Domain\Chat\Models;

use Illuminate\Database\Eloquent\Model;
use Src\Domain\User\Models\User;

class ChatGroupMember extends Model
{
    public $timestamps = false;

    protected $table = 'chat_group_members';

    protected $fillable = [
        'chat_group_id',
        'user_id',
        'joined_at',
        'left_at',
    ];

    protected $casts = [
        'joined_at' => 'datetime',
        'left_at' => 'datetime',
    ];

    public function group()
    {
        return $this->belongsTo(ChatGroup::class, 'chat_group_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function isActive(): bool
    {
        return $this->left_at === null;
    }
}
