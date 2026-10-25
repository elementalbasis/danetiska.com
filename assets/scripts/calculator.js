import * as calendar from "./calendar/calendar-arithmetic.js";

const form = document.getElementById("form_calendar_calculator");
const outputs = ["gregorian", "julian", "danetian"];
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.getElementById("input_date");
  input.setCustomValidity("");
  try {
    const date = calendar.interpret_date_string(input.value);
    const type = { g: "gregorian", j: "julian", d: "danetian" }[
      document.getElementById("select_calendar").value
    ];
    const day = calendar[`${type}_to_julian_day`](...date);
    for (const name of outputs) {
      document.getElementById(`result_${name}`).textContent =
        calendar.iso_format(...calendar[`${name}_from_julian_day`](day)) +
        name[0];
    }
    document.getElementById("result_danetian_linear_count").textContent =
      String(day - 1237193);
  } catch (error) {
    for (const name of [...outputs, "danetian_linear_count"])
      document.getElementById(`result_${name}`).textContent = "";
    input.setCustomValidity(error.message);
    input.reportValidity();
  }
});
form.addEventListener("input", () =>
  document.getElementById("input_date").setCustomValidity(""),
);
