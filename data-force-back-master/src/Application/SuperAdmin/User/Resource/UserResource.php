<?php

namespace Src\Application\SuperAdmin\User\Resource;

use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\Permission\Models\Role;
use Src\Domain\Jobsite\Models\Jobsite;
use Src\Domain\Position\Models\Position;

class UserResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'firstname' => $this->firstname,
            'lastname' => $this->lastname,
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'driver_amazon_id' => $this->driver_amazon_id,
            'roles' => $this->roles->map(fn (Role $r) => $r->name),
            'positions' => $this->positions->map(fn (Position $p) => [
                'name' => $p->name,
                'id' => $p->id,
                'from' => $p->from,
                'to' => $p->to,
                'color' => $p->color,
            ]),
            'jobsites' => $this->jobsites->map(fn (Jobsite $j) => [
                'id' => $j->id,
                'name' => $j->name,
                'address_street' => $j->address_street,
                'state' => $j->state,
                'city' => $j->city,
                'zip_code' => $j->zip_code,
            ]),
            'company_id' => $this->company_id,
        ];
    }
}
