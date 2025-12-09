<?php

namespace App\Providers;

use Filament\Facades\Filament;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Laravel\Cashier\Cashier;
use Src\Domain\Company\Models\Company;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot(): void
    {

        Filament::serving(function (): void {
            Filament::registerTheme(mix('css/app.css'));

        });
        Factory::guessFactoryNamesUsing(
            function ($modelName) {
                return 'Database\\Factories\\'.Str::after($modelName, 'Models\\').'Factory';
            }
        );
        JsonResource::withoutWrapping();

        Cashier::useCustomerModel(Company::class);
    }
}
