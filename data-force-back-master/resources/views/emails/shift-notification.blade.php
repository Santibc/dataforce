<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shift Notification</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <img src="{{ $message->embed(public_path('logo.png')) }}" alt="BosMetrics Logo" style="max-width: 80px; height: auto;">
    </div>

    <div style="background-color: #f9f9f9; padding: 30px; border-radius: 10px;">
        <p style="margin-bottom: 20px;">Hello,</p>

        <p style="margin-bottom: 20px;">This is a reminder of your next shift:</p>

        <div style="background-color: #fff; padding: 20px; border-radius: 8px; border-left: 4px solid #2196F3; margin-bottom: 20px;">
            <p style="margin: 5px 0;"><strong>Date:</strong> {{ $date }}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> {{ $time_from }} - {{ $time_to }}</p>
            @if($position)
            <p style="margin: 5px 0;"><strong>Position:</strong> {{ $position }}</p>
            @endif
        </div>

        <p style="margin-bottom: 20px;">For any further details please contact management.</p>

        <p style="color: #666; font-size: 14px;">
            Best Regards,<br>
            <strong>BosMetrics Team</strong>
        </p>
    </div>

    <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
        <p>&copy; {{ date('Y') }} BosMetrics. All rights reserved.</p>
    </div>
</body>
</html>
