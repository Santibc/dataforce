<?php


namespace Database\Seeders;


use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;

class CreateTokenFromCredentialsSeeder extends Seeder
{
    public function run(): void
    {
        $role = Role::create(['name' => Roles::SUPER_ADMIN]);
        $u1 = User::factory()->create([
            'name' => 'joaquin',
            'email' => 'joaquin@vadiun.com',
            'password' => Hash::make('joaquin'),
        ]);

        $u2 = User::factory()->unverified()->create([
            'name' => 'federico',
            'email' => 'federico@vadiun.com',
            'password' => Hash::make('federico')
        ]);
        $u1->assignRole([Roles::SUPER_ADMIN]);
        $u2->assignRole([Roles::SUPER_ADMIN]);
    }
}
