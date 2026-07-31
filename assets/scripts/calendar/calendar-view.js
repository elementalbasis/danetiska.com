import {
  DANETIAN_MONTH_NAMES,
  danetian_year_length,
  get_current_danetian_date,
  get_danetian_month_data,
  previous_danetian_month,
  next_danetian_month
} from "./calendar-arithmetic.js";

import {
  renderMonth,
  renderYear,
  renderCentury
} from "./calendar-render.js";

/**
 * Return the first year of the century containing year.
 *
 * Examples:
 * 4452 -> 4400
 * 4400 -> 4400
 * -25  -> -100
 */
function centuryStartForYear(year) {
  return Math.floor(year / 100) * 100;
}

/**
 * Keep the selected month valid when moving between years.
 *
 * A year may contain either 12 or 13 months.
 */
function clampMonthToYear(year, month) {
  return Math.min(
    month,
    danetian_year_length(year)
  );
}

/**
 * Display only one of the three calendar views.
 */
function showView(
  view,
  monthCalendar,
  yearCalendar,
  centuryCalendar
) {
  monthCalendar.hidden = view !== "month";
  yearCalendar.hidden = view !== "year";
  centuryCalendar.hidden = view !== "century";
}

/**
 * Display an initialization error inside the calendar.
 */
function displayCalendarError(container, message) {
  container.replaceChildren();

  const paragraph = document.createElement("p");

  paragraph.className = "calendar-view__error";
  paragraph.textContent = message;

  container.appendChild(paragraph);
}

/**
 * Initialize one complete month/year/century calendar viewer.
 */
