import { DefenseSchedule } from 'src/entities/defense-schedule.entity';

const baseStyle = `
  font-family: Arial, sans-serif; color: #333;
  max-width: 600px; margin: 0 auto;
`;

export function scheduleCreatedEmail(
    schedule: DefenseSchedule,
    appUrl: string,
): string {
    return `
    <div style="${baseStyle}">
      <h2 style="color:#1a56db">📅 Defense Scheduled</h2>
      <p>A new thesis defense has been scheduled. Here are the details:</p>
      ${scheduleTable(schedule)}
      <a href="${appUrl}/schedules/${schedule.id}" style="
        display:inline-block;margin-top:16px;padding:10px 20px;
        background:#1a56db;color:#fff;border-radius:6px;text-decoration:none
      ">View Schedule</a>
    </div>
  `;
}

export function scheduleUpdatedEmail(
    schedule: DefenseSchedule,
    appUrl: string,
): string {
    return `
    <div style="${baseStyle}">
      <h2 style="color:#f59e0b">✏️ Defense Schedule Updated</h2>
      <p>A defense schedule you are involved in has been updated:</p>
      ${scheduleTable(schedule)}
      <a href="${appUrl}/schedules/${schedule.id}" style="
        display:inline-block;margin-top:16px;padding:10px 20px;
        background:#f59e0b;color:#fff;border-radius:6px;text-decoration:none
      ">View Updated Schedule</a>
    </div>
  `;
}

export function scheduleCancelledEmail(schedule: DefenseSchedule): string {
    return `
    <div style="${baseStyle}">
      <h2 style="color:#ef4444">❌ Defense Cancelled</h2>
      <p>The following defense has been <strong>cancelled</strong>:</p>
      ${scheduleTable(schedule)}
    </div>
  `;
}

export function scheduleReminderEmail(
    schedule: DefenseSchedule,
    appUrl: string,
): string {
    return `
    <div style="${baseStyle}">
      <h2 style="color:#8b5cf6">🔔 Defense Reminder — 3 Days Away</h2>
      <p>This is a reminder that your defense is coming up in <strong>3 days</strong>:</p>
      ${scheduleTable(schedule)}
      <a href="${appUrl}/schedules/${schedule.id}" style="
        display:inline-block;margin-top:16px;padding:10px 20px;
        background:#8b5cf6;color:#fff;border-radius:6px;text-decoration:none
      ">View Schedule</a>
    </div>
  `;
}

function scheduleTable(s: DefenseSchedule): string {
    return `
    <table style="border-collapse:collapse;width:100%;margin-top:12px">
      <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9"><strong>Type</strong></td>
          <td style="padding:8px;border:1px solid #ddd">${s.defenseType}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9"><strong>Date</strong></td>
          <td style="padding:8px;border:1px solid #ddd">${s.date}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9"><strong>Time</strong></td>
          <td style="padding:8px;border:1px solid #ddd">${s.startTime} – ${s.endTime}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9"><strong>Room</strong></td>
          <td style="padding:8px;border:1px solid #ddd">${s.room}</td></tr>
    </table>
  `;
}