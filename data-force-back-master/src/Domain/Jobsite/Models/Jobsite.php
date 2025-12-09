<?php

namespace Src\Domain\Jobsite\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Src\Domain\Jobsite\Scopes\JobsiteCompanyScope;
use Src\Domain\User\Models\User;

class Jobsite extends Model
{
    use HasFactory;

    protected $table = 'jobsites';

    protected $fillable = [
        'name',
        'address_street',
        'state',
        'city',
        'zip_code',
        'company_id',
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::addGlobalScope(new JobsiteCompanyScope);
    }

    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}
