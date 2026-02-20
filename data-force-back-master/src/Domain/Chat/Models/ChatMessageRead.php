<?php

namespace Src\Domain\Chat\Models;

use Illuminate\Database\Eloquent\Model;
use Src\Domain\User\Models\User;

class ChatMessageRead extends Model
{
    public $timestamps = false;

    protected $table = 'chat_message_reads';

    protected $fillable = [
        'chat_group_id',
        'user_id',
        'last_read_message_id',
        'read_at',
    ];

    protected $casts = [
        'read_at' => 'datetime',
    ];

    public function group()
    {
        return $this->belongsTo(ChatGroup::class, 'chat_group_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function lastReadMessage()
    {
        return $this->belongsTo(ChatMessage::class, 'last_read_message_id');
    }
}
