<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Credenciales de ADP API Central por compania. Los campos sensibles
     * (client_secret, certificado y clave privada) se guardan cifrados via
     * los casts 'encrypted' del modelo AdpConnection, por eso se declaran
     * como text (el ciphertext es mas largo que el valor original).
     */
    public function up(): void
    {
        Schema::create('adp_connections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();

            $table->string('client_id')->nullable();
            $table->text('client_secret')->nullable();      // encrypted
            $table->text('certificate_pem')->nullable();    // encrypted (PEM publico de ADP)
            $table->text('private_key')->nullable();        // encrypted (PEM, clave privada mTLS)

            $table->string('base_url')->default('https://api.adp.com');
            $table->string('token_url')->default('https://accounts.adp.com/auth/oauth/v2/token');

            $table->text('cached_token')->nullable();        // encrypted (access token vigente)
            $table->timestamp('token_expires_at')->nullable();

            $table->boolean('active')->default(true);
            $table->timestamps();

            $table->unique('company_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('adp_connections');
    }
};
