<?php

namespace Src\Application\Auth\Data;

use Spatie\LaravelData\Data;

class LoginData extends Data
{
    public string $email;

    public string $password;
}
