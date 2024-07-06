export function formatLocalTime(sendedAt: string): string {
  const [, timePart] = sendedAt.split(', ');
  const [hours, minutes] = timePart.split(':');
  const formattedHours = hours.padStart(2, '0');
  const formattedMinutes = minutes.padStart(2, '0');
  return `${formattedHours}h${formattedMinutes}`;
}
