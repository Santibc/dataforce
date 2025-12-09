<?php

namespace Src\Application\Admin\Roles\Controllers;

use Spatie\Permission\Models\Role;
use Src\Application\Admin\Roles\Resource\RolesResource;

class RolesController
{
    public function index()
    {
        $roles = Role::where('name', '<>', 'super_admin')->get();

        return RolesResource::collection($roles);
    }
}
