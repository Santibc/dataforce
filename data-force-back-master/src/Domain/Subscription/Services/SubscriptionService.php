<?php

namespace Src\Domain\Subscription\Services;

use Src\Domain\Company\Models\Company;

class SubscriptionService
{
    private function checkSubscription(Company $company): void
    {
        if ($this->getSubscription($company) === null) {
            throw new \RuntimeException('Company does not have a subscription');
        }
    }

    public function increaseSeats(Company $company, int $amount): void
    {
        $subscription = $this->getSubscription($company);
        if ($subscription !== null) {
            $subscription->incrementQuantity($amount);
        }
    }

    publisubscription = $this->getSubscription($company);
        if ($subscription !== null) {
            $subscription->decrementQuantity($amount);
        }
        $this->checkSubscription($company);
        $company->subscription('default')->decrementQuantity($amount);
    }

    public function updateSeats(Company $company, int $amount): void
    {
        $subscription = $this->getSubscription($company);
        if ($subscription !== null) {
            $subscription->updateQuantity($amount);
        }
    }

    public function cancelSubscription(Company $company): void
    {
        $this->checkSubscription($company);
        $company->subscription('default')->cancel();
    }

    public function getSubscription(Company $company): ?\Laravel\Cashier\Subscription
    {
        return $company->subscription('default');
    }

    public function isSubscribed(Company $company): bool
    {
        return $company->subscribed('default');
    }
}
