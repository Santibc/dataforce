<?php

namespace Src\Application\Auth\Controllers;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Lorisleiva\Actions\Concerns\AsAction;
use Src\Domain\User\Models\User;

class VerifyUserAction
{
    use AsAction;

    public function handle($hash, $id)
    {
        $user = User::findOrFail($id);

        if (! hash_equals((string) $id,
            (string) $user->getKey())) {
            throw new ModelNotFoundException('Verification url not found.', 404);
        }

        if (! hash_equals((string) $hash,
            sha1($user->getEmailForVerification()))) {
            throw new ModelNotFoundException('Verification url not found.', 404);
        }
        $user->email_verified_at = now();
        $user->save();

        return $user;
    }

    /**
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     *
     * @throws \Throwable
     *
     * @group Authentication
     */
    public function asController($id, $hash)
    {
        try {
            \DB::transaction(fn () => $this->handle($hash, $id));
        } catch (ModelNotFoundException $e) {
            return redirect(config('app.spa_url').'/email-verification/unsuccessful');
        }

        return redirect(config('app.spa_url').'/email-verification/successful');
    }
}
