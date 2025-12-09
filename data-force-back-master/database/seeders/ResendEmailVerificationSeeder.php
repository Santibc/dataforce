<?php


namespace Database\Seeders;


use Hash;
use Illuminate\Database\Seeder;
use Src\Domain\User\Enums\Roles;
use Spatie\Permission\Models\Role;
use Src\Domain\User\Models\User;

class ResendEmailVerificationSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->admin()->create([
            'name' => 'joaquin',
            'email' => 'joaquin@vadiun.com',
            'password' => Hash::make('joaquin'),
        ]);
        User::factory()->admin()->unverified()->create([
            'name' => 'federico',
            'email' => 'federico@vadiun.com',
            'password' => Hash::make('federico')
        ]);
    }
}
