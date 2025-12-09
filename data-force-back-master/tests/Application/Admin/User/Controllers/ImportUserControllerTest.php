<?php

namespace Tests\Application\Admin\User\Controllers;

use Illuminate\Http\UploadedFile;
use Src\Application\Admin\User\Controllers\ImportUserController;
use Src\Domain\Jobsite\Models\Jobsite;
use Src\Domain\Position\Models\Position;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;
use Tests\TestCase;

class ImportUserControllerTest extends TestCase
{
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->withRole(Roles::ADMIN)->create();
        $this->actingAs($this->user);
    }

    /** @test */
    public function archivo_correcto(): void
    {
        \SubscriptionService::shouldReceive('updateSeats')->once()->withArgs(
            function ($company, $amount) {
                return $this->user->company->id === $company->id && $amount === 2;
            }
        );
        Position::factory()->create(['name' => 'driver', 'company_id' => $this->user->company_id]);
        Jobsite::factory()->create(['name' => 'Ignacio Irigoitia', 'company_id' => $this->user->company_id]);
        $a = new UploadedFile(
            base_path('tests/Application/Admin/User/Excels/import_user_2.xlsx'),
            'import_user_2.xlsx',
            null,
            null,
            true
        );

        try {
            $this->post(action([ImportUserController::class, 'sync']), ['file' => $a])->assertOk();
        } catch (\Exception $e) {
            $this->assertEquals(400, $e->getCode());
        }

    }
}
