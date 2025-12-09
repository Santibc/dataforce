<?php

namespace Src\Auth\Actions;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Src\Auth\Actions\DTOS\SetPasswordActionDTO;
use Src\Auth\Request\SetPasswordActionRequest;
use Src\Domain\User\Models\User;

class SetPasswordAction
{
    public function handle(SetPasswordActionDTO $dto): void
    {
        $user_id = \Crypt::decrypt($dto->token)['user_id'];
        $user = User::findOrFail($user_id);
        $user->password = Hash::make($dto->password);
        if (is_null($user->email_verified_at)) {
            $user->email_verified_at = now();
        }
        $user->save();
    }

    public function asController(SetPasswordActionRequest $request): void
    {

        $dto = new SetPasswordActionDTO($request->all());
        DB::transaction(fn () => $this->handle($dto));
    }
}
