import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import test from "node:test";
const source = await readFile(
  new URL("../assets/scripts/calendar/calendar-arithmetic.js", import.meta.url),
  "utf8",
);
const calendar = await import(
  "data:text/javascript;base64," + Buffer.from(source).toString("base64")
);

test("calendar epochs describe the same absolute day", () => {
  assert.equal(calendar.gregorian_to_julian_day(2025, 3, 29), 2460764);
  assert.equal(calendar.julian_to_julian_day(2025, 3, 16), 2460764);
  assert.equal(calendar.danetian_to_julian_day(3351, 1, 1), 2460764);
  assert.equal(calendar.gregorian_to_julian_day(2000, 1, 1), 2451545);
});
test("all calendars round trip across leap cycles, the epoch, year zero, and BCE dates", () => {
  for (const name of ["gregorian", "julian", "danetian"]) {
    for (const jd of [
      0, 1237193, 1721059, 2299160, 2415080, 2451545, 2460763, 2460764, 2460765,
      2500000,
    ]) {
      const date = calendar[`${name}_from_julian_day`](jd);
      assert.equal(
        calendar[`${name}_to_julian_day`](...date),
        jd,
        `${name}: ${date}`,
      );
    }
  }
});
test("Danetian month transitions account for the intercalary month", () => {
  assert.equal(
    Array.from({ length: 19 }, (_, i) =>
      calendar.danetian_year_length(i + 1),
    ).reduce((a, b) => a + b),
    235,
  );
  assert.equal(
    Array.from({ length: 334 }, (_, i) =>
      calendar.danetian_year_length(i + 1),
    ).reduce((a, b) => a + b),
    4131,
  );
  for (const year of [-2, 0, 1, 19, 20, 333, 334, 335, 3351, 3352]) {
    const last = calendar.danetian_year_length(year);
    assert.deepEqual(calendar.next_danetian_month(year, last), [year + 1, 1]);
    assert.deepEqual(calendar.previous_danetian_month(year + 1, 1), [
      year,
      last,
    ]);
    for (let month = 1; month <= last; month += 1) {
      const data = calendar.get_danetian_month_data(year, month);
      assert([29, 30].includes(data.dayCount));
      assert(data.startWeekday >= 0 && data.startWeekday <= 6);
    }
  }
});
test("formatting preserves signed years; invalid calculator inputs cannot loop", () => {
  assert.equal(calendar.iso_format(-1325, 4, 3), "-1325-04-03");
  assert.deepEqual(
    calendar.interpret_date_string("-1325-04-03"),
    [-1325, 4, 3],
  );
  assert.throws(() => calendar.interpret_date_string("tomorrow"), RangeError);
  assert.throws(
    () => calendar.gregorian_to_julian_day(1900, 2, 29),
    RangeError,
  );
  assert.throws(() => calendar.danetian_to_julian_day(3351, 14, 1), RangeError);
});
