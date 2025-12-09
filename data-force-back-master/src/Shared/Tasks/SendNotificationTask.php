<?php

namespace Src\Shared\Tasks;

use Illuminate\Support\Str;
use Src\Domain\User\Models\User;

class SendNotificationTask
{
    public static function notifyCoaching($user_id, $subject, $type, $week, $year): void
    {
        $user = User::findOrFail($user_id);
        if ($token = $user->notification_token) {
            try {
                $expo = \ExponentPhpSDK\Expo::normalSetup();
                $recipient = Str::contains($token, 'Exponent') ? $token : "ExponentPushToken[$token]";
                \Log::info('notification-enviada', [
                    'user' => $user_id,
                ]);
                $expo->subscribe($token, $recipient);
                $title = $type == 'coach' ? 'coaching' : 'congrats';
                $notification = [
                    'title' => "Good news! You've received an update on your performance, come check it.",
                    'body' => $subject.': See your '.$title.' to be better',
                    'data' => json_encode(
                        [
                            'type' => $title,
                            'week' => $week,
                            'year' => $year,
                        ]
                    ),
                ];
                $expo->notify([$token], $notification);
            } catch (\Exception $e) {
                \Log::error('notificacion error', [
                    'tipo' => 'autorizar',
                    'id_sol' => $token,
                ]);
            }
        } else {
            \Log::error("The user with ID: $user->id does not have a token.");
        }
    }

    public static function notifyPublish($user_id, $from, $position): void
    {
        $user = User::findOrFail($user_id);
        if ($token = $user->notification_token) {
            try {
                $expo = \ExponentPhpSDK\Expo::normalSetup();
                $recipient = Str::contains($token, 'Exponent') ? $token : "ExponentPushToken[$token]";
                \Log::info('notification-enviada', [
                    'user' => $user_id,
                ]);
                $expo->subscribe($token, $recipient);
                $notification = [
                    'title' => 'Your schedule has been changed, take a look at it.',
                    'body' => 'Confirm week for the new shift',
                    'data' => json_encode(
                        [
                            'from' => $from,
                            'position' => $position,
                            'type' => 'published_shift',
                        ]
                    ),
                ];
                $expo->notify([$token], $notification);
            } catch (\Exception $e) {
                \Log::error('notificacion error', [
                    'tipo' => 'autorizar',
                    'id_sol' => $token,
                ]);
            }
        } else {
            \Log::error("The user with ID: $user->id does not have a token.");
        }
    }

    public static function notifyEdit($user_id, $from, $position): void
    {
        $user = User::findOrFail($user_id);
        if ($token = $user->notification_token) {
            try {
                $expo = \ExponentPhpSDK\Expo::normalSetup();
                $recipient = Str::contains($token, 'Exponent') ? $token : "ExponentPushToken[$token]";
                \Log::info('notification-enviada', [
                    'user' => $user_id,
                ]);
                $expo->subscribe($token, $recipient);
                $notification = [
                    'title' => 'Your schedule has been changed, take a look at it.',
                    'body' => 'Confirm week for the shift',
                    'data' => json_encode(
                        [
                            'from' => $from,
                            'position' => $position,
                            'type' => 'updated_shift',
                        ]
                    ),
                ];
                $expo->notify([$token], $notification);
            } catch (\Exception $e) {
                \Log::error('notificacion error', [
                    'tipo' => 'autorizar',
                    'id_sol' => $token,
                ]);
            }
        } else {
            \Log::error("The user with ID: $user->id does not have a token.");
        }
    }

    public static function notifyDeleted($user_id, $from, $position): void
    {
        $user = User::findOrFail($user_id);
        if ($token = $user->notification_token) {
            try {
                $expo = \ExponentPhpSDK\Expo::normalSetup();
                $recipient = Str::contains($token, 'Exponent') ? $token : "ExponentPushToken[$token]";
                \Log::info('notification-enviada', [
                    'user' => $user_id,
                ]);
                $expo->subscribe($token, $recipient);
                $notification = [
                    'title' => 'Your schedule has been changed, take a look at it.',
                    'body' => 'Check the week for the new schedule',
                    'data' => json_encode(
                        [
                            'from' => $from,
                            'position' => $position,
                            'type' => 'deleted_shift',
                        ]
                    ),
                ];
                $expo->notify([$token], $notification);
            } catch (\Exception $e) {
                \Log::error('notificacion error', [
                    'tipo' => 'autorizar',
                    'id_sol' => $token,
                ]);
            }
        } else {
            \Log::error("The user with ID: $user->id does not have a token.");
        }
    }
}
