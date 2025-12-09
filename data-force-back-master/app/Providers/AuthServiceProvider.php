<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;
use Src\Domain\User\Policies\UserPolicy;
use Src\User\Role\Policies\RolePolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        VerifyEmail::toMailUsing(function ($notifiable, $url) {
            $message = (new MailMessage)
                ->salutation(__('regards'))
                ->greeting(__('hello'))
                ->subject(__('verifyEmailSubject'))
                ->line(__('verificationMessage'))
                ->action(__('verifyEmailSubject'), $url);
            $message->viewData['image_url'] = asset('app_logo.png');
            return $message;
        });

        ResetPassword::toMailUsing(function($notifable, $token){
            $url                            = config('app.spa_url') . "/#/auth/reset-password/" . $token;
            $message = (new MailMessage)
                ->salutation(__('regards'))
                ->greeting(__('hello'))
                ->subject(__('passwordResetSubject'))
                ->line(__('passwordResetMessage'))
                ->action(__('passwordResetButton'), $url)
                ->line(__('passwordResetWarning'));
            $message->viewData['image_url'] = asset('app_logo.png');
            return $message;
        });

        Auth::attempt();

//        SetPasswordNotification::toMailUsing(function ($notifable, $url){
//            $message = (new MailMessage)
//                ->salutation(__('regards'))
//                ->greeting(__('hello'))
//                ->subject(__('verifyEmailSubject'))
//                ->line(__('verificationMessage'))
//                ->action(__('verifyEmailSubject'), $url);
//            $message->viewData['image_url'] = asset('app_logo.png');
//            return $message;
//        });


        //gate
    }
}
