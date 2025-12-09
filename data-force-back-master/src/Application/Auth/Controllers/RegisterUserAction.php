<?php

namespace Src\Application\Auth\Controllers;

use Lorisleiva\Actions\Concerns\AsAction;
use Src\Application\Auth\Controllers\DTOS\RegisterUserDTO;
use Src\Auth\FormRequests\RegisterUserFormRequest;
use Src\Auth\Notifications\SetPasswordNotification;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;
use Src\Domain\User\Resources\UserResource;

class RegisterUserAction
{
    use AsAction;

    public function handle(RegisterUserDTO $dto): User
    {
        $user = User::create([
            'name' => $dto->name,
            'email' => $dto->email,
            'password' => \Hash::make($dto->password),
        ]);
        $user->assignRole([Roles::SUPER_ADMIN]);

        $user->notify(new SetPasswordNotification);

        return $user;
    }

    /**
     * @throws \Spatie\DataTransferObject\Exceptions\UnknownProperties
     * @throws \Throwable
     *
     * @apiResource Src\Domain\User\Resources\UserResource
     *
     * @apiResourceModel Src\Domain\User\Models\User with=roles
     *
     * @group Authentication
     */
    public function asController(RegisterUserFormRequest $request): UserResource
    {
        $dto = new RegisterUserDTO($request->all());
        $user = \DB::transaction(fn () => $this->handle($dto));

        return new UserResource($user);
    }
}