function initializeCalendarViewer(container) {
  const monthCalendar = container.querySelector(
    "[data-month-calendar]"
  );

  const yearCalendar = container.querySelector(
    "[data-year-calendar]"
  );

  const centuryCalendar = container.querySelector(
    "[data-century-calendar]"
  );

  if (
    !monthCalendar ||
    !yearCalendar ||
    !centuryCalendar
  ) {
    throw new Error(
      "The calendar viewer requires month, year, and century views."
    );
  }

  const today = get_current_danetian_date();

  const state = {
    year: today.year,
    month: today.month,
    selectedDay: today.day,
    centuryStart: centuryStartForYear(today.year)
  };

  const monthTitle = monthCalendar.querySelector(
    ".month-calendar__title"
  );

  const yearTitle = yearCalendar.querySelector(
    ".year-calendar__title"
  );

  const centuryTitle = centuryCalendar.querySelector(
    ".century-calendar__title"
  );

  /**
   * Render the currently selected Danetian month.
   */
  function renderCurrentMonth() {
    const monthData = get_danetian_month_data(
      state.year,
      state.month
    );

    monthCalendar.dataset.year = String(state.year);
    monthCalendar.dataset.month = String(state.month);
    monthCalendar.dataset.days =
      String(monthData.dayCount);

    monthCalendar.dataset.start =
      String(monthData.startWeekday);

    if (monthTitle) {
      monthTitle.textContent =
        `${monthData.monthName} ${state.year}`;
    }

    renderMonth(
      monthCalendar,
      monthData.dayCount,
      monthData.startWeekday
    );

    /*
     * Highlight today only when viewing today's month.
     */
    if (
      state.year === today.year &&
      state.month === today.month
    ) {
      const todayButton = monthCalendar.querySelector(
        `.month-calendar__day[data-day="${today.day}"]`
      );

      if (todayButton) {
        todayButton.classList.add(
          "month-calendar__day--selected"
        );

        todayButton.setAttribute(
          "aria-selected",
          "true"
        );
      }
    }
  }

  /**
   * Render the currently selected Danetian year.
   */
  function renderCurrentYear() {
    const monthCount =
      danetian_year_length(state.year);

    yearCalendar.dataset.year =
      String(state.year);

    yearCalendar.dataset.months =
      String(monthCount);

    if (yearTitle) {
      yearTitle.textContent = String(state.year);
    }

    renderYear(
      yearCalendar,
      monthCount,
      DANETIAN_MONTH_NAMES
    );

    const selectedMonth = yearCalendar.querySelector(
      `.year-calendar__month[data-month="${state.month}"]`
    );

    if (selectedMonth) {
      selectedMonth.classList.add(
        "year-calendar__month--selected"
      );

      selectedMonth.setAttribute(
        "aria-selected",
        "true"
      );
    }
  }

  /**
   * Render the currently selected century.
   */
  function renderCurrentCentury() {
    const finalYear = state.centuryStart + 99;

    centuryCalendar.dataset.startYear =
      String(state.centuryStart);

    centuryCalendar.dataset.years = "100";

    if (centuryTitle) {
      centuryTitle.textContent =
        `${state.centuryStart}`;
    }

    renderCentury(
      centuryCalendar,
      state.centuryStart,
      100
    );

    if (
      state.year >= state.centuryStart &&
      state.year <= finalYear
    ) {
      const selectedYear =
        centuryCalendar.querySelector(
          `.century-calendar__year[data-year="${state.year}"]`
        );

      if (selectedYear) {
        selectedYear.classList.add(
          "century-calendar__year--selected"
        );

        selectedYear.setAttribute(
          "aria-selected",
          "true"
        );
      }
    }
  }

  /**
   * Refresh all three views from the shared state.
   */
  function renderAllViews() {
    state.month = clampMonthToYear(
      state.year,
      state.month
    );

    renderCurrentMonth();
    renderCurrentYear();
    renderCurrentCentury();
  }

  /*
   * Month navigation arrows.
   */
  monthCalendar
    .querySelector(".month-calendar__previous")
    ?.addEventListener("click", () => {
      [state.year, state.month] =
        previous_danetian_month(
          state.year,
          state.month
        );

      state.centuryStart =
        centuryStartForYear(state.year);

      renderAllViews();
    });

  monthCalendar
    .querySelector(".month-calendar__next")
    ?.addEventListener("click", () => {
      [state.year, state.month] =
        next_danetian_month(
          state.year,
          state.month
        );

      state.centuryStart =
        centuryStartForYear(state.year);

      renderAllViews();
    });

  /*
   * Clicking the month title opens the year view.
   */
  monthTitle?.addEventListener("click", () => {
    renderCurrentYear();

    showView(
      "year",
      monthCalendar,
      yearCalendar,
      centuryCalendar
    );

    yearTitle?.focus();
  });

  /*
   * Day selection.
   */
  monthCalendar.addEventListener("click", event => {
    const dayButton = event.target.closest(
      ".month-calendar__day[data-day]"
    );

    if (
      !dayButton ||
      !monthCalendar.contains(dayButton)
    ) {
      return;
    }

    monthCalendar
      .querySelector(
        ".month-calendar__day--selected"
      )
      ?.classList.remove(
        "month-calendar__day--selected"
      );

    monthCalendar
      .querySelector('[aria-selected="true"]')
      ?.removeAttribute("aria-selected");

    dayButton.classList.add(
      "month-calendar__day--selected"
    );

    dayButton.setAttribute(
      "aria-selected",
      "true"
    );

    state.selectedDay =
      Number(dayButton.dataset.day);
  });

  /*
   * Year navigation arrows.
   */
  yearCalendar
    .querySelector(".year-calendar__previous")
    ?.addEventListener("click", () => {
      state.year -= 1;

      state.month = clampMonthToYear(
        state.year,
        state.month
      );

      state.centuryStart =
        centuryStartForYear(state.year);

      renderAllViews();
    });

  yearCalendar
    .querySelector(".year-calendar__next")
    ?.addEventListener("click", () => {
      state.year += 1;

      state.month = clampMonthToYear(
        state.year,
        state.month
      );

      state.centuryStart =
        centuryStartForYear(state.year);

      renderAllViews();
    });

  /*
   * Clicking the year title opens the century view.
   */
  yearTitle?.addEventListener("click", () => {
    state.centuryStart =
      centuryStartForYear(state.year);

    renderCurrentCentury();

    showView(
      "century",
      monthCalendar,
      yearCalendar,
      centuryCalendar
    );

    const selectedYear =
      centuryCalendar.querySelector(
        `.century-calendar__year[data-year="${state.year}"]`
      );

    selectedYear?.focus();
  });

  /*
   * Selecting a month returns to the month view.
   */
  yearCalendar.addEventListener("click", event => {
    const monthButton = event.target.closest(
      ".year-calendar__month[data-month]"
    );

    if (
      !monthButton ||
      !yearCalendar.contains(monthButton)
    ) {
      return;
    }

    state.month =
      Number(monthButton.dataset.month);

    renderCurrentMonth();

    showView(
      "month",
      monthCalendar,
      yearCalendar,
      centuryCalendar
    );

    monthTitle?.focus();
  });

  /*
   * Century navigation arrows.
   */
  centuryCalendar
    .querySelector(".century-calendar__previous")
    ?.addEventListener("click", () => {
      state.centuryStart -= 100;
      renderCurrentCentury();
    });

  centuryCalendar
    .querySelector(".century-calendar__next")
    ?.addEventListener("click", () => {
      state.centuryStart += 100;
      renderCurrentCentury();
    });

  /*
   * Selecting a year returns to the year view.
   */
  centuryCalendar.addEventListener(
    "click",
    event => {
      const yearButton = event.target.closest(
        ".century-calendar__year[data-year]"
      );

      if (
        !yearButton ||
        !centuryCalendar.contains(yearButton)
      ) {
        return;
      }

      state.year =
        Number(yearButton.dataset.year);

      state.month = clampMonthToYear(
        state.year,
        state.month
      );

      renderCurrentYear();
      renderCurrentMonth();

      showView(
        "year",
        monthCalendar,
        yearCalendar,
        centuryCalendar
      );

      yearTitle?.focus();
    }
  );

  /*
   * Initial display.
   */
  renderAllViews();

  showView(
    "month",
    monthCalendar,
    yearCalendar,
    centuryCalendar
  );
}

/**
 * Initialize every calendar viewer on the page.
 */
function initializeCalendarViews() {
  const calendarViews = document.querySelectorAll(
    ".calendar-view"
  );

  calendarViews.forEach(container => {
    try {
      initializeCalendarViewer(container);
    } catch (error) {
      console.error(
        "Could not initialize calendar viewer:",
        error
      );

      displayCalendarError(
        container,
        "The calendar could not be displayed."
      );
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeCalendarViews,
    { once: true }
  );
} else {
  initializeCalendarViews();
}
