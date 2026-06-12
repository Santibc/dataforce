<?php

namespace Src\Application\Admin\Adp\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\DataCollection;

class ConfirmAdpSyncData extends Data
{
    public function __construct(
        /** @var DataCollection<int, AdpSyncDecisionData> */
        public DataCollection $decisions,
    ) {
    }

    public static function rules(): array
    {
        return [
            'decisions' => ['required', 'array', 'min:1'],
        ];
    }
}
