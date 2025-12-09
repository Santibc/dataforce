<?php

namespace Src\Domain\Subscription\Services;

use Illuminate\Support\Facades\Facade;

/**
 * @see SubscriptionService
 */
class SubscriptionServiceFacade extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return 'SubscriptionService';
    }
}
