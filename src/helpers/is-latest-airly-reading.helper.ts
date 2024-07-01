export function isLatestAirlyReading(airlyReadingDate: string): boolean {
  if (!airlyReadingDate) {
    return false;
  }
  const airlyDate = new Date(airlyReadingDate);
  if (isNaN(airlyDate.getTime())) {
    throw new Error('Invalid date format');
  }
  const currentDate = new Date();
  const currentYear = currentDate.getUTCFullYear();
  const currentMonth = currentDate.getUTCMonth();
  const currentDay = currentDate.getUTCDate();
  const currentHour = currentDate.getUTCHours();

  const airlyYear = airlyDate.getUTCFullYear();
  const airlyMonth = airlyDate.getUTCMonth();
  const airlyDay = airlyDate.getUTCDate();
  const airlyHour = airlyDate.getUTCHours();

  return (
    currentYear === airlyYear &&
    currentMonth === airlyMonth &&
    currentDay === airlyDay &&
    currentHour === airlyHour
  );
}
