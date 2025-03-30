document.getElementById('form_calendar_calculator').addEventListener('submit', function(event) {
	event.preventDefault()

	var date_string = document.getElementById('input_date').value
	var calendar_type = document.getElementById('select_calendar').value

	var [y, m, d] = interpret_date_string(date_string)

	var n = 0
	if (calendar_type == "g") {
		n = gregorian_to_julian_day(y, m, d)
	} else if (calendar_type == "j") {
		n = julian_to_julian_day(y, m, d)
	} else if (calendar_type == "d") {
		n = danetian_to_julian_day(y, m, d)
	} else {
		n = 0
	}

	var [yg, mg, dg] = gregorian_from_julian_day(n)
	var [yj, mj, dj] = julian_from_julian_day(n)
	var [yd, md, dd] = danetian_from_julian_day(n)
	var date_g = iso_format(yg, mg, dg) + 'g'
	var date_j = iso_format(yj, mj, dj) + 'j'
	var date_d = iso_format(yd, md, dd) + 'd'

	document.getElementById('result_gregorian').innerText = `${date_g}`
	document.getElementById('result_julian').innerText = `${date_j}`
	document.getElementById('result_danetian').innerText = `${date_d}`
})

