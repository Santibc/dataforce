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
    /**
     * Resolve a chat group: first try company-scoped, then for owners try super admin groups.
     */
    private function resolveGroup(int $id): ChatGroup
    {
        $group = ChatGroup::currentCompany()->find($id);

        if (! $group && auth()->user()->hasRole('owner')) {
            $group = ChatGroup::whereNull('company_id')
                ->forUser(auth()->id())
                ->find($id);
        }

        if (! $group) {
            abort(404, 'Group not found.');
        }

        return $group;
    }

    public function index(int $id): AnonymousResourceCollection
    {
        $group = $this->resolveGroup($id);

        $query = ChatMessage::forGroup($group->id)
            ->recent()
            ->with(['sender', 'media'])
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
        $group = $this->resolveGroup($id);

        // In super admin groups with unilateral mode, only super_admin can write
        if ($group->company_id === null && $group->isUnilateral()) {
            if (! auth()->user()->hasRole('super_admin')) {
                abort(403, 'Only administrators can send messages in this group.');
            }
        }

        $message = ChatMessage::create([
            'chat_group_id' => $group->id,
            'user_id' => auth()->id(),
            'body' => $data->body,
            'company_id' => $group->company_id,
        ]);

        if ($data->attachment) {
            $message->addAttachment($data->attachment);
        }

        $message->load(['sender', 'media']);

        // Auto mark as read for sender
        ChatMessageRead::updateOrCreate(
            ['chat_group_id' => $group->id, 'user_id' => auth()->id()],
            ['last_read_message_id' => $message->id, 'read_at' => now()]
        );

        return new ChatMessageResource($message);
    }

    public function markAsRead(int $id): void
    {
        $group = $this->resolveGroup($id);

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
