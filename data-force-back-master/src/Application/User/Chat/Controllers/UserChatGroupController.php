<?php

namespace Src\Application\User\Chat\Controllers;

use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Src\Application\Admin\Chat\Resources\ChatGroupResource;
use Src\Domain\Chat\Models\ChatGroup;
use Src\Domain\Chat\Models\ChatMessageRead;

class UserChatGroupController
{
    public function index(): AnonymousResourceCollection
    {
        $userId = auth()->id();

        $groups = ChatGroup::currentCompany()
            ->forUser($userId)
            ->with(['latestMessage.sender', 'activeMembers'])
            ->withCount('activeMembers')
            ->get()
            ->map(function ($group) use ($userId) {
                $readRecord = ChatMessageRead::where('chat_group_id', $group->id)
                    ->where('user_id', $userId)
                    ->first();

                $lastReadId = $readRecord?->last_read_message_id ?? 0;

                $group->unread_count = $group->messages()
                    ->where('id', '>', $lastReadId)
                    ->count();

                return $group;
            });

        return ChatGroupResource::collection($groups);
    }

    public function unreadCounts()
    {
        $userId = auth()->id();

        $groups = ChatGroup::currentCompany()
            ->forUser($userId)
            ->pluck('id');

        $unreadData = [];
        $totalUnread = 0;

        foreach ($groups as $groupId) {
            $readRecord = ChatMessageRead::where('chat_group_id', $groupId)
                ->where('user_id', $userId)
                ->first();

            $lastReadId = $readRecord?->last_read_message_id ?? 0;

            $count = \DB::table('chat_messages')
                ->where('chat_group_id', $groupId)
                ->where('id', '>', $lastReadId)
                ->count();

            if ($count > 0) {
                $unreadData[] = [
                    'chat_group_id' => $groupId,
                    'unread_count' => $count,
                ];
                $totalUnread += $count;
            }
        }

        return response()->json([
            'total_unread' => $totalUnread,
            'groups' => $unreadData,
        ]);
    }
}
