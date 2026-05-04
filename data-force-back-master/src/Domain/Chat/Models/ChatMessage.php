<?php

namespace Src\Domain\Chat\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Src\Domain\Chat\QueryBuilders\ChatMessageQueryBuilder;
use Src\Domain\Company\Models\Company;
use Src\Domain\User\Models\User;

class ChatMessage extends Model implements HasMedia
{
    use InteractsWithMedia;

    public const ATTACHMENT_COLLECTION = 'attachment';

    public const ATTACHMENT_DISK = 'chat_uploads';

    public const ALLOWED_ATTACHMENT_MIMES = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    protected $table = 'chat_messages';

    protected $fillable = [
        'chat_group_id',
        'user_id',
        'body',
        'company_id',
    ];

    public function newEloquentBuilder($query)
    {
        return new ChatMessageQueryBuilder($query);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection(self::ATTACHMENT_COLLECTION)
            ->useDisk(self::ATTACHMENT_DISK)
            ->singleFile()
            ->acceptsMimeTypes(self::ALLOWED_ATTACHMENT_MIMES);
    }

    public function addAttachment(UploadedFile $file): Media
    {
        return $this->addMedia($file)
            ->toMediaCollection(self::ATTACHMENT_COLLECTION, self::ATTACHMENT_DISK);
    }

    public function getAttachment(): ?Media
    {
        return $this->getFirstMedia(self::ATTACHMENT_COLLECTION);
    }

    public static function attachmentKindFor(?Media $media): ?string
    {
        if (! $media) {
            return null;
        }

        return Str::startsWith($media->mime_type, 'image/') ? 'image' : 'document';
    }

    public function group()
    {
        return $this->belongsTo(ChatGroup::class, 'chat_group_id');
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
