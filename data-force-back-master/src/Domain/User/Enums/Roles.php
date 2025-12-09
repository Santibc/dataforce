<?php

namespace Src\Domain\User\Enums;

class Roles
{
    const SUPER_ADMIN = 'super_admin';

    const ADMIN = 'admin';

    const USER = 'user';

    const OWNER = 'owner';

    public static function all(): array
    {
        return [
            self::SUPER_ADMIN,
            self::ADMIN,
            self::USER,
            self::OWNER,
        ];
    }
}
