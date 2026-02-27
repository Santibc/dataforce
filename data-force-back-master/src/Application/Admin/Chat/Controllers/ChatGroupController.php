<?php

namespace Src\Application\Admin\Chat\Controllers;

use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Src\Application\Admin\Chat\Data\AddMembersData;
use Src\Application\Admin\Chat\Data\RemoveMembersData;
use Src\Application\Admin\Chat\Data\StoreChatGroupData;
use Src\Application\Admin\Chat\Data\UpdateChatGroupData;
use Src\Application\Admin\Chat\Resources\ChatGroupDetailResource;
use Src\Application\Admin\Chat\Resources\ChatGroupResource;
use Src\Domain\Chat\Models\ChatGroup;
use Src\Domain\Chat\Models\ChatGroupMember;
use Src\Domain\Chat\Models\ChatMessageRead;
use Src\Domain\User\Models\User;

class ChatGroupController
{
    public function index(): AnonymousResourceCollection
    {
        $userId = auth()->id();

        $groups = ChatGroup::currentCompany()
            ->with(['latestMessage.sender', 'activeMembers'])
            ->withCount('activeMembers')
            ->get();

        // If the user is an owner, also include super admin groups they belong to
        if (auth()->user()->hasRole('owner')) {
            $saGroups = ChatGroup::whereNull('company_id')
                ->forUser($userId)
                ->with(['latestMessage.sender', 'activeMembers'])
                ->withCount('activeMembers')
                ->get();

            $groups = $groups->merge($saGroups);
        }

        $groups = $groups->map(function ($group) use ($userId) {
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

    public function store(StoreChatGroupData $data): ChatGroupDetailResource
    {
        $group = null;

        \DB::transaction(function () use ($data, &$group): void {
            $group = ChatGroup::create([
                'name' => $data->name,
                'type' => $data->type,
                'mode' => $data->mode,
                'auto_add_new_members' => $data->auto_add_new_members,
                'show_history_to_new_members' => $data->show_history_to_new_members,
                'company_id' => auth()->user()->company_id,
                'created_by' => auth()->id(),
            ]);

            // Add the creator as a member
            ChatGroupMember::create([
                'chat_group_id' => $group->id,
                'user_id' => auth()->id(),
                'joined_at' => now(),
            ]);

            if ($data->type === 'global') {
                // Add all active employees of the company
                $users = User::currentCompany()
                    ->where('id', '!=', auth()->id())
                    ->get();

                foreach ($users as $user) {
                    ChatGroupMember::create([
                        'chat_group_id' => $group->id,
                        'user_id' => $user->id,
                        'joined_at' => now(),
                    ]);
                }
            } elseif ($data->member_ids) {
                // Add selected members for custom groups
                $members = User::currentCompany()
                    ->whereIn('id', $data->member_ids)
                    ->where('id', '!=', auth()->id())
                    ->get();

                foreach ($members as $user) {
                    ChatGroupMember::create([
                        'chat_group_id' => $group->id,
                        'user_id' => $user->id,
                        'joined_at' => now(),
                    ]);
                }
            }
        });

        $group->load(['users', 'creator']);

        return new ChatGroupDetailResource($group);
    }

    public function show(int $id): ChatGroupDetailResource
    {
        $group = ChatGroup::currentCompany()->findOrFail($id);
        $group->load(['users', 'creator']);

        return new ChatGroupDetailResource($group);
    }

    public function update(int $id, UpdateChatGroupData $data): ChatGroupDetailResource
    {
        $group = ChatGroup::currentCompany()->findOrFail($id);

        $group->update([
            'name' => $data->name,
            'mode' => $data->mode,
            'auto_add_new_members' => $data->auto_add_new_members,
            'show_history_to_new_members' => $data->show_history_to_new_members,
        ]);

        $group->load(['users', 'creator']);

        return new ChatGroupDetailResource($group);
    }

    public function destroy(int $id): void
    {
        $group = ChatGroup::currentCompany()->findOrFail($id);

        if ($group->isGlobal()) {
            $confirm = request()->input('confirm', false);
            if (! $confirm) {
                abort(422, 'Global group deletion requires confirmation.');
            }
        }

        $group->delete();
    }

    public function addMembers(int $id, AddMembersData $data): void
    {
        $group = ChatGroup::currentCompany()->findOrFail($id);

        \DB::transaction(function () use ($group, $data): void {
            $members = User::currentCompany()
                ->whereIn('id', $data->member_ids)
                ->get();

            foreach ($members as $user) {
                ChatGroupMember::updateOrCreate(
                    ['chat_group_id' => $group->id, 'user_id' => $user->id],
                    ['joined_at' => now(), 'left_at' => null]
                );
            }
        });
    }

    public function removeMembers(int $id, RemoveMembersData $data): void
    {
        $group = ChatGroup::currentCompany()->findOrFail($id);

        ChatGroupMember::where('chat_group_id', $group->id)
            ->whereIn('user_id', $data->member_ids)
            ->whereNull('left_at')
            ->update(['left_at' => now()]);
    }

    public function unreadCounts()
    {
        $userId = auth()->id();
        $companyId = auth()->user()->company_id;

        $groupIds = ChatGroup::where('company_id', $companyId)->pluck('id');

        // If owner, also include super admin groups they belong to
        if (auth()->user()->hasRole('owner')) {
            $saGroupIds = ChatGroup::whereNull('company_id')
                ->forUser($userId)
                ->pluck('id');
            $groupIds = $groupIds->merge($saGroupIds);
        }

        $unreadData = [];
        $totalUnread = 0;

        foreach ($groupIds as $groupId) {
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
