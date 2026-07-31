export const DANETIAN_MONTH_NAMES = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
  "Intercalaris"
];

/**
 * Render a month.
 *
 * startWeekday:
 * 0 = Sunday
 * 1 = Monday
 * 2 = Tuesday
 * 3 = Wednesday
 * 4 = Thursday
 * 5 = Friday
 * 6 = Saturday
 */
export function renderMonth(
  calendar,
  dayCount,
  startWeekday
) {
  const daysContainer = calendar.querySelector(
    ".month-calendar__days"
  );

  if (!daysContainer) {
    return;
  }

  if (!Number.isInteger(dayCount) || dayCount < 1) {
    throw new RangeError(
      "dayCount must be a positive integer."
    );
  }

  if (
    !Number.isInteger(startWeekday) ||
    startWeekday < 0 ||
    startWeekday > 6
  ) {
    throw new RangeError(
      "startWeekday must be an integer from 0 to 6."
    );
  }

  daysContainer.replaceChildren();

  const fragment = document.createDocumentFragment();

  /*
   * Blank cells before the first day.
   */
  for (let index = 0; index < startWeekday; index += 1) {
    const emptyCell = document.createElement("span");

    emptyCell.className = "month-calendar__empty";
    emptyCell.setAttribute("aria-hidden", "true");

    fragment.appendChild(emptyCell);
  }

  /*
   * Days of the month.
   */
  for (let day = 1; day <= dayCount; day += 1) {
    const dayButton = document.createElement("button");
    const dayNumber = document.createElement("span");

    dayButton.type = "button";
    dayButton.className = "month-calendar__day";
    dayButton.dataset.day = String(day);
    dayButton.setAttribute("role", "gridcell");
    dayButton.setAttribute("aria-label", `Day ${day}`);

    dayNumber.className = "month-calendar__day-number";
    dayNumber.textContent = String(day);

    dayButton.appendChild(dayNumber);
    fragment.appendChild(dayButton);
  }

  /*
   * Blank cells after the final day.
   */
  const usedCells = startWeekday + dayCount;
  const trailingCells = (7 - (usedCells % 7)) % 7;

  for (let index = 0; index < trailingCells; index += 1) {
    const emptyCell = document.createElement("span");

    emptyCell.className = "month-calendar__empty";
    emptyCell.setAttribute("aria-hidden", "true");

    fragment.appendChild(emptyCell);
  }

  daysContainer.appendChild(fragment);
}

/**
 * Render a year as a rectangular grid of months.
 */
export function renderYear(
  calendar,
  monthCount,
  monthNames = DANETIAN_MONTH_NAMES
) {
  const monthsContainer = calendar.querySelector(
    ".year-calendar__months"
  );

  if (!monthsContainer) {
    return;
  }

  if (!Number.isInteger(monthCount) || monthCount < 1) {
    throw new RangeError(
      "monthCount must be a positive integer."
    );
  }

  monthsContainer.replaceChildren();

  const fragment = document.createDocumentFragment();
  const columnCount = 3;

  for (let month = 1; month <= monthCount; month += 1) {
    const monthButton = document.createElement("button");
    const monthNumber = document.createElement("span");
    const monthName = document.createElement("span");

    const displayedName =
      monthNames[month - 1] || `Month ${month}`;

    monthButton.type = "button";
    monthButton.className = "year-calendar__month";
    monthButton.dataset.month = String(month);
    monthButton.setAttribute("role", "gridcell");
    monthButton.setAttribute(
      "aria-label",
      `Month ${month}: ${displayedName}`
    );

    monthNumber.className =
      "year-calendar__month-number";

    monthNumber.textContent = `Month ${month}`;

    monthName.className =
      "year-calendar__month-name";

    monthName.textContent = displayedName;

    monthButton.append(monthNumber, monthName);
    fragment.appendChild(monthButton);
  }

  /*
   * Fill the final row so its grid lines remain complete.
   */
  const trailingCells =
    (columnCount - (monthCount % columnCount)) %
    columnCount;

  for (let index = 0; index < trailingCells; index += 1) {
    const emptyCell = document.createElement("span");

    emptyCell.className = "year-calendar__empty";
    emptyCell.setAttribute("aria-hidden", "true");

    fragment.appendChild(emptyCell);
  }

  monthsContainer.appendChild(fragment);
}

/**
 * Render a century as a 10-by-10 table.
 *
 * The table cells remain structural. Each selectable year is
 * rendered as a button inside its corresponding table cell.
 */
export function renderCentury(
  calendar,
  startYear,
  yearCount = 100
) {
  const yearsContainer = calendar.querySelector(
    ".century-calendar__years"
  );

  if (!yearsContainer) {
    return;
  }

  yearsContainer.replaceChildren();

  const fragment = document.createDocumentFragment();

  for (
    let year = startYear;
    year < startYear + yearCount;
    year += 1
  ) {
    const yearButton = document.createElement("button");

    yearButton.type = "button";
    yearButton.className = "century-calendar__year";
    yearButton.dataset.year = String(year);
    yearButton.textContent = String(year);

    fragment.appendChild(yearButton);
  }

  yearsContainer.appendChild(fragment);
}
