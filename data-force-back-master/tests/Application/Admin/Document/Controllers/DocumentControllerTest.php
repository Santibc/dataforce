<?php

namespace Tests\Application\Admin\Document\Controllers;

use Src\Application\Admin\Document\Controllers\DocumentsController;
use Src\Domain\Document\Models\Document;
use Src\Domain\Performance\Models\Performance;
use Src\Domain\Performance\Models\Quality;
use Src\Domain\Performance\Models\SafetyAndCompliance;
use Src\Domain\Performance\Models\Team;
use Src\Domain\Performance\Models\TrailingWeeksPerformance;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;
use Tests\TestCase;

class DocumentControllerTest extends TestCase
{
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->withRole(Roles::ADMIN)->create();
        $this->actingAs($this->user);
    }

    /** @test */
    public function update_a_document(): void
    {
        $document = Document::factory()->withFile()->create([
            'user_id' => $this->user->id,
            'company_id' => $this->user->company_id,
        ]);

        $action = action([DocumentsController::class, 'update'], ['document' => $document]);

        $data = [
            'name' => 'new document name',
        ];

        $response = $this->put($action, $data);

        $response->assertNoContent();

        $this->assertDatabaseHas('documents', [
            'id' => $document->id,
            'name' => $data['name'],
            'user_id' => $this->user->id,
            'company_id' => $this->user->company_id,
        ]);
    }

    /** @test */
    public function show_a_document(): void
    {
        $document = Document::factory()->withFile()->create([
            'user_id' => $this->user->id,
            'company_id' => $this->user->company_id,
        ]);

        $action = action([DocumentsController::class, 'show'], ['document' => $document]);

        $response = $this->get($action);

        $response->assertOk();

        $file = $document->getFile();

        $response->assertExactJson([
            'id' => $document->id,
            'name' => $document->name,
            'size' => $file->size,
            'type' => $file->mime_type,
            'performance_count' => $document->performance_count,
            'imported_by' => [
                'id' => $this->user->id,
                'email' => $this->user->email,
            ],
            'updated_at' => $document->updated_at->format(DATE_ATOM),
        ]);
    }

    /** @test */
    public function list_documents(): void
    {
        $document1 = Document::factory()->withFile()->create([
            'user_id' => $this->user->id,
            'company_id' => $this->user->company_id,
        ]);

        $document2 = Document::factory()->withFile()->create([
            'user_id' => $this->user->id,
            'company_id' => $this->user->company_id,
        ]);

        $action = action([DocumentsController::class, 'index']);

        $response = $this->get($action);

        $response->assertOk();

        $file1 = $document1->getFile();
        $file2 = $document2->getFile();

        $response->assertJson([
            [
                'id' => $document1->id,
                'name' => $document1->name,
                'size' => $file1->size,
                'type' => $file1->mime_type,
                'performance_count' => $document1->performance_count,
                'imported_by' => [
                    'id' => $this->user->id,
                    'email' => $this->user->email,
                ],
                'updated_at' => $document1->updated_at->format(DATE_ATOM),
            ],
            [
                'id' => $document2->id,
                'name' => $document2->name,
                'size' => $file2->size,
                'type' => $file2->mime_type,
                'performance_count' => $document2->performance_count,
                'imported_by' => [
                    'id' => $this->user->id,
                    'email' => $this->user->email,
                ],
                'updated_at' => $document2->updated_at->format(DATE_ATOM),
            ],
        ]);
    }

    /** @test */
    public function download_a_document(): void
    {
        $document = Document::factory()->withFile()->create([
            'user_id' => $this->user->id,
            'company_id' => $this->user->company_id,
        ]);

        $action = action([DocumentsController::class, 'download'], ['document' => $document]);

        $response = $this->get($action);

        $response->assertOk();

        $response->assertDownload();
    }

    /** @test */
    public function delete_a_document(): void
    {
        $document = Document::factory()->withFile()->create([
            'user_id' => $this->user->id,
            'company_id' => $this->user->company_id,
        ]);

        $team = Team::factory()->create(['document_id' => $document->id]);
        $performance = Performance::factory()->create(['document_id' => $document->id]);
        $safety = SafetyAndCompliance::factory()->create(['document_id' => $document->id]);
        $quality = Quality::factory()->create(['document_id' => $document->id]);
        $trailing = TrailingWeeksPerformance::factory()->create(['document_id' => $document->id]);

        $action = action([DocumentsController::class, 'destroy'], $document->id);

        $response = $this->delete($action);

        $response->assertOk();

        $this->assertDatabaseMissing('teams', [
            'id' => $team->id,
        ]);
        $this->assertDatabaseMissing('performance', [
            'id' => $performance->id,
        ]);
        $this->assertDatabaseMissing('qualitys', [
            'id' => $quality->id,
        ]);
        $this->assertDatabaseMissing('safetys_and_compliances', [
            'id' => $safety->id,
        ]);
        $this->assertDatabaseMissing('trailing_weeks_performances', [
            'id' => $trailing->id,
        ]);
    }
}
