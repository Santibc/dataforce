<?php

namespace Src\Domain\Document\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Src\Domain\Company\Models\Company;
use Src\Domain\Performance\Models\Performance;
use Src\Domain\User\Models\User;

class Document extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'name',
        'company_id',
        'user_id',
        'performance_count',
    ];

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function company(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('file')->singleFile();
    }

    public function addFile(UploadedFile $file): void
    {
        $this->addMedia($file)->toMediaCollection('file');
    }

    public function getFile()
    {
        return $this->getFirstMedia('file');
    }

    public function performances(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Performance::class, 'document_id', 'id');
    }
}
