<?php

namespace Src\Domain\Subscription\Services;

use Src\Domain\Company\Models\Company;

class SubscriptionService
{
    public function increaseSeats(Company $company, int $amount): void
    {
        $subscription = $this->getSubscription($company);
        if ($subscription !== null) {
            if ($this->isManualSubscription($subscription)) {
                $subscription->increment('quantity', $amount);
            } else {
                $subscription->incrementQuantity($amount);
            }
        }
    }

    public function decrementSeats(Company $company, int $amount): void
    {
        $subscription = $this->getSubscription($company);
        if ($subscription !== null) {
            if ($this->isManualSubscription($subscription)) {
                $subscription->decrement('quantity', $amount);
            } else {
                $subscription->decrementQuantity($amount);
            }
        }
    }

    public function updateSeats(Company $company, int $amount): void
    {
        $subscription = $this->getSubscription($company);
        if ($subscription !== null) {
            if ($this->isManualSubscription($subscription)) {
                $subscription->update(['quantity' => $amount]);
            } else {
                $subscription->updateQuantity($amount);
            }
        }
    }

    public function cancelSubscription(Company $company): void
    {
        $subscription = $this->getSubscription($company);
        if ($subscription === null) {
            throw new \RuntimeException('Company does not have a subscription');
        }
        if ($this->isManualSubscription($subscription)) {
            $subscription->update(['stripe_status' => 'canceled', 'ends_at' => now()]);
        } else {
            $subscription->cancel();
        }
    }

    public function getSubscription(Company $company): ?\Laravel\Cashier\Subscription
    {
        return $company->subscription('default');
    }

    public function isSubscribed(Company $company): bool
    {
        return $company->subscribed('default');
    }

    private function isManualSubscription(\Laravel\Cashier\Subscription $subscription): bool
    {
        return str_starts_with($subscription->stripe_id, 'manual_');
    }
}
