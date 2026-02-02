<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shift Cancelled</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <img src="{{ $message->embed(public_path('logo.png')) }}" alt="BosMetrics Logo" style="max-width: 80px; height: auto;">
    </div>

    <div style="background-color: #f9f9f9; padding: 30px; border-radius: 10px;">
        <p style="font-size: 18px; margin-bottom: 20px;"><strong>Dear {{ $employee }},</strong></p>

        <p style="margin-bottom: 15px;">We regret to inform you that your scheduled shift for <strong>{{ $date }}</strong> at <strong>{{ $time }}</strong> has been canceled.</p>

        <p style="margin-bottom: 15px;">We apologize for any inconvenience this may cause.</p>

        <p style="margin-bottom: 15px;">Please review your updated schedule on BosMetrics for any further adjustments. If you have any concerns or need assistance, don't hesitate to reach out to your supervisor or manager for clarification.</p>

        <p style="margin-bottom: 20px;">Thank you for your understanding and flexibility. We appreciate your dedication to <strong>{{ $company }}</strong>, and we look forward to your continued contributions.</p>

        <p style="color: #666; font-size: 14px;">
            Best Regards,<br><br>
            <strong>BosMetrics Team</strong>
        </p>
    </div>

    <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
        <p>&copy; {{ date('Y') }} BosMetrics. All rights reserved.</p>
    </div>
</body>
</html>
