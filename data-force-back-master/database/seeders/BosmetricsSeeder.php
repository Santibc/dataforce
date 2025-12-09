<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Src\Domain\Company\Models\Company;
use Src\Domain\User\Models\User;

class BosmetricsSeeder extends Seeder
{

    public function run()
    {

        $user  = User::create(
            [
                'firstname'         => 'Victor',
                'lastname'          => 'Barroso',
                'email'             => 'vb.admin@bosmetrics.com',
                'email_verified_at' => now(),
                'password'          => Hash::make('2381747823VRb-'),
                'phone_number'      => '+15617209633',
                'driver_amazon_id'  => 'VICTORBOSMETRICS',
                'company_id'        => null
            ]
        );

        $user->assignRole(['super_admin']);

    }

}
