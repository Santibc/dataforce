<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Laravel\Cashier\Subscription;
use Src\Domain\Company\Models\Company;
use Src\Domain\User\Models\User;

class ApplyManualSubscription extends Command
{
    protected $signature = 'subscription:apply-manual {email : The email of any user in the company}';

    protected $description = 'Apply or fix a manual subscription for a company by user email';

    public function handle(): int
    {
        $email = $this->argument('email');

        $user = User::where('email', $email)->first();
        if (!$user) {
            $this->error("User not found with email: {$email}");
            return Command::FAILURE;
        }

        $company = $user->company;
        if (!$company) {
            $this->error("User does not belong to any company.");
            return Command::FAILURE;
        }

        $this->info("Company found: {$company->name} (ID: {$company->id})");

        $userCount = User::where('company_id', $company->id)
            ->where('firstname', '<>', 'Bos Metrics Admin')
            ->count();

        $this->info("Active users (excluding Bos Metrics Admin): {$userCount}");

        $subscription = Subscription::where('company_id', $company->id)
            ->where('type', 'default')
            ->first();

        $manualStripeId = 'manual_' . Str::slug($company->name, '_') . '_' . $company->id;

        if ($subscription) {
            $this->info("Existing subscription found (ID: {$subscription->id})");
            $this->table(
                ['Field', 'Current Value', 'New Value'],
                [
                    ['type', $subscription->type, 'default'],
                    ['stripe_id', $subscription->stripe_id, str_starts_with($subscription->stripe_id, 'manual_') ? $subscription->stripe_id : $manualStripeId],
                    ['stripe_status', $subscription->stripe_status, 'active'],
                    ['quantity', $subscription->quantity ?? 'NULL', $userCount],
                ]
            );

            if (!$this->confirm('Do you want to apply these changes?')) {
                $this->info('Operation cancelled.');
                return Command::SUCCESS;
            }

            $updateData = [
                'type' => 'default',
                'stripe_status' => 'active',
                'quantity' => $userCount,
                'ends_at' => null,
            ];

            if (!str_starts_with($subscription->stripe_id, 'manual_')) {
                $updateData['stripe_id'] = $manualStripeId;
            }

            $subscription->update($updateData);

            $this->info('Subscription updated successfully!');
        } else {
            $this->info("No existing subscription found. Creating new one...");

            $this->table(
                ['Field', 'Value'],
                [
                    ['company_id', $company->id],
                    ['type', 'default'],
                    ['stripe_id', $manualStripeId],
                    ['stripe_status', 'active'],
                    ['quantity', $userCount],
                ]
            );

            if (!$this->confirm('Do you want to create this subscription?')) {
                $this->info('Operation cancelled.');
                return Command::SUCCESS;
            }

            Subscription::create([
                'company_id' => $company->id,
                'type' => 'default',
                'stripe_id' => $manualStripeId,
                'stripe_status' => 'active',
                'stripe_price' => null,
                'quantity' => $userCount,
                'trial_ends_at' => null,
                'ends_at' => null,
            ]);

            $this->info('Manual subscription created successfully!');
        }

        $this->newLine();
        $this->info("Summary for company: {$company->name}");
        $final = Subscription::where('company_id', $company->id)->where('type', 'default')->first();
        $this->table(
            ['Field', 'Value'],
            [
                ['ID', $final->id],
                ['Company ID', $final->company_id],
                ['Type', $final->type],
                ['Stripe ID', $final->stripe_id],
                ['Status', $final->stripe_status],
                ['Quantity', $final->quantity],
            ]
        );

        return Command::SUCCESS;
    }
}
