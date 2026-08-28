<?php

namespace Src\Domain\Company\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Laravel\Cashier\Billable;
use Src\Domain\Adp\Models\AdpConnection;
use Src\Domain\Jobsite\Models\Jobsite;
use Src\Domain\Position\Models\Position;
use Src\Domain\User\Models\User;

class Company extends Model
{
    use Billable, HasFactory;

    protected $table = 'companies';

    protected $fillable = [
        'name',
        'address',
        'driver_amount',
        'fleat_size',
        'payroll',
        'overtime_threshold',
        'daily_hours_limit',
        'daily_hours_warning',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function jobsites()
    {
        return $this->hasMany(Jobsite::class);
    }

    public function positions()
    {
        return $this->hasMany(Position::class);
    }

    public function adpConnection(): HasOne
    {
        return $this->hasOne(AdpConnection::class);
    }
}
