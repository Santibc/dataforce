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
        <p style="margin-bottom: 20px;">Hello {{ $employee }},</p>

        <p style="margin-bottom: 20px;">Your schedule has been updated. Here {{ $shifts->count() === 1 ? 'is your assigned shift' : 'are your ' . $shifts->count() . ' assigned shifts' }}:</p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background-color: #fff; border-radius: 8px; overflow: hidden; border-left: 4px solid #2196F3;">
            <thead>
                <tr style="background-color: #2196F3; color: #fff;">
                    <th style="padding: 10px 12px; text-align: left; font-size: 13px;">Date</th>
                    <th style="padding: 10px 12px; text-align: left; font-size: 13px;">Time</th>
                    <th style="padding: 10px 12px; text-align: left; font-size: 13px;">Position</th>
                </tr>
            </thead>
            <tbody>
                @foreach($shifts as $shift)
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 10px 12px; font-size: 13px;">{{ $shift->from->format('m/d/Y') }}</td>
                    <td style="padding: 10px 12px; font-size: 13px;">{{ $shift->from->format('H:i') }} - {{ $shift->to->format('H:i') }}</td>
                    <td style="padding: 10px 12px; font-size: 13px;">{{ $shift->name }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        @if($admin)
        <p style="margin-bottom: 20px; font-size: 13px; color: #666;">Published by: {{ $admin }}</p>
        @endif

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
