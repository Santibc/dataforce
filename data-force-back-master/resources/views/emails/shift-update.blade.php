<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shift Updated</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <img src="{{ $message->embed(public_path('logo.png')) }}" alt="BosMetrics Logo" style="max-width: 80px; height: auto;">
    </div>

    <div style="background-color: #f9f9f9; padding: 30px; border-radius: 10px;">
        <p style="font-size: 18px; margin-bottom: 20px;"><strong>Dear {{ $employee }},</strong></p>

        <p style="margin-bottom: 15px;">We wanted to inform you that there have been changes made to your scheduled shift for <strong>{{ $date }}</strong> at <strong>{{ $time }}</strong>. Please review the updated details below:</p>

        <div style="background-color: #fff; padding: 20px; border-radius: 8px; border-left: 4px solid #FF9800; margin-bottom: 20px;">
            <p style="margin: 5px 0;"><strong>Previous Shift:</strong> {{ $prev_date }} at {{ $prev_time }} to {{ $prev_to }}</p>
            <p style="margin: 5px 0;"><strong>New Shift:</strong> {{ $date }} at {{ $time }} to {{ $time_to }}</p>
            <p style="margin: 5px 0;"><strong>Location/Department:</strong> {{ $position }}</p>
            <p style="margin: 5px 0;"><strong>Supervisor/Manager:</strong> {{ $supervisor }}</p>
        </div>

        <p style="margin-bottom: 15px;">We understand that changes to your schedule may impact your plans, and we apologize for any inconvenience this may cause. If you have any questions or concerns regarding this update, please reach out to your supervisor or manager for further assistance.</p>

        <p style="margin-bottom: 20px;">Thank you for your understanding and flexibility as we work to ensure efficient operations at <strong>{{ $company }}</strong>.</p>

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
