<?php

namespace Src\Auth\Actions\DTOS;

use Spatie\DataTransferObject\DataTransferObject;

class SetPasswordActionDTO extends DataTransferObject
{
    public string $password;

    public string $token;
}
