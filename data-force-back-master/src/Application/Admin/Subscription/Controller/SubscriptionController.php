<?php

namespace Src\Application\Admin\Subscription\Controller;

use Illuminate\Support\Facades\URL;
use Src\Application\Admin\Subscription\Resource\SubscriptionResource;
use Src\Domain\Company\Models\Company;

class SubscriptionController
{
    public function checkout($company_id): \Laravel\Cashier\Checkout
    {

        if (! request()->hasValidSignature()) {
            abort(401);
        }

        $company = Company::find($company_id);

        if (! $company->stripe_id) {
            $company->createAsStripeCustomer();
        }

        return $company->newSubscription('default', config('app.stripe_price_id'))
            ->checkout([
                'allow_promotion_codes' => true,
                'success_url' => config('app.spa_url').'/#/success-payment',
                'cancel_url' => config('app.spa_url'),
            ]);
    }

    public function billingPortal($company_id): string
    {
        if (! request()->hasValidSignature()) {
            abort(401);
        }

        $company = Company::find($company_id);
        if ($company->stripe_id === null) {
            $company->createAsStripeCustomer();
        }

        return $company->redirectToBillingPortal(config('app.spa_url'));

    }

    public function getSuscriptionInformation(): ?SubscriptionResource
    {
        if (auth()->user()->company->subscription('default') === null) {
            return null;
        }

        return SubscriptionResource::fromModel(auth()->user()->company->subscription('default'));
    }

    public function getCheckoutSignedUrl(): string
    {
        $company_id = auth()->user()->company_id;

        return URL::signedRoute('stripe-checkout', ['company_id' => $company_id]);
    }

    public function getBillingPortalSignedUrl(): string
    {
        $company_id = auth()->user()->company_id;

        return URL::signedRoute('stripe-billing-portal', ['company_id' => $company_id]);
    }
}
