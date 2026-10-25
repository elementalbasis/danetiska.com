import {
  danetian_today_string,
  gregorian_today_string,
  gregorian_to_julian_day,
  danetian_from_julian_day,
  verbose_format,
  DANETIAN_MONTH_NAMES,
} from "./calendar/calendar-arithmetic.js";

const today = {
  danetian_date_today: danetian_today_string(),
  gregorian_date_today: gregorian_today_string(),
};
for (const [id, value] of Object.entries(today)) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}
for (const element of document.querySelectorAll("[data-danetian-date]")) {
  const [year, month, day] = element.dataset.danetianDate
    .split("-")
    .map(Number);
  const [y, m, d] = danetian_from_julian_day(
    gregorian_to_julian_day(year, month, day),
  );
  element.textContent = verbose_format(y, m, d, DANETIAN_MONTH_NAMES);
}
