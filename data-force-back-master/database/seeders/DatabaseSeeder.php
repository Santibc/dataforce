<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Src\Domain\Company\Models\Company;
use Src\Domain\User\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        Role::create(['name' => 'super_admin', 'guard_name' => 'web']);
        \Artisan::call('shield:generate');
        Role::create(['name' => 'admin', 'guard_name' => 'web']);
        Role::create(['name' => 'owner', 'guard_name' => 'web']);
        Role::create(['name' => 'manager', 'guard_name' => 'web']);
        Role::create(['name' => 'user', 'guard_name' => 'web']);

        $user  = User::create(
            [
                'firstname'         => 'super_admin',
                'lastname'          => 'apellido_superadmin',
                'email'             => 'hitoceanadmin@admin.com',
                'email_verified_at' => now(),
                'password'          => Hash::make('Hitocean3684533!'),
                'phone_number'      => '+5491162723232',
                'driver_amazon_id'  => '232jhj3232',
            ]
        );

        $user->assignRole(['super_admin']);

//        $this->addPermissionToRole($admin, 'user');
    }

//    private function addPermissionToRole(Role $role, string $resource): void
//    {
//        echo "\033[93m Add permissions for resource:$resource to role:{$role->name}\n";
//
//        $role->givePermissionTo([
//                                    'view_' . $resource,
//                                    'view_any_' . $resource,
//                                    'create_' . $resource,
//                                    'delete_' . $resource,
//                                    'delete_any_' . $resource,
//                                    'update_' . $resource,
//                                    'export_' . $resource,
//                                ]);
//    }
}
