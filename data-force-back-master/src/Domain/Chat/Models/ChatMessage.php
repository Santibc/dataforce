<?php

namespace Src\Domain\Chat\Models;

use Illuminate\Database\Eloquent\Model;
use Src\Domain\Chat\QueryBuilders\ChatMessageQueryBuilder;
use Src\Domain\Company\Models\Company;
use Src\Domain\User\Models\User;

class ChatMessage extends Model
{
    protected $table = 'chat_messages';

    protected $fillable = [
        'chat_group_id',
        'user_id',
        'body',
        'company_id',
    ];

    public function newEloquentBuilder($query)
    {
        return new ChatMessageQueryBuilder($query);
    }

    public function group()
    {
        return $this->belongsTo(ChatGroup::class, 'chat_group_id');
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
