<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Log Report</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f0f4f8;">
    <div style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">

        <div style="background-color: #1a3353; padding: 24px 30px; text-align: center;">
            <img src="{{ $message->embed(public_path('logo.png')) }}" alt="BosMetrics Logo" style="max-width: 60px; height: auto; margin-bottom: 10px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600;">Daily Log Incident Report</h1>
        </div>

        <div style="padding: 30px;">

            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid {{ $severityColor }}; margin-bottom: 24px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; vertical-align: top; width: 130px;">
                            <strong style="color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Date</strong>
                        </td>
                        <td style="padding: 8px 0; font-size: 15px;">{{ $date }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; vertical-align: top;">
                            <strong style="color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Driver</strong>
                        </td>
                        <td style="padding: 8px 0; font-size: 15px;">{{ $driverName }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; vertical-align: top;">
                            <strong style="color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Event Type</strong>
                        </td>
                        <td style="padding: 8px 0; font-size: 15px;">
                            <span style="background-color: #e0f2fe; color: #0369a1; padding: 3px 10px; border-radius: 12px; font-size: 13px; font-weight: 600;">{{ $eventType }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; vertical-align: top;">
                            <strong style="color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Severity</strong>
                        </td>
                        <td style="padding: 8px 0; font-size: 15px;">
                            <span style="background-color: {{ $severityBgColor }}; color: {{ $severityColor }}; padding: 3px 10px; border-radius: 12px; font-size: 13px; font-weight: 600;">{{ $severity }}</span>
                        </td>
                    </tr>
                </table>
            </div>

            @if($description && $description !== 'N/A')
            <div style="margin-bottom: 20px;">
                <h3 style="color: #1a3353; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Description</h3>
                <div style="background-color: #f8fafc; padding: 14px 18px; border-radius: 8px; font-size: 14px; color: #475569;">
                    {{ $description }}
                </div>
            </div>
            @endif

            @if($actionTaken && $actionTaken !== 'N/A')
            <div style="margin-bottom: 20px;">
                <h3 style="color: #1a3353; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Action Taken</h3>
                <div style="background-color: #f8fafc; padding: 14px 18px; border-radius: 8px; font-size: 14px; color: #475569;">
                    {{ $actionTaken }}
                </div>
            </div>
            @endif

            <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 24px;">
                <p style="color: #94a3b8; font-size: 13px; margin: 0;">
                    Reported by <strong style="color: #64748b;">{{ $adminName }}</strong>
                </p>
            </div>
        </div>

        <div style="background-color: #f8fafc; padding: 16px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; {{ date('Y') }} BosMetrics. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
