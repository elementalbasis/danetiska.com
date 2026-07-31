function clearSelection(
  container,
  selectedClass
) {
  const previousSelection = container.querySelector(
    `.${selectedClass}`
  );

  if (!previousSelection) {
    return;
  }

  previousSelection.classList.remove(selectedClass);
  previousSelection.removeAttribute("aria-selected");
}

/**
 * Allow day selection.
 */
export function enableDaySelection(calendar) {
  calendar.addEventListener("click", event => {
    const selectedDay = event.target.closest(
      ".month-calendar__day"
    );

    if (!selectedDay || !calendar.contains(selectedDay)) {
      return;
    }

    clearSelection(
      calendar,
      "month-calendar__day--selected"
    );

    selectedDay.classList.add(
      "month-calendar__day--selected"
    );

    selectedDay.setAttribute("aria-selected", "true");

    calendar.dispatchEvent(
      new CustomEvent("calendar-day-selected", {
        bubbles: true,
        detail: {
          day: Number(selectedDay.dataset.day)
        }
      })
    );
  });
}

/**
 * Allow month selection.
 */
export function enableMonthSelection(calendar) {
  calendar.addEventListener("click", event => {
    const selectedMonth = event.target.closest(
      ".year-calendar__month"
    );

    if (
      !selectedMonth ||
      !calendar.contains(selectedMonth)
    ) {
      return;
    }

    clearSelection(
      calendar,
      "year-calendar__month--selected"
    );

    selectedMonth.classList.add(
      "year-calendar__month--selected"
    );

    selectedMonth.setAttribute("aria-selected", "true");

    calendar.dispatchEvent(
      new CustomEvent("calendar-month-selected", {
        bubbles: true,
        detail: {
          month: Number(selectedMonth.dataset.month)
        }
      })
    );
  });
}

/**
 * Dispatch a year-selection event.
 */
function selectYear(calendar, selectedYear) {
  if (
    !selectedYear ||
    !calendar.contains(selectedYear) ||
    !selectedYear.dataset.year
  ) {
    return;
  }

  clearSelection(
    calendar,
    "century-calendar__year--selected"
  );

  selectedYear.classList.add(
    "century-calendar__year--selected"
  );

  selectedYear.setAttribute("aria-selected", "true");

  calendar.dispatchEvent(
    new CustomEvent("calendar-year-selected", {
      bubbles: true,
      detail: {
        year: Number(selectedYear.dataset.year)
      }
    })
  );
}

/**
 * Allow year selection from the century table.
 */
export function enableYearSelection(calendar) {
  calendar.addEventListener("click", event => {
    const selectedYear = event.target.closest(
      ".century-calendar__year[data-year]"
    );

    selectYear(calendar, selectedYear);
  });

  calendar.addEventListener("keydown", event => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    const selectedYear = event.target.closest(
      ".century-calendar__year[data-year]"
    );

    if (!selectedYear) {
      return;
    }

    event.preventDefault();
    selectYear(calendar, selectedYear);
  });
}

/**
 * Open the year view when the month title is clicked.
 */
export function enableMonthToYearNavigation(
  monthCalendar,
  yearCalendar
) {
  const monthTitle = monthCalendar.querySelector(
    ".month-calendar__title"
  );

  if (!monthTitle || !yearCalendar) {
    return;
  }

  monthTitle.addEventListener("click", () => {
    monthCalendar.hidden = true;
    yearCalendar.hidden = false;

    const yearTitle = yearCalendar.querySelector(
      ".year-calendar__title"
    );

    yearTitle?.focus();
  });
}

/**
 * Return to the month view when a month is selected.
 */
export function enableYearToMonthNavigation(
  yearCalendar,
  monthCalendar,
  monthNames
) {
  yearCalendar.addEventListener(
    "calendar-month-selected",
    event => {
      const selectedMonth = event.detail.month;

      const monthTitle = monthCalendar.querySelector(
        ".month-calendar__title"
      );

      const yearTitle = yearCalendar.querySelector(
        ".year-calendar__title"
      );

      const monthName =
        monthNames[selectedMonth - 1] ||
        `Month ${selectedMonth}`;

      const yearName =
        yearTitle?.textContent.trim() || "";

      monthCalendar.dataset.month =
        String(selectedMonth);

      if (monthTitle) {
        monthTitle.textContent = yearName
          ? `${monthName} ${yearName}`
          : monthName;
      }

      yearCalendar.hidden = true;
      monthCalendar.hidden = false;

      monthTitle?.focus();
    }
  );
}

/**
 * Open the century view when the year title is clicked.
 */
export function enableYearToCenturyNavigation(
  yearCalendar,
  centuryCalendar
) {
  const yearTitle = yearCalendar.querySelector(
    ".year-calendar__title"
  );

  if (!yearTitle || !centuryCalendar) {
    return;
  }

  yearTitle.addEventListener("click", () => {
    yearCalendar.hidden = true;
    centuryCalendar.hidden = false;

    const currentYear = Number(
      yearCalendar.dataset.year ||
      yearTitle.textContent.trim()
    );

    const matchingYear = centuryCalendar.querySelector(
      `[data-year="${currentYear}"]`
    );

    const firstYear = centuryCalendar.querySelector(
      ".century-calendar__year[data-year]"
    );

    (matchingYear || firstYear)?.focus();
  });
}

/**
 * Return to the year view when a year is selected.
 */
export function enableCenturyToYearNavigation(
  centuryCalendar,
  yearCalendar
) {
  centuryCalendar.addEventListener(
    "calendar-year-selected",
    event => {
      const selectedYear = event.detail.year;

      const yearTitle = yearCalendar.querySelector(
        ".year-calendar__title"
      );

      yearCalendar.dataset.year =
        String(selectedYear);

      if (yearTitle) {
        yearTitle.textContent = String(selectedYear);
      }

      centuryCalendar.hidden = true;
      yearCalendar.hidden = false;

      yearTitle?.focus();
    }
  );
}
