/* Calendar arithmetic has one implementation shared by every date feature. */
const GREGORIAN_MONTH_LENGTHS = [
  31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
];
const METONIC_CYCLE = [
  12, 13, 12, 12, 13, 12, 13, 12, 12, 13, 12, 12, 13, 12, 13, 12, 12, 13, 12,
];
export const DANETIAN_MONTH_NAMES = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpius",
  "Sagittarius",
  "Capricornus",
  "Aquarius",
  "Pisces",
  "Terra",
];
const GREGORIAN_MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const EPOCH_JULIAN_DAY = 2460764;

export function mod(n, divisor) {
  return ((n % divisor) + divisor) % divisor;
}

export function danetian_year_length(year) {
  return METONIC_CYCLE[mod(mod(year - 1, 334), 19)];
}

export function danetian_month_ordinal(year, month) {
  const cycleYear = mod(year - 1, 334);
  const previousMonths = METONIC_CYCLE.slice(0, mod(cycleYear, 19)).reduce(
    (sum, count) => sum + count,
    0,
  );
  return (
    4131 * Math.floor((year - 1) / 334) +
    235 * Math.floor(cycleYear / 19) +
    previousMonths +
    month
  );
}

export function danetian_month_length(year, month) {
  const ordinal = danetian_month_ordinal(year, month);
  return mod(mod(mod(mod(ordinal - 1, 850), 49), 17), 2) === 0 ? 30 : 29;
}

function solarMonthLength(year, month, leap) {
  return month === 2 && leap(year) ? 29 : GREGORIAN_MONTH_LENGTHS[month - 1];
}
const calendars = {
  gregorian: {
    epoch: [2025, 3, 29],
    months: () => 12,
    monthLength: (y, m) =>
      solarMonthLength(
        y,
        m,
        (year) =>
          mod(year, 400) === 0 || (mod(year, 4) === 0 && mod(year, 100) !== 0),
      ),
  },
  julian: {
    epoch: [2025, 3, 16],
    months: () => 12,
    monthLength: (y, m) => solarMonthLength(y, m, (year) => mod(year, 4) === 0),
  },
  danetian: {
    epoch: [3351, 1, 1],
    months: danetian_year_length,
    monthLength: danetian_month_length,
  },
};

function shiftDate([year, month, day], offset, calendar) {
  day += offset;
  while (day < 1) {
    month -= 1;
    if (month < 1) {
      year -= 1;
      month = calendar.months(year);
    }
    day += calendar.monthLength(year, month);
  }
  while (day > calendar.monthLength(year, month)) {
    day -= calendar.monthLength(year, month);
    month += 1;
    if (month > calendar.months(year)) {
      year += 1;
      month = 1;
    }
  }
  return [year, month, day];
}

function compareDates(a, b) {
  for (let index = 0; index < 3; index += 1) {
    if (a[index] !== b[index]) return Math.sign(b[index] - a[index]);
  }
  return 0;
}

function toJulianDay(year, month, day, calendar) {
  const target = [year, month, day];
  if (
    !target.every(Number.isInteger) ||
    month < 1 ||
    month > calendar.months(year) ||
    day < 1 ||
    day > calendar.monthLength(year, month)
  ) {
    throw new RangeError("Enter a valid date in YYYY-MM-DD format.");
  }
  let date = calendar.epoch;
  let julianDay = EPOCH_JULIAN_DAY;
  let sign = compareDates(date, target);
  let delta = sign;
  while (sign !== 0) {
    const nextSign = compareDates(date, target);
    delta = nextSign === sign ? delta * 2 : nextSign;
    sign = nextSign;
    date = shiftDate(date, delta, calendar);
    julianDay += delta;
  }
  return julianDay;
}
function fromJulianDay(julianDay, calendar) {
  return shiftDate(calendar.epoch, julianDay - EPOCH_JULIAN_DAY, calendar);
}
export function gregorian_to_julian_day(y, m, d) {
  return toJulianDay(y, m, d, calendars.gregorian);
}
export function julian_to_julian_day(y, m, d) {
  return toJulianDay(y, m, d, calendars.julian);
}
export function danetian_to_julian_day(y, m, d) {
  return toJulianDay(y, m, d, calendars.danetian);
}
export function gregorian_from_julian_day(jd) {
  return fromJulianDay(jd, calendars.gregorian);
}
export function julian_from_julian_day(jd) {
  return fromJulianDay(jd, calendars.julian);
}
export function danetian_from_julian_day(jd) {
  return fromJulianDay(jd, calendars.danetian);
}

function zeroPadding(value, digits) {
  return (value < 0 ? "-" : "") + String(Math.abs(value)).padStart(digits, "0");
}
export function iso_format(year, month, day) {
  return `${zeroPadding(year, 4)}-${zeroPadding(month, 2)}-${zeroPadding(day, 2)}`;
}
export function verbose_format(year, month, day, monthNames) {
  return `${zeroPadding(day, 2)} ${monthNames[month - 1]} ${zeroPadding(year, 4)}`;
}
export function interpret_date_string(text) {
  const match = /^(-?\d+)-(\d{2})-(\d{2})$/.exec(text.trim());
  if (!match) throw new RangeError("Enter a date in YYYY-MM-DD format.");
  return match.slice(1).map(Number);
}
function currentGregorianDate() {
  const today = new Date();
  return [today.getFullYear(), today.getMonth() + 1, today.getDate()];
}
export function get_current_danetian_date() {
  const [year, month, day] = danetian_from_julian_day(
    gregorian_to_julian_day(...currentGregorianDate()),
  );
  return { year, month, day };
}
export function danetian_today_string() {
  const { year, month, day } = get_current_danetian_date();
  return verbose_format(year, month, day, DANETIAN_MONTH_NAMES);
}
export function gregorian_today_string() {
  return verbose_format(...currentGregorianDate(), GREGORIAN_MONTH_NAMES);
}
export function weekday_from_julian_day(jd) {
  return mod(jd + 1, 7);
}
export function danetian_month_start_weekday(year, month) {
  return weekday_from_julian_day(danetian_to_julian_day(year, month, 1));
}
export function get_danetian_month_data(year, month) {
  if (!Number.isInteger(year) || !Number.isInteger(month))
    throw new TypeError("Year and month must be integers.");
  if (month < 1 || month > danetian_year_length(year))
    throw new RangeError(`Year ${year} does not contain month ${month}.`);
  return {
    year,
    month,
    monthName: DANETIAN_MONTH_NAMES[month - 1],
    dayCount: danetian_month_length(year, month),
    startWeekday: danetian_month_start_weekday(year, month),
  };
}
export function previous_danetian_month(year, month) {
  return month > 1
    ? [year, month - 1]
    : [year - 1, danetian_year_length(year - 1)];
}
export function next_danetian_month(year, month) {
  return month < danetian_year_length(year) ? [year, month + 1] : [year + 1, 1];
}
