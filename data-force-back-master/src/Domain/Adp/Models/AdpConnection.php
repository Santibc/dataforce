<?php

namespace Src\Domain\Adp\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Src\Domain\Company\Models\Company;

class AdpConnection extends Model
{
    protected $table = 'adp_connections';

    protected $fillable = [
        'company_id',
        'client_id',
        'client_secret',
        'certificate_pem',
        'private_key',
        'base_url',
        'token_url',
        'cached_token',
        'token_expires_at',
        'time_cards_synced_at',
        'active',
    ];

    /**
     * Los campos sensibles se cifran en reposo (Laravel encrypted cast).
     */
    protected $casts = [
        'client_secret' => 'encrypted',
        'certificate_pem' => 'encrypted',
        'private_key' => 'encrypted',
        'cached_token' => 'encrypted',
        'token_expires_at' => 'datetime',
        'time_cards_synced_at' => 'datetime',
        'active' => 'boolean',
    ];

    /**
     * Nunca exponer secretos al serializar a JSON (respuestas de API).
     */
    protected $hidden = [
        'client_secret',
        'certificate_pem',
        'private_key',
        'cached_token',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * ¿Tiene lo minimo para autenticar contra ADP?
     */
    public function isConfigured(): bool
    {
        return filled($this->client_id)
            && filled($this->client_secret)
            && filled($this->certificate_pem)
            && filled($this->private_key);
    }
}
