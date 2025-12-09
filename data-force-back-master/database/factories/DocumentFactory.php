<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Http\UploadedFile;
use Src\Domain\Company\Models\Company;
use Src\Domain\Document\Models\Document;

class DocumentFactory extends Factory
{
    protected $model = Document::class;

    public function definition()
    {
        return [
            'name'  => $this->faker->name,
            'performance_count' => $this->faker->randomNumber(0, 0, 100),
            'company_id' => Company::factory()
        ];
    }

    public function withFile(){
        return $this->afterCreating(function (Document $document){
            $test_file = UploadedFile::fake()->create('file_test.pdf', 100);
            $document->addFile($test_file);
        });
    }
}
