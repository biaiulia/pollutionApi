export function isLatestAirlyReading(airlyReadingDate: Date): boolean {
  if (!airlyReadingDate) {
    return false;
  }
  const currentDate = new Date();
  const currentYear = currentDate.getUTCFullYear();
  const currentMonth = currentDate.getUTCMonth();
  const currentDay = currentDate.getUTCDate();
  const currentHour = currentDate.getUTCHours();

  const airlyYear = airlyReadingDate.getUTCFullYear();
  const airlyMonth = airlyReadingDate.getUTCMonth();
  const airlyDay = airlyReadingDate.getUTCDate();
  const airlyHour = airlyReadingDate.getUTCHours();

  return (
    currentYear === airlyYear &&
    currentMonth === airlyMonth &&
    currentDay === airlyDay &&
    currentHour === airlyHour
  );
}
