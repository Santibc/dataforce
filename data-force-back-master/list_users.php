<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Buscar usuarios con driver_amazon_id=56546 en company 3
echo "Buscando usuarios con driver_amazon_id=56546 en company 3:\n";
$users = Src\Domain\User\Models\User::where('company_id', 3)->where('driver_amazon_id', '56546')->get();
foreach($users as $u) {
    echo $u->id . ' | ' . $u->email . ' | driver_amazon_id: ' . $u->driver_amazon_id . "\n";
}
echo "Total: " . $users->count() . "\n";

echo "\nTodos los usuarios de company 3:\n";
$users = Src\Domain\User\Models\User::where('company_id', 3)->get();
foreach($users as $u) {
    echo $u->id . ' | ' . $u->firstname . ' ' . $u->lastname . ' | ' . $u->email . ' | driver_amazon_id: ' . $u->driver_amazon_id . "\n";
}
