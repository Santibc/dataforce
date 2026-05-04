<?php

namespace Src\Application\User\Chat\Controllers;

use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Src\Application\Admin\Chat\Data\SendMessageData;
use Src\Application\Admin\Chat\Resources\ChatMessageResource;
use Src\Domain\Chat\Models\ChatGroup;
use Src\Domain\Chat\Models\ChatGroupMember;
use Src\Domain\Chat\Models\ChatMessage;
use Src\Domain\Chat\Models\ChatMessageRead;

class UserChatMessageController
{
    public function index(int $id): AnonymousResourceCollection
    {
        $group = ChatGroup::currentCompany()->findOrFail($id);

        // Verify user is a member
        $isMember = ChatGroupMember::where('chat_group_id', $group->id)
            ->where('user_id', auth()->id())
            ->whereNull('left_at')
            ->exists();

        if (! $isMember) {
            abort(403, 'You are not a member of this group.');
        }

        $query = ChatMessage::forGroup($group->id)
            ->recent()
            ->with(['sender', 'media'])
            ->orderBy('created_at', 'asc');

        // Support showing history to new members
        if (! $group->show_history_to_new_members) {
            $membership = ChatGroupMember::where('chat_group_id', $group->id)
                ->where('user_id', auth()->id())
                ->first();

            if ($membership) {
                $query->where('created_at', '>=', $membership->joined_at);
            }
        }

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

        // Verify user is a member
        $isMember = ChatGroupMember::where('chat_group_id', $group->id)
            ->where('user_id', auth()->id())
            ->whereNull('left_at')
            ->exists();

        if (! $isMember) {
            abort(403, 'You are not a member of this group.');
        }

        // Check if group is unilateral - only admins can send
        if ($group->isUnilateral()) {
            abort(403, 'Only administrators can send messages in this group.');
        }

        $message = ChatMessage::create([
            'chat_group_id' => $group->id,
            'user_id' => auth()->id(),
            'body' => $data->body,
            'company_id' => auth()->user()->company_id,
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
        $group = ChatGroup::currentCompany()->findOrFail($id);

        $isMember = ChatGroupMember::where('chat_group_id', $group->id)
            ->where('user_id', auth()->id())
            ->whereNull('left_at')
            ->exists();

        if (! $isMember) {
            abort(403, 'You are not a member of this group.');
        }

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
