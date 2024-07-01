export function calculateAqiLevel(pm25: number, pm10: number): string {
  const pm25Levels = {
    Good: 25,
    Fair: 50,
    Moderate: 90,
    Poor: 180,
    'Very Poor': Infinity,
  };

  const pm10Levels = {
    Good: 50,
    Fair: 100,
    Moderate: 250,
    Poor: 350,
    'Very Poor': Infinity,
  };

  const pm25Level = Object.keys(pm25Levels).find(
    (key) => pm25 <= pm25Levels[key],
  );

  const pm10Level = Object.keys(pm10Levels).find(
    (key) => pm10 <= pm10Levels[key],
  );

  return pm25Level && pm10Level
    ? [pm25Level, pm10Level].sort(
        (a, b) =>
          ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'].indexOf(a) -
          ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'].indexOf(b),
      )[1]
    : 'Unknown';
}
