<?php

namespace Src\Domain\User\QueryBuilders;

use Illuminate\Database\Eloquent\Builder;
use Src\Domain\Jobsite\Models\Jobsite;

class UserQueryBuilder extends Builder
{
    public function whereJobsites(int|Jobsite|array $jobsites)
    {

        if (is_array($jobsites)) {
            return $this->whereHas('jobsites', fn ($q) => $q->whereIn('jobsites.id', $jobsites));
        }

        if ($jobsites instanceof Jobsite) {
            return $this->whereHas('jobsites', fn ($q) => $q->where('jobsites.id', $jobsites->id));
        }

        return $this->whereHas('jobsites', fn ($q) => $q->where('jobsites.id', $jobsites));

    }

    public function currentCompany()
    {
        return $this->where('company_id', auth()->user()->company_id);
    }

    public function whereIsNotBosmetricUser(): UserQueryBuilder
    {
        return $this->where('firstName', '<>', 'Bos Metrics Admin');
    }
}
