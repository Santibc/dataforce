<?php

namespace Src\Application\SuperAdmin\Chat\Controllers;

use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Src\Application\Admin\Chat\Data\SendMessageData;
use Src\Application\Admin\Chat\Resources\ChatMessageResource;
use Src\Domain\Chat\Models\ChatGroup;
use Src\Domain\Chat\Models\ChatMessage;
use Src\Domain\Chat\Models\ChatMessageRead;

class SuperAdminChatMessageController
{
    public function index(int $id): AnonymousResourceCollection
    {
        $group = ChatGroup::whereNull('company_id')->findOrFail($id);

        $query = ChatMessage::forGroup($group->id)
            ->recent()
            ->with(['sender', 'media'])
            ->orderBy('created_at', 'asc');

        $afterId = request()->input('after_id');
        if ($afterId) {
            $query->afterMessage((int) $afterId);
        }

        $limit = request()->input('limit', 50);
        $messages = $query->limit($limit)->get();

        return ChatMessageResource::collection($messages);
    }

    public function store(int $id, SendMessageData $data): ChatMessageResource
    {
        $group = ChatGroup::whereNull('company_id')->findOrFail($id);

        $message = ChatMessage::create([
            'chat_group_id' => $group->id,
            'user_id' => auth()->id(),
            'body' => $data->body,
            'company_id' => null,
        ]);

        if ($data->attachment) {
            $message->addAttachment($data->attachment);
        }

        $message->load(['sender', 'media']);

        ChatMessageRead::updateOrCreate(
            ['chat_group_id' => $group->id, 'user_id' => auth()->id()],
            ['last_read_message_id' => $message->id, 'read_at' => now()]
        );

        return new ChatMessageResource($message);
    }

    public function markAsRead(int $id): void
    {
        $group = ChatGroup::whereNull('company_id')->findOrFail($id);

        $lastMessage = ChatMessage::forGroup($group->id)
            ->orderBy('id', 'desc')
            ->first();

        if ($lastMessage) {
            ChatMessageRead::updateOrCreate(
                ['chat_group_id' => $group->id, 'user_id' => auth()->id()],
                ['last_read_message_id' => $lastMessage->id, 'read_at' => now()]
            );
        }
    }
}
