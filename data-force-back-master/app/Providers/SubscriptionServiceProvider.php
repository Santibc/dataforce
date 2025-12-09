<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Src\Domain\Subscription\Services\SubscriptionService;

class SubscriptionServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind('SubscriptionService', function () {
            return new SubscriptionService();
        });
    }
}
