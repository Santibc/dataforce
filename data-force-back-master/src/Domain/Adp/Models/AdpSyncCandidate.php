<?php

namespace Src\Domain\Adp\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Src\Domain\Company\Models\Company;
use Src\Domain\User\Models\User;

class AdpSyncCandidate extends Model
{
    protected $table = 'adp_sync_candidates';

    // Clasificacion del worker frente a los drivers existentes.
    public const CLASS_MATCHED = 'matched';

    public const CLASS_AMBIGUOUS = 'ambiguous';

    public const CLASS_NEW = 'new';

    // Estado de la revision.
    public const STATUS_PENDING = 'pending';

    public const STATUS_LINKED = 'linked';

    public const STATUS_CREATED = 'created';

    public const STATUS_IGNORED = 'ignored';

    protected $fillable = [
        'company_id',
        'adp_aoid',
        'payload',
        'possible_matches',
        'classification',
        'status',
        'resolved_user_id',
    ];

    protected $casts = [
        'payload' => 'array',
        'possible_matches' => 'array',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function resolvedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_user_id');
    }
}
