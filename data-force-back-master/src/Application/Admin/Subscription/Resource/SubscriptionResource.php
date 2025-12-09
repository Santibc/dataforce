<?php

namespace Src\Application\Admin\Subscription\Resource;

use Laravel\Cashier\Subscription;
use Spatie\LaravelData\Data;

class SubscriptionResource extends Data
{
    public function __construct(
        public int $id,
        public ?string $status,
        public ?string $ends_at,
        public int $seats,
    ) {}

    public static function fromModel(Subscription $subscription): self
    {
        return new self(
            $subscription->id,
            $subscription->stripe_status,
            $subscription->ends_at,
            $subscription->quantity,
        );
    }
}
