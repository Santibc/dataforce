<?php

namespace Src\Application\Admin\Chat\Controllers;

use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Src\Application\Admin\Chat\Data\SendMessageData;
use Src\Application\Admin\Chat\Resources\ChatMessageResource;
use Src\Domain\Chat\Models\ChatGroup;
use Src\Domain\Chat\Models\ChatMessage;
use Src\Domain\Chat\Models\ChatMessageRead;

class ChatMessageController
{
    public function index(int $id): AnonymousResourceCollection
    {
        $group = ChatGroup::currentCompany()->findOrFail($id);

        $query = ChatMessage::forGroup($group->id)
            ->recent()
            ->with('sender')
            ->orderBy('created_at', 'asc');

        // Support cursor-based pagination for polling
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
        $group = ChatGroup::currentCompany()->findOrFail($id);

        $message = ChatMessage::create([
            'chat_group_id' => $group->id,
            'user_id' => auth()->id(),
            'body' => $data->body,
            'company_id' => auth()->user()->company_id,
        ]);

        $message->load('sender');

        // Auto mark as read for sender
        ChatMessageRead::updateOrCreate(
            ['chat_group_id' => $group->id, 'user_id' => auth()->id()],
            ['last_read_message_id' => $message->id, 'read_at' => now()]
        );

        return new ChatMessageResource($message);
    }

    public function markAsRead(int $id): void
    {
        $group = ChatGroup::currentCompany()->findOrFail($id);

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
