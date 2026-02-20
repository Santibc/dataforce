<?php

namespace Src\Domain\Chat\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Src\Domain\Chat\QueryBuilders\ChatGroupQueryBuilder;
use Src\Domain\Company\Models\Company;
use Src\Domain\User\Models\User;

class ChatGroup extends Model
{
    use SoftDeletes;

    protected $table = 'chat_groups';

    protected $fillable = [
        'name',
        'type',
        'mode',
        'auto_add_new_members',
        'show_history_to_new_members',
        'company_id',
        'created_by',
    ];

    protected $casts = [
        'auto_add_new_members' => 'boolean',
        'show_history_to_new_members' => 'boolean',
    ];

    public function newEloquentBuilder($query)
    {
        return new ChatGroupQueryBuilder($query);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function members()
    {
        return $this->hasMany(ChatGroupMember::class);
    }

    public function activeMembers()
    {
        return $this->hasMany(ChatGroupMember::class)->whereNull('left_at');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'chat_group_members')
            ->wherePivotNull('left_at')
            ->withPivot('joined_at');
    }

    public function messages()
    {
        return $this->hasMany(ChatMessage::class);
    }

    public function latestMessage()
    {
        return $this->hasOne(ChatMessage::class)->latestOfMany();
    }

    public function isGlobal(): bool
    {
        return $this->type === 'global';
    }

    public function isUnilateral(): bool
    {
        return $this->mode === 'unilateral';
    }

    public function isBidirectional(): bool
    {
        return $this->mode === 'bidirectional';
    }
}
