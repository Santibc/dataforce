<?php

namespace Src\Application\Admin\User\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\DataCollection;
use Src\Application\Admin\Jobsite\Resource\JobsiteResource;
use Src\Application\Admin\Position\Resource\PositionResource;

class UserData extends Data
{
    public function __construct(
        public int $id,
        public string $firstname,
        public string $lastname,
        public string $email,
        public string $phone_number,
        public string $driver_amazon_id,
        public array $roles,
        #[DataCollectionOf(PositionResource::class)]
        public DataCollection $positions,
        #[DataCollectionOf(JobsiteResource::class)]
        public DataCollection $jobsites,
    ) {}
}
