<?php


namespace Database\Seeders;


use Hash;
use Illuminate\Database\Seeder;
use Src\Domain\User\Models\User;

class ResetPasswordSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'joaquin',
            'email' => 'joaquin@vadiun.com',
            'password' => Hash::make('joaquin'),
        ]);
        User::factory()->create([
            'name' => 'federico',
            'email' => 'federico@vadiun.com',
            'password' => Hash::make('federico')
        ]);
    }
}
