<?php

namespace Src\Domain\Chat\Observers;

use Src\Domain\Chat\Models\ChatGroup;
use Src\Domain\Chat\Models\ChatGroupMember;
use Src\Domain\User\Models\User;

class UserObserver
{
    public function created(User $user): void
    {
        if (! $user->company_id) {
            return;
        }

        $globalGroups = ChatGroup::where('company_id', $user->company_id)
            ->globalGroups()
            ->pluck('id');

        foreach ($globalGroups as $groupId) {
            ChatGroupMember::updateOrCreate(
                ['chat_group_id' => $groupId, 'user_id' => $user->id],
                ['joined_at' => now(), 'left_at' => null]
            );
        }

        $autoAddGroups = ChatGroup::where('company_id', $user->company_id)
            ->customGroups()
            ->where('auto_add_new_members', true)
            ->pluck('id');

        foreach ($autoAddGroups as $groupId) {
            ChatGroupMember::updateOrCreate(
                ['chat_group_id' => $groupId, 'user_id' => $user->id],
                ['joined_at' => now(), 'left_at' => null]
            );
        }
    }

    public function deleted(User $user): void
    {
        ChatGroupMember::where('user_id', $user->id)
            ->whereNull('left_at')
            ->update(['left_at' => now()]);
    }

    public function restored(User $user): void
    {
        if (! $user->company_id) {
            return;
        }

        $globalGroups = ChatGroup::where('company_id', $user->company_id)
            ->globalGroups()
            ->pluck('id');

        foreach ($globalGroups as $groupId) {
            ChatGroupMember::updateOrCreate(
                ['chat_group_id' => $groupId, 'user_id' => $user->id],
                ['joined_at' => now(), 'left_at' => null]
            );
        }
    }
}
