<?php

namespace Src\Application\Driver\Notifications\Data;

use Illuminate\Http\Request;
use Spatie\LaravelData\Attributes\WithoutValidation;
use Spatie\LaravelData\Data;

class UpdateNotificationTokenData extends Data
{
    public function __construct(
        #[WithoutValidation]
        public int $user_id,
        public string $token,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            auth()->user()->id,
            $request->get('token')
        );
    }
}
