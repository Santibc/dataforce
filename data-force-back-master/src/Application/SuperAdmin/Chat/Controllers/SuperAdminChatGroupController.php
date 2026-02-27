<?php

namespace Src\Application\SuperAdmin\Chat\Controllers;

use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Src\Application\Admin\Chat\Data\AddMembersData;
use Src\Application\Admin\Chat\Data\RemoveMembersData;
use Src\Application\Admin\Chat\Data\StoreChatGroupData;
use Src\Application\Admin\Chat\Data\UpdateChatGroupData;
use Src\Application\SuperAdmin\Chat\Resources\SuperAdminChatGroupDetailResource;
use Src\Application\SuperAdmin\Chat\Resources\SuperAdminChatGroupResource;
use Src\Domain\Chat\Models\ChatGroup;
use Src\Domain\Chat\Models\ChatGroupMember;
use Src\Domain\Chat\Models\ChatMessageRead;
use Src\Domain\User\Models\User;

class SuperAdminChatGroupController
{
    public function index(): AnonymousResourceCollection
    {
        $userId = auth()->id();

        $groups = ChatGroup::whereNull('company_id')
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

        return SuperAdminChatGroupResource::collection($groups);
    }

    public function store(StoreChatGroupData $data): SuperAdminChatGroupDetailResource
    {
        $group = null;

        \DB::transaction(function () use ($data, &$group): void {
            $group = ChatGroup::create([
                'name' => $data->name,
                'type' => $data->type,
                'mode' => $data->mode,
                'auto_add_new_members' => $data->auto_add_new_members,
                'show_history_to_new_members' => $data->show_history_to_new_members,
                'company_id' => null,
                'created_by' => auth()->id(),
            ]);

            // Add the creator (super admin) as a member
            ChatGroupMember::create([
                'chat_group_id' => $group->id,
                'user_id' => auth()->id(),
                'joined_at' => now(),
            ]);

            if ($data->type === 'global') {
                // Add all owners across all companies
                $owners = User::role('owner')
                    ->where('id', '!=', auth()->id())
                    ->get();

                foreach ($owners as $owner) {
                    ChatGroupMember::create([
                        'chat_group_id' => $group->id,
                        'user_id' => $owner->id,
                        'joined_at' => now(),
                    ]);
                }
            } elseif ($data->member_ids) {
                // Add selected members (must be owners)
                $members = User::role('owner')
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

        $group->load(['users.company', 'creator']);

        return new SuperAdminChatGroupDetailResource($group);
    }

    public function show(int $id): SuperAdminChatGroupDetailResource
    {
        $group = ChatGroup::whereNull('company_id')->findOrFail($id);
        $group->load(['users.company', 'creator']);

        return new SuperAdminChatGroupDetailResource($group);
    }

    public function update(int $id, UpdateChatGroupData $data): SuperAdminChatGroupDetailResource
    {
        $group = ChatGroup::whereNull('company_id')->findOrFail($id);

        $group->update([
            'name' => $data->name,
            'mode' => $data->mode,
            'auto_add_new_members' => $data->auto_add_new_members,
            'show_history_to_new_members' => $data->show_history_to_new_members,
        ]);

        $group->load(['users.company', 'creator']);

        return new SuperAdminChatGroupDetailResource($group);
    }

    public function destroy(int $id): void
    {
        $group = ChatGroup::whereNull('company_id')->findOrFail($id);

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
        $group = ChatGroup::whereNull('company_id')->findOrFail($id);

        \DB::transaction(function () use ($group, $data): void {
            $members = User::role('owner')
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
        $group = ChatGroup::whereNull('company_id')->findOrFail($id);

        ChatGroupMember::where('chat_group_id', $group->id)
            ->whereIn('user_id', $data->member_ids)
            ->whereNull('left_at')
            ->update(['left_at' => now()]);
    }

    public function getOwners()
    {
        $owners = User::role('owner')
            ->with('company')
            ->get()
            ->map(fn ($user) => [
                'id' => $user->id,
                'firstname' => $user->firstname,
                'lastname' => $user->lastname,
                'email' => $user->email,
                'company_name' => $user->company?->name ?? 'No company',
            ]);

        return response()->json($owners);
    }

    public function unreadCounts()
    {
        $userId = auth()->id();

        $groups = ChatGroup::whereNull('company_id')->pluck('id');

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
