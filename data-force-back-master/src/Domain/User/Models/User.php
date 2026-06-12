<?php

namespace Src\Domain\User\Models;

use Filament\Models\Contracts\FilamentUser;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Src\Domain\Chat\Models\ChatGroup;
use Src\Domain\Company\Models\Company;
use Src\Domain\Jobsite\Models\Jobsite;
use Src\Domain\Performance\Models\Performance;
use Src\Domain\Position\Models\Position;
use Src\Domain\Preferences\Models\Preference;
use Src\Domain\Shift\Models\Shift;
use Src\Domain\User\QueryBuilders\UserQueryBuilder;

class User extends Authenticatable implements FilamentUser, MustVerifyEmail
{
    use HasApiTokens, HasFactory, HasRoles, Notifiable;

    protected $fillable = [
        'firstname',
        'lastname',
        'email',
        'password',
        'phone_number',
        'driver_amazon_id',
        'company_id',
        'notification_token',
        'adp_aoid',
        'adp_worker_id',
        'adp_linked',
        'adp_manager_aoid',
        'adp_active',
        'adp_history_synced_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'adp_linked' => 'boolean',
        'adp_active' => 'boolean',
        'adp_history_synced_at' => 'datetime',
    ];

    public function newEloquentBuilder($query)
    {
        return new UserQueryBuilder($query);
    }

    public function canAccessFilament(): bool
    {
        return true;
    }

    public function guardName(): string
    {
        return 'web';
    }

    public function positions()
    {
        return $this->belongsToMany(Position::class);
    }

    public function jobsites()
    {
        return $this->belongsToMany(Jobsite::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function shifts()
    {
        return $this->hasMany(Shift::class, 'user_id');
    }

    public function preferences()
    {
        return $this->hasMany(Preference::class, 'user_id');
    }

    public function performance()
    {
        return $this->hasMany(Performance::class, 'driver_amazon_id', 'driver_amazon_id');
    }

    public function chatGroups()
    {
        return $this->belongsToMany(ChatGroup::class, 'chat_group_members')
            ->wherePivotNull('left_at')
            ->withPivot('joined_at');
    }
}
